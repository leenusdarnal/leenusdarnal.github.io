<script lang="ts">
	import { sections } from '$lib/site-content';

	let theme = $state<'dark' | 'light'>('dark');

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.dataset.theme = theme;
		}
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
	}
</script>

<svelte:head>
	<title>Leenus Darnal</title>
	<meta
		name="description"
		content="A personal corner of the internet for notes, projects, experiments, and collections."
	/>
	<meta name="theme-color" content="#111111" />
</svelte:head>

<main class="page">
	<header class="topbar">
		<a class="site-name" href="/" aria-label="Leenus Darnal home">Leenus Darnal</a>
		<button class="theme-toggle" type="button" onclick={toggleTheme}>
			{theme === 'dark' ? 'Light mode' : 'Dark mode'}
		</button>
	</header>

	<section class="intro" aria-labelledby="intro-title">
		<p class="eyebrow">A PERSONAL SITE</p>
		<h1 id="intro-title">Exploring Technology.<br />Building What's Next.</h1>
		<p class="intro-copy">
			A small place for notes, projects, experiments, links, and other things I want to keep.
		</p>
	</section>

	<nav class="section-nav" aria-label="Page sections">
		{#each sections as section (section.id)}
			<a href={'#' + section.id}>{section.title}</a>
		{/each}
	</nav>

	<div class="sections">
		{#each sections as section (section.id)}
			<section class="content-section" id={section.id} aria-labelledby={section.id + '-title'}>
				<div class="section-heading">
					<h2 id={section.id + '-title'}>{section.title}</h2>
					<p>{section.description}</p>
				</div>

				{#if section.items.length > 0}
					<ul class="item-list">
						{#each section.items as item, index (section.id + '-' + index)}
							<li>
								<div class="item-title">
									{#if item.href}
										<a href={item.href} target="_blank" rel="noreferrer">{item.title}</a>
									{:else}
										<span>{item.title}</span>
									{/if}
								</div>
								{#if item.description}
									<p>{item.description}</p>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">Nothing here yet.</p>
				{/if}
			</section>
		{/each}
	</div>

	<footer class="footer">
		<span>Leenus Darnal</span>
		<a href="https://github.com/leenusdarnal" target="_blank" rel="noreferrer">GitHub</a>
	</footer>
</main>
