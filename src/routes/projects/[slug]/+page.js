import { error } from '@sveltejs/kit';
import { projects } from '$lib/projects.js';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return projects.map(({ slug }) => ({ slug }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) error(404, 'Project not found');
  return { project };
}
