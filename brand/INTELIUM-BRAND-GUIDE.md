# Intelium Brand & Style Guide

**Identity System 2025 | Monochrome Edition**

---

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | `#161618` (UI Black) |
| White | `#FFFFFF` |
| Black | `#000000` |
| Primary Font | Geist |
| Mono Font | Geist Mono |
| Border Radius | 10px (0.625rem) |
| Icon Grid | 24x24px |

---

## 1. Brand Philosophy

Intelium's visual identity is built on three core principles:

- **Monochrome Purity** - Only black, white, and shades of grey
- **Geometric Precision** - Grid-based construction for all elements
- **Purposeful Minimalism** - Every element serves a function

---

## 2. Color System

### Primary Colors

| Color | HEX | RGB | CMYK | Pantone | Usage |
|-------|-----|-----|------|---------|-------|
| **White** | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | — | Backgrounds, reversed text |
| **Black** | `#000000` | 0, 0, 0 | 0, 0, 0, 100 | Black 6 C | Primary logo, print |
| **UI Black** | `#161618` | 22, 22, 24 | 8, 8, 0, 91 | Black 6 C | Digital backgrounds, UI |

### CSS Variables (Light Mode)

```css
:root {
  --background: #FFFFFF;
  --foreground: #161618;
  --primary: #161618;
  --primary-foreground: #FAFAFA;
  --secondary: #F5F5F5;
  --muted: #737373;
  --border: #E5E5E5;
  --radius: 0.625rem;
}
```

### CSS Variables (Dark Mode)

```css
.dark {
  --background: #161618;
  --foreground: #FAFAFA;
  --primary: #FAFAFA;
  --primary-foreground: #161618;
  --secondary: #262626;
  --muted: #A3A3A3;
  --border: #262626;
}
```

### Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'intelium-black': '#161618',
        'intelium-white': '#FFFFFF',
        'intelium-pure-black': '#000000',
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
    },
  },
}
```

---

## 3. Typography

### Primary Typeface: Geist

Used for headlines, titles, and display text. Geometric construction aligns with brand identity.

**Available Weights:**
- Light (300)
- Regular (400)
- Medium (500)
- Bold (700)

### Secondary Typeface: Geist Mono

Used for technical content, code, specifications, and data tables.

### Type Hierarchy

| Style | Font | Size | Weight | Line Height | Usage |
|-------|------|------|--------|-------------|-------|
| Display | Geist | 72px | 700 | 1.0 | Hero sections, splash screens |
| H1 | Geist | 48px | 700 | 1.1 | Page titles |
| H2 | Geist | 32px | 600 | 1.2 | Section headers |
| H3 | Geist | 24px | 600 | 1.3 | Subsections |
| Body | Geist | 16px | 400 | 1.5 | Paragraph text |
| Small | Geist | 14px | 400 | 1.5 | Secondary text |
| Caption | Geist Mono | 12px | 400 | 1.4 | Labels, metadata |

### CSS Typography

```css
/* Display */
.display {
  font-family: 'Geist', sans-serif;
  font-size: 72px;
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.02em;
}

