import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Federal Standard Colors - Row 1 (Greens and Muted Tones)
        'fs-14257': 'var(--fs-14257)',
        'fs-14260': 'var(--fs-14260)',
        'fs-14272': 'var(--fs-14272)',
        'fs-14277': 'var(--fs-14277)',
        'fs-14325': 'var(--fs-14325)',
        'fs-14449': 'var(--fs-14449)',
        
        // Row 2 (Pale Greens and Dark Blues)
        'fs-14533': 'var(--fs-14533)',
        'fs-14672': 'var(--fs-14672)',
        'fs-15042': 'var(--fs-15042)', // Sea Blue
        'fs-15044': 'var(--fs-15044)', // Insignia Blue
        'fs-15045': 'var(--fs-15045)',
        'fs-15050': 'var(--fs-15050)', // Blue Angels Blue
        
        // Row 3 (Blues)
        'fs-15056': 'var(--fs-15056)', // Blue
        'fs-15065': 'var(--fs-15065)',
        'fs-15080': 'var(--fs-15080)',
        'fs-15090': 'var(--fs-15090)',
        'fs-15092': 'var(--fs-15092)',
        'fs-15102': 'var(--fs-15102)', // Dark Blue
        
        // Row 4 (Teals, Blues, and Blue-Grays)
        'fs-15125': 'var(--fs-15125)',
        'fs-15177': 'var(--fs-15177)',
        'fs-15180': 'var(--fs-15180)',
        'fs-15182': 'var(--fs-15182)',
        'fs-15187': 'var(--fs-15187)',
        'fs-15193': 'var(--fs-15193)',
        
        // Row 5 (Grays and Browns)
        'fs-15526': 'var(--fs-15526)',
        'fs-16081': 'var(--fs-16081)', // Engine Gray
        'fs-16099': 'var(--fs-16099)',
        'fs-16152': 'var(--fs-16152)',
        'fs-16160': 'var(--fs-16160)',
        'fs-16165': 'var(--fs-16165)',
        
        // Row 6 (Grays, Pinks, and Beiges)
        'fs-16251': 'var(--fs-16251)',
        'fs-16307': 'var(--fs-16307)',
        'fs-16314': 'var(--fs-16314)',
        'fs-16350': 'var(--fs-16350)',
        'fs-16357': 'var(--fs-16357)',
        'fs-16360': 'var(--fs-16360)',
        
        // Semantic colors
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
          light: 'var(--secondary-light)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dark: 'var(--accent-dark)',
          light: 'var(--accent-light)',
        },
        neutral: {
          DEFAULT: 'var(--neutral)',
          dark: 'var(--neutral-dark)',
          light: 'var(--neutral-light)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        surface: {
          DEFAULT: 'var(--surface)',
          dark: 'var(--surface-dark)',
        },
      },
    },
  },
  plugins: [],
}

export default config
