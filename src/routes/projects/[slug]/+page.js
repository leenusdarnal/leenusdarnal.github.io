import { projects } from '../../../lib/projects';

export const prerender = true;
export const trailingSlash = 'always';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return projects.map(({ slug }) => ({ slug }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const project = projects.find((item) => item.slug === params.slug);
  return { project: project ?? null };
}
