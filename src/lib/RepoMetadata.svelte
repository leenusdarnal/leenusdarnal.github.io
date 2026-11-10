<script>
  import { onMount } from 'svelte';

  let { projects = [] } = $props();

  /** @param {string} value */
  function relativeTime(value) {
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) return 'date unavailable';
    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    /** @type {Array<[string, number]>} */
    const units = [['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]];
    for (const [label, size] of units) if (seconds >= size) return Math.floor(seconds / size) + label + ' ago';
    return 'just now';
  }

  onMount(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const stored = (() => {
        try { return JSON.parse(sessionStorage.getItem('leenus_lab_repos_v1') || 'null'); } catch { return null; }
      })();
      const now = Date.now();
      const cacheFresh = Number.isFinite(stored?.timestamp) && stored.timestamp <= now && now - stored.timestamp < 3600000 && Array.isArray(stored.data);
      /** @param {any[]} repos */
      const applyRepos = (repos) => {
        for (const project of projects) {
          const repoName = project.source.split('/').pop()?.toLowerCase();
          const repo = repos.find((item) => item.name?.toLowerCase() === repoName);
          const target = /** @type {HTMLElement | null} */ (document.querySelector('[data-repo-meta="' + project.slug + '"]'));
          const stars = /** @type {HTMLElement | null} */ (document.querySelector('[data-repo-stars="' + project.slug + '"]'));
          if (target && repo?.pushed_at) {
            target.textContent = 'Updated ' + relativeTime(repo.pushed_at);
            target.hidden = false;
          }
          if (stars && Number(repo?.stargazers_count) > 0) {
            stars.textContent = '★ ' + repo.stargazers_count;
            stars.hidden = false;
          }
        }
      };
      if (cacheFresh) {
        applyRepos(stored.data);
        return;
      }
      fetch('https://api.github.com/users/leenusdarnal/repos?sort=updated&per_page=100', {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal
      })
        .then((response) => {
          if (!response.ok) throw new Error('GitHub API unavailable');
          return response.json();
        })
        .then((data) => {
          if (!Array.isArray(data)) throw new Error('Unexpected GitHub API response');
          applyRepos(data);
          try { sessionStorage.setItem('leenus_lab_repos_v1', JSON.stringify({ timestamp: Date.now(), data })); } catch {}
        })
        .catch(() => {});
    }, 1500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  });
</script>
