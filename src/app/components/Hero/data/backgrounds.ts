export interface SafeZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ColorPalette {
  light: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    overlay: string;
  };
  dark: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    overlay: string;
  };
}

export type AnchorPoint = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'center-left' 
  | 'center' 
  | 'center-right'
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export interface BackgroundOption {
  id: string;
  imageUrl: string;
  anchorPoint: AnchorPoint; // Where the image should be anchored relative to container
  source: {
    name: string;
    url?: string;
    license?: string;
  };
  attribution: {
    name: string;
    url?: string;
  };
  captions: {
    abbreviated: string;
    brief: string;
    expansive: string;
  };
  safeZones: {
    main: SafeZone;
    secondary: SafeZone;
    caption: SafeZone;
    source: SafeZone;
    attribution: SafeZone;
  };
  colorPalette: ColorPalette;
}

export const backgrounds: BackgroundOption[] = [
  {
    id: 'whitepine-tree',
    imageUrl: '/whitepine-hero-background.svg',
    anchorPoint: 'center',
    source: {
      name: 'Whitepine Civic Platform',
      url: 'https://whitepine.org/',
      license: 'Original Design'
    },
    attribution: {
      name: 'Whitepine Design',
      url: 'https://whitepine.org/'
    },
    captions: {
      abbreviated: 'Great Tree of Peace',
      brief: 'The Great Tree of Peace shelters all nations',
      expansive: 'The Great Tree of Peace, inspired by the Haudenosaunee tradition, represents unity, consensus, and strength. Beneath its branches, all voices find shelter and all nations find harmony, continuing the legacy of peace in the digital age.'
    },
    safeZones: {
      main: { x: 200, y: 200, width: 800, height: 400 },
      secondary: { x: 900, y: 150, width: 600, height: 300 },
      caption: { x: 50, y: 800, width: 400, height: 100 },
      source: { x: 1400, y: 900, width: 300, height: 80 },
      attribution: { x: 1400, y: 980, width: 300, height: 60 }
    },
    colorPalette: {
      light: {
        primary: '#1e3a8a',
        secondary: '#16213e',
        accent: '#6b7a5a',
        text: '#ffffff',
        overlay: 'rgba(26, 26, 46, 0.4)'
      },
      dark: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#7a8a6b',
        text: '#ffffff',
        overlay: 'rgba(15, 52, 96, 0.5)'
      }
    }
  },
  {
    id: 'nature-bear',
    imageUrl: '/hero/qotd/0725_Nature_bear.jpg',
    anchorPoint: 'center',
    source: {
      name: 'California Department of Fish and Wildlife',
      url: 'https://wildlife.ca.gov/',
      license: 'Public Domain'
    },
    attribution: {
      name: 'CDFW',
      url: 'https://wildlife.ca.gov/'
    },
    captions: {
      abbreviated: 'California Bear',
      brief: 'California grizzly bear in natural habitat',
      expansive: 'A majestic California grizzly bear (Ursus arctos californicus) standing in its natural mountain habitat, representing the strength and wild spirit of California\'s wilderness and serving as the inspiration for the state flag.'
    },
    safeZones: {
      main: { x: 100, y: 200, width: 800, height: 400 },
      secondary: { x: 900, y: 150, width: 600, height: 300 },
      caption: { x: 50, y: 800, width: 400, height: 100 },
      source: { x: 1400, y: 900, width: 300, height: 80 },
      attribution: { x: 1400, y: 980, width: 300, height: 60 }
    },
    colorPalette: {
      light: {
        primary: '#1e40af',
        secondary: '#3730a3',
        accent: '#f59e0b',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.3)'
      },
      dark: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#fbbf24',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.5)'
      }
    }
  },
  {
    id: 'us-capitol',
    imageUrl: '/hero/qotd/U.S._Capitol_Building_@2x.jpg.webp',
    anchorPoint: 'bottom-center',
    source: {
      name: 'Architect of the Capitol',
      url: 'https://www.aoc.gov/',
      license: 'Public Domain'
    },
    attribution: {
      name: 'AOC Photo',
      url: 'https://www.aoc.gov/'
    },
    captions: {
      abbreviated: 'U.S. Capitol',
      brief: 'The United States Capitol Building',
      expansive: 'The majestic United States Capitol Building in Washington, D.C., standing as a symbol of American democracy and the legislative branch of government, its iconic dome rising above the National Mall.'
    },
    safeZones: {
      main: { x: 150, y: 250, width: 700, height: 350 },
      secondary: { x: 950, y: 200, width: 500, height: 250 },
      caption: { x: 50, y: 750, width: 350, height: 80 },
      source: { x: 1500, y: 900, width: 250, height: 70 },
      attribution: { x: 1500, y: 970, width: 250, height: 50 }
    },
    colorPalette: {
      light: {
        primary: '#1e40af',
        secondary: '#1d4ed8',
        accent: '#f59e0b',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.25)'
      },
      dark: {
        primary: '#ef4444',
        secondary: '#dc2626',
        accent: '#fbbf24',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.4)'
      }
    }
  },
  {
    id: 'yosemite-valley',
    imageUrl: '/hero/qotd/yosemite-valley.webp',
    anchorPoint: 'center',
    source: {
      name: 'Yosemite National Park',
      url: 'https://www.nps.gov/yose/',
      license: 'Public Domain'
    },
    attribution: {
      name: 'NPS Photo',
      url: 'https://www.nps.gov/yose/'
    },
    captions: {
      abbreviated: 'Yosemite',
      brief: 'Yosemite Valley with El Capitan',
      expansive: 'The breathtaking Yosemite Valley with the majestic El Capitan granite monolith rising dramatically from the valley floor, showcasing California\'s natural wonders and the preservation of America\'s wilderness heritage.'
    },
    safeZones: {
      main: { x: 200, y: 300, width: 600, height: 300 },
      secondary: { x: 900, y: 250, width: 400, height: 200 },
      caption: { x: 50, y: 800, width: 300, height: 80 },
      source: { x: 1400, y: 900, width: 250, height: 70 },
      attribution: { x: 1400, y: 970, width: 250, height: 50 }
    },
    colorPalette: {
      light: {
        primary: '#059669',
        secondary: '#047857',
        accent: '#f59e0b',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.2)'
      },
      dark: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#fbbf24',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.35)'
      }
    }
  },
  {
    id: 'california-coast',
    imageUrl: '/hero/qotd/california-coast.jpg',
    anchorPoint: 'top-left',
    source: {
      name: 'California State Parks',
      url: 'https://www.parks.ca.gov/',
      license: 'Public Domain'
    },
    attribution: {
      name: 'CSP Photo',
      url: 'https://www.parks.ca.gov/'
    },
    captions: {
      abbreviated: 'Pacific Coast',
      brief: 'California coastline at Big Sur',
      expansive: 'The rugged California coastline at Big Sur where the Santa Lucia Mountains meet the Pacific Ocean, representing the state\'s diverse geography and the meeting of land and sea that has shaped California\'s history and culture.'
    },
    safeZones: {
      main: { x: 100, y: 150, width: 450, height: 400 },
      secondary: { x: 900, y: 150, width: 550, height: 300 },
      caption: { x: 50, y: 750, width: 350, height: 80 },
      source: { x: 1450, y: 900, width: 250, height: 70 },
      attribution: { x: 1450, y: 970, width: 250, height: 50 }
    },
    colorPalette: {
      light: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#f59e0b',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.25)'
      },
      dark: {
        primary: '#38bdf8',
        secondary: '#0ea5e9',
        accent: '#fbbf24',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.4)'
      }
    }
  },
  {
    id: 'redwood-forest',
    imageUrl: '/hero/qotd/redwood-forest.jpg',
    anchorPoint: 'center',
    source: {
      name: 'Redwood National and State Parks',
      url: 'https://www.nps.gov/redw/',
      license: 'Public Domain'
    },
    attribution: {
      name: 'NPS Photo',
      url: 'https://www.nps.gov/redw/'
    },
    captions: {
      abbreviated: 'Redwoods',
      brief: 'Ancient redwood forest',
      expansive: 'Towering ancient redwood trees (Sequoia sempervirens) reaching toward the sky in a misty forest, representing California\'s natural heritage and the importance of environmental conservation and stewardship.'
    },
    safeZones: {
      main: { x: 150, y: 250, width: 700, height: 350 },
      secondary: { x: 950, y: 200, width: 500, height: 250 },
      caption: { x: 50, y: 800, width: 300, height: 80 },
      source: { x: 1400, y: 900, width: 250, height: 70 },
      attribution: { x: 1400, y: 970, width: 250, height: 50 }
    },
    colorPalette: {
      light: {
        primary: '#7c2d12',
        secondary: '#92400e',
        accent: '#f59e0b',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.3)'
      },
      dark: {
        primary: '#a16207',
        secondary: '#7c2d12',
        accent: '#fbbf24',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.45)'
      }
    }
  }
];
