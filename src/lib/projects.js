export const projects = [
  {
    number: '01',
    slug: 'pixelforge-studio',
    page: '/projects/pixelforge-studio/',
    name: 'PixelForge Studio',
    type: 'IMAGE EDITOR · BROWSER APP',
    description: 'A touch-friendly image editor for creating and refining images in the browser, with layers, selection tools, adjustments and export.',
    overview: 'PixelForge Studio is a browser-based image editor for creating and refining images without installing a desktop application. Its interface is designed to work with touch as well as a mouse.',
    capabilities: ['Work with layers and selections.', 'Use drawing and editing tools.', 'Adjust an image and step through editing history.', 'Export the finished image.'],
    stack: ['JavaScript', 'Canvas', 'PWA'],
    live: 'https://pixelforge-studio-pied.vercel.app/',
    source: 'https://github.com/leenusdarnal/pixelforge-studio',
    note: 'This is a browser-based image editor, not a full Photoshop replacement. Artwork stays in your browser unless you choose to export it.'
  },
  {
    number: '02',
    slug: 'metronome',
    page: '/projects/metronome/',
    name: 'Metronome',
    type: 'MUSIC PRACTICE · WEB APP',
    description: 'A straightforward practice metronome with tempo control, playback and selectable time signatures.',
    overview: 'Metronome is a simple browser-based practice tool for keeping time during music practice. The tempo can be adjusted and playback can be started or stopped when needed.',
    capabilities: ['Adjust the tempo with a slider.', 'Start and stop the beat.', 'Choose between 1/4, 2/4, 3/4 and 4/4 time signatures.'],
    stack: ['React', 'TypeScript', 'Vite'],
    live: 'https://react-metronome-dusky.vercel.app/',
    source: 'https://github.com/leenusdarnal/react-metronome',
    note: 'The browser may require a user interaction before audio playback can begin.'
  },
  {
    number: '03',
    slug: 'sikkim-salary-calculator',
    page: '/projects/sikkim-salary-calculator/',
    name: 'Sikkim Government Salary Calculator',
    type: 'REFERENCE TOOL · SIKKIM',
    description: 'A browser-based calculator for estimating gross pay, common deductions and in-hand salary from pay details.',
    overview: 'The Sikkim Government Salary Calculator is a browser-based reference tool for estimating monthly salary figures from pay details such as pay level, basic pay and the applicable DA rate.',
    capabilities: ['Enter pay details for an estimate.', 'View estimated gross pay and common deductions.', 'Review an estimated in-hand salary.'],
    stack: ['JavaScript', 'HTML', 'CSS'],
    live: 'https://sikkim-government-salary-calculator.vercel.app/',
    source: 'https://github.com/leenusdarnal/SIKKIM-GOVERNMENT-SALARY-CALCULATOR',
    note: 'This tool is for reference only. Actual pay depends on the applicable government orders and individual service details.'
  }
];
