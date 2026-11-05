// Add your own entries to the sections below.
// Each item can have a title, an optional description, and an optional URL.

export type SiteItem = {
	title: string;
	description?: string;
	href?: string;
};

export type SiteSection = {
	id: string;
	title: string;
	description: string;
	items: SiteItem[];
};

export const sections: SiteSection[] = [
	{
		id: 'notes',
		title: 'Notes',
		description: 'Thoughts, useful snippets, and things worth remembering.',
		items: []
	},
	{
		id: 'things',
		title: 'Things',
		description: 'Small projects, experiments, and things I have been making.',
		items: []
	},
	{
		id: 'collections',
		title: 'Collections',
		description: 'Links, references, and other things I want to keep close.',
		items: []
	}
];
