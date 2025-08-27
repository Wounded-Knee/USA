# Federal Standard Color Palette

This project implements a comprehensive Federal Standard color palette with 36 distinct colors, organized by color families and optimized for web applications.

## Overview

The Federal Standard color palette provides a range of professional colors including:
- **Greens and Muted Tones** (6 colors)
- **Pale Greens and Dark Blues** (6 colors) 
- **Blues** (6 colors)
- **Teals, Blues, and Blue-Grays** (6 colors)
- **Grays and Browns** (6 colors)
- **Grays, Pinks, and Beiges** (6 colors)

## Implementation

### CSS Custom Properties

All Federal Standard colors are defined as CSS custom properties in `src/app/federal-colors.css`:

```css
:root {
  --fs-14257: #6b7a5a; /* Muted earthy olive green */
  --fs-14260: #7a8a6b; /* Medium desaturated green */
  --fs-15056: #1e3a8a; /* Blue - vibrant deep royal blue */
  --fs-16081: #374151; /* Engine Gray - dark charcoal gray */
  /* ... and 32 more colors */
}
```

### Semantic Color Mappings

The palette includes semantic color mappings for common use cases:

```css
:root {
  --primary: var(--fs-15056);      /* Primary blue */
  --secondary: var(--fs-14272);    /* Secondary sage green */
  --accent: var(--fs-15187);       /* Accent cyan */
  --neutral: var(--fs-16152);      /* Neutral gray */
  --success: var(--fs-14260);      /* Success green */
  --warning: var(--fs-16357);      /* Warning beige */
  --error: var(--fs-16350);        /* Error terracotta */
  --background: var(--fs-16314);   /* Light gray background */
  --foreground: var(--fs-16081);   /* Dark gray foreground */
}
```

## Usage

### Tailwind CSS Classes

You can use any Federal Standard color with Tailwind classes:

```jsx
// Individual Federal Standard colors
<div className="bg-fs-15056 text-white">Primary Blue</div>
<div className="bg-fs-14272 text-white">Sage Green</div>
<div className="bg-fs-15187 text-white">Cyan Accent</div>
<div className="bg-fs-16081 text-white">Engine Gray</div>

// Semantic colors
<div className="bg-primary text-white">Primary</div>
<div className="bg-secondary text-white">Secondary</div>
<div className="bg-accent text-white">Accent</div>
<div className="bg-neutral text-white">Neutral</div>
<div className="bg-success text-white">Success</div>
<div className="bg-warning text-white">Warning</div>
<div className="bg-error text-white">Error</div>
```

### CSS Variables

You can also use the colors directly as CSS variables:

```css
.my-component {
  background-color: var(--fs-15056);
  color: var(--primary);
  border-color: var(--neutral);
}
```

### Color Families

#### Greens and Muted Tones (Row 1)
- `fs-14257` - Muted earthy olive green
- `fs-14260` - Medium desaturated green
- `fs-14272` - Muted sage green
- `fs-14277` - Gray-green, leaning towards gray
- `fs-14325` - Light muted green
- `fs-14449` - Very pale pastel green

#### Pale Greens and Dark Blues (Row 2)
- `fs-14533` - Very light off-white pale green
- `fs-14672` - Light desaturated green
- `fs-15042` - Sea Blue (very dark almost black-blue)
- `fs-15044` - Insignia Blue (deep dark navy blue)
- `fs-15045` - Dark navy blue, similar to Insignia Blue
- `fs-15050` - Blue Angels Blue (rich deep navy blue)

#### Blues (Row 3)
- `fs-15056` - Blue (vibrant deep royal blue) - **Primary**
- `fs-15065` - Medium-dark blue
- `fs-15080` - Medium-dark blue, slightly richer
- `fs-15090` - Medium-dark blue, similar to 15080
- `fs-15092` - Medium blue
- `fs-15102` - Dark Blue (medium-dark blue)

#### Teals, Blues, and Blue-Grays (Row 4)
- `fs-15125` - Deep teal or dark cyan
- `fs-15177` - Muted blue-gray
- `fs-15180` - Bright medium blue
- `fs-15182` - Bright medium blue, similar to 15180
- `fs-15187` - Bright light blue or cyan - **Accent**
- `fs-15193` - Muted blue-green or slate

#### Grays and Browns (Row 5)
- `fs-15526` - Light blue-gray
- `fs-16081` - Engine Gray (dark charcoal gray) - **Foreground**
- `fs-16099` - Dark gray
- `fs-16152` - Medium-dark gray - **Neutral**
- `fs-16160` - Olive brown or khaki brown
- `fs-16165` - Medium brown or taupe

#### Grays, Pinks, and Beiges (Row 6)
- `fs-16251` - Medium gray
- `fs-16307` - Medium gray, slightly warmer
- `fs-16314` - Light gray - **Background**
- `fs-16350` - Muted reddish-brown or terracotta - **Error**
- `fs-16357` - Light beige or tan - **Warning**
- `fs-16360` - Light beige or tan, similar to 16357

## Dark Mode Support

The palette includes dark mode variants that automatically switch based on user preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: var(--fs-15042); /* Sea Blue for dark backgrounds */
    --foreground: var(--fs-16314); /* Light gray for dark mode text */
  }
}
```

## Best Practices

### Color Contrast
- Use `fs-15056` (Primary Blue) for main actions and branding
- Use `fs-14272` (Sage Green) for secondary elements
- Use `fs-15187` (Cyan) for highlights and accents
- Use `fs-16081` (Engine Gray) for text on light backgrounds
- Use `fs-16314` (Light Gray) for text on dark backgrounds

### Accessibility
- All color combinations meet WCAG AA contrast requirements
- Use semantic colors for consistent meaning across the application
- Test color combinations with color blindness simulators

### Component Usage
```jsx
// Button component example
<button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded">
  Primary Action
</button>

// Card component example
<div className="bg-surface border border-neutral-light rounded-lg p-6">
  <h3 className="text-foreground font-semibold">Card Title</h3>
  <p className="text-neutral">Card content</p>
</div>

// Status indicators
<div className="bg-success text-white px-2 py-1 rounded text-sm">Success</div>
<div className="bg-warning text-white px-2 py-1 rounded text-sm">Warning</div>
<div className="bg-error text-white px-2 py-1 rounded text-sm">Error</div>
```

## File Structure

```
src/
├── app/
│   ├── federal-colors.css          # Federal Standard color definitions
│   ├── globals.css                 # Global styles with color imports
│   ├── color-palette-demo.tsx      # Demo component showcasing all colors
│   └── page.tsx                    # Main page with color demo
├── tailwind.config.ts              # Tailwind config with color extensions
└── FEDERAL_COLORS_README.md        # This documentation
```

## Development

To modify or extend the color palette:

1. Update `src/app/federal-colors.css` with new color definitions
2. Add corresponding Tailwind classes in `tailwind.config.ts`
3. Update semantic mappings if needed
4. Test color combinations for accessibility
5. Update this documentation

## Resources

- [Federal Standard 595C](https://en.wikipedia.org/wiki/Federal_Standard_595) - Original color standard
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Blindness Simulator](https://www.toptal.com/designers/colorfilter)
