import { personalSpaceConfig } from '../../lib/personal-space.config';
import { projects } from '../../lib/projects';

export const prerender = true;

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[character]);
}

export function GET() {
  const baseUrl = personalSpaceConfig.site.url.replace(/\/$/, '');
  const items = projects.map((project) => {
    const link = baseUrl + '/projects/' + encodeURIComponent(project.slug) + '/';
    return `    <item>
      <title>${escapeXml(project.name)}</title>
      <description>${escapeXml(project.caseStudy.summary)}</description>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <category>${escapeXml(project.caseStudy.category)}</category>
    </item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(personalSpaceConfig.site.title)}</title>
    <description>${escapeXml(personalSpaceConfig.site.description)}</description>
    <link>${escapeXml(baseUrl + '/')}</link>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
