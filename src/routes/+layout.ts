import type { LayoutLoad } from './$types'

export const load = (async () => {
    return {}
}) satisfies LayoutLoad

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true