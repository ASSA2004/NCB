# New Crescent Builders - Comprehensive Style Guide

## Overview
This document defines the complete design system for New Crescent Builders website, ensuring consistency across all UI components and providing clear guidelines for both light and dark themes.

---

## Color Palettes

### Light Theme - Warm Neutral Construction Aesthetic
A sophisticated, earthy palette that conveys professionalism, trust, and warmth - perfect for a construction company.

| Color Name | Hex Code | OKLCH | Usage |
|-----------|----------|-------|-------|
| **Linen White** | `#F9F8F6` | `oklch(0.98 0.005 80)` | Primary Background |
| **Warm Cream** | `#EFE9E3` | `oklch(0.94 0.01 80)` | Secondary Background, Cards |
| **Soft Taupe** | `#D9CFC7` | `oklch(0.85 0.015 80)` | Borders, Dividers |
| **Warm Beige** | `#C9B59C` | `oklch(0.75 0.035 80)` | Muted Elements, Disabled States |
| **Charcoal** | `#2C2C2C` | `oklch(0.22 0 0)` | Primary Text |
| **Slate Grey** | `#5A5A5A` | `oklch(0.42 0 0)` | Secondary Text |
| **Contrasted Blue** | `#0066FF` | `oklch(0.48 0.25 250)` | Primary Actions, Links, CTAs |

### Dark Theme - Contrasted Blue Professional
A modern, high-contrast dark theme with electric blue accents for premium feel.

| Color Name | Hex Code | OKLCH | Usage |
|-----------|----------|-------|-------|
| **Deep Black** | `#0A0B0F` | `oklch(0.09 0.01 250)` | Primary Background |
| **Dark Slate** | `#161822` | `oklch(0.14 0.015 250)` | Cards, Elevated Surfaces |
| **Steel Blue** | `#2A2E3F` | `oklch(0.22 0.02 250)` | Muted Backgrounds |
| **Border Blue** | `#3B4154` | `oklch(0.28 0.03 250)` | Borders, Dividers |
| **Pure White** | `#FAFAFA` | `oklch(0.98 0 0)` | Primary Text |
| **Light Grey** | `#C0C5D0` | `oklch(0.8 0.01 250)` | Secondary Text |
| **Electric Blue** | `#3D9EFF` | `oklch(0.65 0.28 240)` | Primary Actions, Links, CTAs |

---

## Typography

