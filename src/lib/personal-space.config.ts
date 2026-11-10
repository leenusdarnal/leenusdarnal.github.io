/**
 * Typed source of truth for site identity, appearance, copy and section visibility.
 *
 * Keep project-specific details in projects.ts. Components should consume this
 * object rather than duplicating editable copy, links or theme preferences.
 */
export type ThemePreference = 'system' | 'light' | 'dark';
export type NavigationSection = 'projects' | 'about' | 'contact';

export interface PersonalSpaceConfig {
  identity: {
    name: string;
    firstName: string;
    lastName: string;
    monogram: string;
    handle: string;
  };
  site: {
    url: string;
    title: string;
    description: string;
    author: string;
    hosting: string;
    githubUrl: string;
    repositoryUrl: string;
    contactEmail: string;
    builtWith: string;
    twitterCard: 'summary' | 'summary_large_image';
    socialProfiles: readonly { label: string; url: string }[];
    socialImage: { url: string; type: string; width: number; height: number; alt: string };
  };
  appearance: {
    palette: string;
    defaultTheme: ThemePreference;
    themeStorageKey: string;
    themeColors: { light: string; dark: string };
  };
  sections: {
    projects: boolean;
    sourceExperiments: boolean;
    personalSpace: boolean;
    about: boolean;
    contact: boolean;
  };
  navigation: readonly { label: string; href: string; section: NavigationSection }[];
  content: {
    hero: {
      headline: string;
      description: string;
      tags: readonly string[];
      asideLines: readonly [string, string, string];
    };
    personalSpace: {
      eyebrow: string;
      title: string;
      intro: string;
      headline: string;
      statement: string;
      focus: readonly string[];
      principles: readonly string[];
    };
    about: {
      eyebrow: string;
      title: string;
      subtitle: string;
      paragraphs: readonly string[];
    };
    contact: {
      eyebrow: string;
      title: string;
      description: string;
    };
  };
}

export const personalSpaceConfig = {
  identity: {
    name: 'Leenus Darnal',
    firstName: 'Leenus',
    lastName: 'Darnal',
    monogram: 'L.',
    handle: 'leenus.lab'
  },
  site: {
    url: 'https://leenusdarnal.github.io/',
    title: 'Leenus Darnal — I build useful things',
    description: 'A personal space for useful web tools, practical projects and experiments by Leenus Darnal.',
    author: 'Leenus Darnal',
    hosting: 'GitHub Pages',
    githubUrl: 'https://github.com/leenusdarnal',
    repositoryUrl: 'https://github.com/leenusdarnal/leenusdarnal.github.io',
    contactEmail: 'leenus.darnal@gmail.com',
    builtWith: 'Built with SvelteKit & Tailwind CSS',
    twitterCard: 'summary_large_image',
    socialProfiles: [
      { label: 'GitHub', url: 'https://github.com/leenusdarnal' }
    ],
    socialImage: {
      url: 'https://leenusdarnal.github.io/og-image.png',
      type: 'image/png',
      width: 1200,
      height: 630,
      alt: 'Leenus Darnal — I build useful things'
    }
  },
  appearance: {
    palette: 'Slate & Emerald',
    defaultTheme: 'system',
    themeStorageKey: 'site-theme',
    themeColors: {
      light: '#f8fafc',
      dark: '#0b0f19'
    }
  },
  sections: {
    projects: true,
    sourceExperiments: true,
    personalSpace: true,
    about: true,
    contact: true
  },
  navigation: [
    { label: 'Projects', href: '#work', section: 'projects' },
    { label: 'About', href: '#about', section: 'about' },
    { label: 'Contact', href: '#contact', section: 'contact' }
  ],
  content: {
    hero: {
      headline: 'I build useful things',
      description: 'This is my little corner of the internet for browser-native tools, practical web apps and experiments. I like making everyday tasks simpler, exploring what the web can do and sharing what I learn.',
      tags: ['Useful tools', 'Browser experiments', 'Privacy-first apps', 'Learning by building'],
      asideLines: ['Curious by nature.', 'Practical by design.', 'Always building.']
    },
    personalSpace: {
      eyebrow: '01 / PERSONAL SPACE',
      title: 'A little about this corner',
      intro: 'This is less of a showcase and more of a workbench: useful things, small experiments and whatever I am learning next.',
      headline: 'A place to make, learn, and explore.',
      statement: 'A living collection of useful tools, creative experiments, and ideas worth following.',
      focus: [
        'Browser-native tools',
        'Privacy-first apps',
        'Creative coding',
        'Learning by building'
      ],
      principles: [
        'Useful over flashy',
        'Simple over noisy',
        'Curiosity over perfection'
      ]
    },
    about: {
      eyebrow: '02 / A LITTLE ABOUT ME',
      title: 'Curious by nature.',
      subtitle: 'Practical by design.',
      paragraphs: [
        'I enjoy turning everyday problems and passing ideas into useful digital tools. The things I make tend to sit somewhere between clean interfaces, browser capabilities and practical problem-solving.',
        "I like making things that feel simple to use, respect people's privacy and work well across devices. This site is where I keep a record of those experiments, share the projects that grow from them and collect what I learn along the way."
      ]
    },
    contact: {
      eyebrow: '03 / SAY HELLO',
      title: 'Have something interesting in mind?',
      description: "I'm always happy to hear about ideas, useful tools and interesting projects."
    }
  }
} as const satisfies PersonalSpaceConfig;