/* Heading 1 */
h1, .h1 {
  font-family: 'Geist', sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

/* Heading 2 */
h2, .h2 {
  font-family: 'Geist', sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
}

/* Body */
body, .body {
  font-family: 'Geist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

/* Monospace / Code */
code, .mono {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 400;
}
```

---

## 4. Logo Usage

### Logo Versions

| Version | Usage | Background |
|---------|-------|------------|
| Black | Primary, print, digital | White, light grey |
| White | Reversed, dark contexts | Black, UI Black (#161618) |
| Transparent | Overlays, watermarks | Photo, video content |

### Logo Files

- `logo-20preto.png` - Black logo (light backgrounds)
- `logo-20branco.png` - White logo (dark backgrounds)
- `isotipo-20preto.png` - Black mark only
- `isotipo-201-20transp.png` - Transparent mark

### Clear Space

Minimum clear space around the logo = **1x** (height of isotipo stroke)

```
     ← 1x →
   ┌─────────┐
   │         │ ↑
   │  LOGO   │ 1x
   │         │ ↓
   └─────────┘
```

### Minimum Sizes

| Context | Minimum Size |
|---------|--------------|
| Print | 25mm / 80px width |
| Digital (wordmark) | 80px width |
| Digital (isotipo) | 24px |

### Logo Misuse (DO NOT)

- Rotate the logo
- Add outlines or strokes
- Use colors other than black/white
- Distort or stretch
- Add shadows or effects
- Add gradients
- Crop the logo
- Place on low contrast backgrounds
- Place on busy backgrounds
- Recreate in other typefaces
- Combine wordmark with isotipo
- Add extra elements

---

## 5. Iconography

### Icon System Specifications

| Property | Value | Usage |
|----------|-------|-------|
| Grid size | 24x24px | Base canvas for all icons |
| Stroke weight | 1.5px - 2px | Standard line thickness |
| Corner radius | 2px | Rounded terminals |
| Padding | 2px (safe area) | Minimum clearance from edge |
| Export sizes | 16px, 24px, 32px, 48px | Standard icon sizes |

### Icon Design Principles

1. Use strokes, not fills, for consistency with logo design language
2. Apply rounded stroke caps and joins for friendly, modern aesthetic
3. Keep designs simple and geometric for clarity at small sizes
4. Icons must work in monochrome only (black, white, UI Black)

### SVG Icon Template

```svg
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Icon path here -->
</svg>
```

---

## 6. Imagery

### Photography Style

- Clean, minimal, and purposeful
- High-contrast monochrome photography
- Emphasizes form, geometry, and negative space
- Authentic, avoids stock photography cliches

### Image Treatment

| Property | Value | Usage |
|----------|-------|-------|
| Color mode | Grayscale / Monochrome | All brand photography |
| Contrast | High (+20-30%) | Emphasize form and structure |
| Corner radius | 12px - 16px | Digital applications |
| Overlay opacity | 0-40% | When placing text over images |

### CSS Image Treatment

```css
.brand-image {
  filter: grayscale(100%);
  contrast: 1.2;
  border-radius: 12px;
}

.image-with-overlay {
  position: relative;
}

.image-with-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(22, 22, 24, 0.4);
  border-radius: inherit;
}
```

### Photography Guidelines

- Use authentic, purposeful imagery that supports the message
- Avoid stock photography cliches (handshakes, corporate staged photos)
- Emphasize negative space and geometric composition
- When placing text over images, ensure proper contrast with overlays
- All images must be converted to grayscale or monochrome

---

## 7. Motion & Animation

### Animation Timing

| Context | Duration | Usage |
|---------|----------|-------|
| UI Transitions | 200-400ms | Buttons, hover states, reveals |
| Logo Animation | 2-3s | Intro sequences, loading |

### Easing Function

```css
/* Standard ease-in-out */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### CSS Animation Examples

```css
/* Button hover */
.button {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card reveal */
.card {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Logo intro */
@keyframes logo-reveal {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.logo-animate {
  animation: logo-reveal 2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Frame Rate

Target **60fps** for all animations.

---

## 8. Tone of Voice

### Brand Voice Attributes

**We are:**
- **Clear** - Direct and easy to understand
- **Precise** - Accurate and purposeful
- **Confident** - Authoritative without arrogance
- **Modern** - Contemporary and forward-thinking

**We are NOT:**
- Overly casual or playful
- Jargon-heavy or obscure
- Passive or uncertain
- Corporate or stiff

### Writing Guidelines

| Guideline | Do | Don't |
|-----------|-----|-------|
| Use active voice | "We built this platform to simplify your workflow." | "This platform was built to simplify workflows." |
| Be concise | "Get started in minutes." | "You can get started with our platform in just a few short minutes." |
| Lead with value | "Automate complex workflows with precision." | "Our platform has advanced automation features." |

### Messaging Framework

| Context | Approach | Example |
|---------|----------|---------|
| Headings | Bold, declarative statements | "Build with precision" |
| Body copy | Clear, informative, scannable | Short paragraphs, bullet points when needed |
| Calls to action | Action-oriented, specific | "Start building" |
| Error messages | Helpful, solution-focused | Explain what happened and how to fix it |

---

## 9. UI Components

### Border Radius Scale

```css
--radius-sm: 6px;   /* calc(0.625rem - 4px) */
--radius-md: 8px;   /* calc(0.625rem - 2px) */
--radius-lg: 10px;  /* 0.625rem */
--radius-xl: 14px;  /* calc(0.625rem + 4px) */
```

### Shadow (Minimal)

```css
/* Subtle elevation for cards */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);

/* Elevated state */
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

### Button Styles

```css
/* Primary Button */
.btn-primary {
  background-color: #161618;
  color: #FFFFFF;
  font-family: 'Geist', sans-serif;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 10px;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: #161618;
  border: 1px solid #E5E5E5;
  font-family: 'Geist', sans-serif;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 10px;
}
```

---

## 10. Applications

### Digital Applications

| Application | Logo | Background |
|-------------|------|------------|
| Website header | Black logo | White |
| Mobile app | White logo | UI Black |
| Email signature | Black logo | White |
| Social media avatar | Isotipo (white on black circle) | — |

### Physical Applications

| Application | Logo | Background |
|-------------|------|------------|
| Business card | White logo | UI Black |
| Office signage | Black logo | White |
| Merchandise | White logo | UI Black |

---

## 11. File Naming Convention

```
intelium-logo-[color]-[size].[format]
intelium-isotipo-[color]-[size].[format]

Examples:
intelium-logo-black-1024.png
intelium-logo-white-512.svg
intelium-isotipo-black-256.png
```

---

## 12. Accessibility

- Maintain minimum contrast ratio of **4.5:1** for normal text
- Maintain minimum contrast ratio of **3:1** for large text (18px+ or 14px+ bold)
- UI Black (#161618) on white achieves **16.1:1** contrast ratio
- All interactive elements must have visible focus states
- Images require alt text describing content

---

## 13. Code Snippets

### Install Fonts

```bash
npm install @vercel/font
```

```js
// app/layout.tsx
import { GeistSans, GeistMono } from 'geist/font'

export default function RootLayout({ children }) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Complete Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        intelium: {
          black: '#161618',
          white: '#FFFFFF',
          'pure-black': '#000000',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      transitionTimingFunction: {
        'intelium': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}
```

---

## 14. Quick Copy/Paste

### Colors

```
UI Black:    #161618    rgb(22, 22, 24)
Pure Black:  #000000    rgb(0, 0, 0)
White:       #FFFFFF    rgb(255, 255, 255)
Border:      #E5E5E5    rgb(229, 229, 229)
Muted:       #737373    rgb(115, 115, 115)
```

### Font Stack

```css
font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
```

### Transitions

```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2025 | Initial monochrome edition |

---

**Copyright 2025 Intelium.ai**
*Confidential - Internal Use Only*