### Font Families
\`\`\`css
--font-display: 'Poppins', sans-serif; /* Headings - Bold, Modern */
--font-sans: 'Inter', sans-serif; /* Body Text - Clean, Readable */
--font-mono: 'Geist Mono', monospace; /* Code, Technical Data */
\`\`\`

### Font Scales

#### Desktop (1440px+)
- **H1**: `64px / 4rem` - Hero titles, page headers
- **H2**: `48px / 3rem` - Section titles
- **H3**: `36px / 2.25rem` - Subsection titles
- **H4**: `28px / 1.75rem` - Card titles
- **Body**: `18px / 1.125rem` - Main content
- **Small**: `15px / 0.9375rem` - Captions, labels

#### Tablet (768px - 1439px)
- **H1**: `48px / 3rem`
- **H2**: `36px / 2.25rem`
- **H3**: `28px / 1.75rem`
- **H4**: `22px / 1.375rem`
- **Body**: `17px / 1.0625rem`
- **Small**: `14px / 0.875rem`

#### Mobile (320px - 767px)
- **H1**: `40px / 2.5rem`
- **H2**: `32px / 2rem`
- **H3**: `24px / 1.5rem`
- **H4**: `20px / 1.25rem`
- **Body**: `16px / 1rem` (minimum 16px for iOS input zoom prevention)
- **Small**: `14px / 0.875rem`

### Typography Guidelines
- **Line Height**: Body text = 1.7, Headings = 1.2
- **Letter Spacing**: Headings = -0.03em, Body = -0.01em
- **Font Weight**: Headings = 700 (Bold), Body = 400 (Regular), Emphasis = 600 (Semibold)

---

## Component Usage Guide

### Backgrounds

#### Light Theme
\`\`\`css
/* Page Background */
background: #F9F8F6; /* Linen White */

/* Card/Panel Background */
background: #EFE9E3; /* Warm Cream */

/* Elevated Cards (hover, active) */
background: #FFFFFF; /* Pure White for depth */

/* Subtle Sections */
background: linear-gradient(180deg, #F9F8F6 0%, #EFE9E3 100%);
\`\`\`

#### Dark Theme
\`\`\`css
/* Page Background */
background: #0A0B0F; /* Deep Black */

/* Card/Panel Background */
background: #161822; /* Dark Slate */

/* Elevated Cards (hover, active) */
background: #1C1F2E; /* Lighter Slate for depth */

/* Subtle Sections */
background: linear-gradient(180deg, #0A0B0F 0%, #161822 100%);
\`\`\`

### Text Colors

#### Light Theme
\`\`\`css
/* Primary Text */
color: #2C2C2C; /* Charcoal - Headings, important text */

/* Secondary Text */
color: #5A5A5A; /* Slate Grey - Body text, descriptions */

/* Muted Text */
color: #8A8A8A; /* Light Grey - Labels, captions */

/* Primary Link/Action */
color: #0066FF; /* Contrasted Blue */
\`\`\`

#### Dark Theme
\`\`\`css
/* Primary Text */
color: #FAFAFA; /* Pure White - Headings, important text */

/* Secondary Text */
color: #C0C5D0; /* Light Grey - Body text, descriptions */

/* Muted Text */
color: #7A7F90; /* Mid Grey - Labels, captions */

/* Primary Link/Action */
color: #3D9EFF; /* Electric Blue */
\`\`\`

### Buttons

#### Primary Button
**Light Theme**
\`\`\`css
background: #0066FF; /* Contrasted Blue */
color: #FFFFFF;
padding: 14px 28px;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);

/* Hover */
background: #0052CC;
transform: translateY(-2px);
box-shadow: 0 8px 20px rgba(0, 102, 255, 0.4);
\`\`\`

**Dark Theme**
\`\`\`css
background: #3D9EFF; /* Electric Blue */
color: #0A0B0F;
padding: 14px 28px;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 4px 16px rgba(61, 158, 255, 0.4);

/* Hover */
background: #5AAFFF;
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(61, 158, 255, 0.5);
\`\`\`

#### Secondary Button
**Light Theme**
\`\`\`css
background: #EFE9E3; /* Warm Cream */
color: #2C2C2C;
border: 1px solid #D9CFC7;
padding: 14px 28px;
border-radius: 12px;

/* Hover */
background: #D9CFC7;
border-color: #C9B59C;
\`\`\`

**Dark Theme**
\`\`\`css
background: #2A2E3F; /* Steel Blue */
color: #FAFAFA;
border: 1px solid #3B4154;
padding: 14px 28px;
border-radius: 12px;

/* Hover */
background: #343952;
border-color: #4A4E64;
\`\`\`

### Cards

#### Standard Card
**Light Theme**
\`\`\`css
background: #EFE9E3; /* Warm Cream */
border: 1px solid #D9CFC7;
border-radius: 16px;
padding: 24px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

/* Hover */
transform: translateY(-4px);
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
border-color: #0066FF;
\`\`\`

**Dark Theme**
\`\`\`css
background: #161822; /* Dark Slate */
border: 1px solid #3B4154;
border-radius: 16px;
padding: 24px;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

/* Hover */
transform: translateY(-4px);
box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
border-color: #3D9EFF;
\`\`\`

### Borders & Dividers

**Light Theme**
\`\`\`css
border-color: #D9CFC7; /* Soft Taupe */
/* Subtle: #EFE9E3 */
/* Prominent: #C9B59C */
\`\`\`

**Dark Theme**
\`\`\`css
border-color: #3B4154; /* Border Blue */
/* Subtle: #2A2E3F */
/* Prominent: #4A4E64 */
\`\`\`

### Forms & Inputs

#### Input Fields
**Light Theme**
\`\`\`css
background: #FFFFFF;
border: 1px solid #D9CFC7;
color: #2C2C2C;
padding: 12px 16px;
border-radius: 8px;

/* Focus */
border-color: #0066FF;
box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
\`\`\`

**Dark Theme**
\`\`\`css
background: #1C1F2E;
border: 1px solid #3B4154;
color: #FAFAFA;
padding: 12px 16px;
border-radius: 8px;

/* Focus */
border-color: #3D9EFF;
box-shadow: 0 0 0 3px rgba(61, 158, 255, 0.2);
\`\`\`

---

## Spacing System

Using 4px base unit (0.25rem):

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Tight spacing, inline elements |
| `sm` | `8px` | Small gaps, compact layouts |
| `md` | `16px` | Standard spacing |
| `lg` | `24px` | Section spacing |
| `xl` | `32px` | Major sections |
| `2xl` | `48px` | Large sections |
| `3xl` | `64px` | Hero spacing |

### Container Padding
\`\`\`css
/* Mobile */
padding: 0 16px; /* 1rem */

/* Tablet */
padding: 0 32px; /* 2rem */

/* Desktop */
padding: 0 48px; /* 3rem */
\`\`\`

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| `sm` | `8px` | Small elements, badges |
| `md` | `12px` | Buttons, inputs |
| `lg` | `16px` | Cards, panels |
| `xl` | `20px` | Large cards |
| `2xl` | `24px` | Hero sections |
| `full` | `9999px` | Pills, avatars |

---

## Shadows

### Light Theme
\`\`\`css
/* Subtle */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

/* Standard */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

/* Elevated */
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);

/* Dramatic */
box-shadow: 0 20px 48px rgba(0, 0, 0, 0.16);
\`\`\`

### Dark Theme
\`\`\`css
/* Subtle */
box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);

/* Standard */
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

/* Elevated */
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);

/* Dramatic with Glow */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(61, 158, 255, 0.2);
\`\`\`

---

## Animation Guidelines

### Timing Functions
\`\`\`css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Smooth deceleration */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Standard */
--spring: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Bouncy */
\`\`\`

### Duration
- **Micro**: `150ms` - Hover states, small transitions
- **Standard**: `300ms` - Most UI transitions
- **Emphasized**: `500ms` - Page transitions, large elements
- **Dramatic**: `800ms` - Hero animations

---

## Accessibility

### Contrast Ratios
- **Normal Text**: Minimum 4.5:1 (WCAG AA)
- **Large Text (18px+)**: Minimum 3:1 (WCAG AA)
- **UI Components**: Minimum 3:1 for borders and states

### Focus States
\`\`\`css
/* Always visible focus indicator */
outline: 2px solid #0066FF;
outline-offset: 2px;
border-radius: 4px;
\`\`\`

### Touch Targets
- **Minimum Size**: 44x44px (iOS/Android guidelines)
- **Optimal Size**: 48x48px
- **Spacing**: 8px minimum between interactive elements

---

## Responsive Breakpoints

\`\`\`css
/* Mobile First Approach */
xs: 320px   /* Small phones */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
\`\`\`

---

## Usage Examples

### Hero Section
\`\`\`css
/* Light Theme */
background: linear-gradient(135deg, #F9F8F6 0%, #EFE9E3 100%);
color: #2C2C2C;

/* Dark Theme */
background: linear-gradient(135deg, #0A0B0F 0%, #161822 100%);
color: #FAFAFA;
\`\`\`

### Navigation Bar
\`\`\`css
/* Light Theme */
background: rgba(249, 248, 246, 0.9);
backdrop-filter: blur(20px);
border-bottom: 1px solid #D9CFC7;

/* Dark Theme */
background: rgba(10, 11, 15, 0.9);
backdrop-filter: blur(20px);
border-bottom: 1px solid #3B4154;
\`\`\`

### Footer
\`\`\`css
/* Light Theme */
background: #EFE9E3;
color: #5A5A5A;
border-top: 1px solid #D9CFC7;

/* Dark Theme */
background: #0A0B0F;
color: #C0C5D0;
border-top: 1px solid #3B4154;
\`\`\`

---

## Implementation Notes

1. **Always use CSS custom properties (variables)** for colors to enable easy theme switching
2. **Mobile-first approach** - Start with mobile styles, enhance for larger screens
3. **Smooth transitions** between themes with 600ms duration
4. **Consistent spacing** using the 4px base unit system
5. **High contrast** maintained in both themes for accessibility
6. **Blue accent color** (#0066FF / #3D9EFF) used sparingly for emphasis and actions
7. **Warm neutral palette** in light mode conveys trust and professionalism
8. **Dark blue-black backgrounds** in dark mode reduce eye strain while maintaining sophistication

---

*Last Updated: January 2025*
*Version: 2.0*
