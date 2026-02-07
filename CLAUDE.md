# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web application that teaches HL7 FHIR R4 (Fast Healthcare Interoperability Resources) standards through interactive patient journey storytelling. The application follows Maria Santos, a 45-year-old elementary school teacher, through her healthcare experience to demonstrate how FHIR resources interconnect in real clinical workflows.

## Development Commands

This is a static HTML/CSS/JavaScript application with no build system. To run:

```bash
# Open directly in a browser (macOS)
open index.html

# Or start a simple HTTP server (recommended to avoid CORS issues)
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

No installation, build, or compilation steps required.

## Architecture

### Core Files

- **[index.html](index.html)** - Main HTML structure with semantic markup, accessibility features (ARIA labels, skip links), and navigation sidebar
- **[app.js](app.js)** - Application logic using vanilla JavaScript in an IIFE pattern for encapsulation
- **[fhir-data.js](fhir-data.js)** - Complete FHIR R4 resource dataset and educational content (~110KB)
- **[styles.css](styles.css)** - Comprehensive design system with CSS custom properties, responsive layouts, and animations

### Application State Management

The application uses a simple state object pattern ([app.js:20-26](app.js#L20-L26)):

```javascript
const AppState = {
    activeSection: null,
    sectionsRendered: false,
    expandedJsonViewers: new Set(),
    scrollspyObserver: null,
    mobileMenuOpen: false
};
```

State updates are handled through dedicated functions (e.g., `updateActiveNavLink`, `toggleMobileMenu`) rather than a centralized state manager.

### Data Structure

All FHIR resources and content are stored in `FHIRData` object in [fhir-data.js](fhir-data.js). The structure includes:

- `patient` - Core patient resource (Maria Santos)
- `sections[]` - Array of educational sections, each containing:
  - `id`, `title`, `stepNumber`, `icon`
  - `story` - Clinical narrative
  - `workflow` - Healthcare process explanation
  - `fhirExplanation` - FHIR technical details
  - `fhirResource` - Complete FHIR R4 JSON resource

### Rendering Flow

1. **Initialization** ([app.js:49](app.js#L49)) - DOM ready event triggers `init()`
2. **Section Rendering** ([app.js:91-109](app.js#L91-L109)) - `renderSections()` dynamically creates all content from `FHIRData.sections`
3. **Component Creation** ([app.js:117-172](app.js#L117-L172)) - `createSectionElement()` builds section HTML with story cards, workflow cards, FHIR explanation cards, and JSON viewers
4. **JSON Viewer** ([app.js:180-214](app.js#L180-L214)) - `createJsonViewer()` generates interactive, syntax-highlighted JSON displays
5. **Interactivity** - Event delegation pattern for expand/collapse and copy-to-clipboard

### Key Features Implementation

**Scrollspy Navigation** ([app.js:259-280](app.js#L259-L280))
- Uses Intersection Observer API with specific rootMargin to detect active section
- Automatically updates sidebar navigation highlighting

**JSON Syntax Highlighting** ([app.js:221-239](app.js#L221-L239))
- Pure JavaScript regex-based highlighting (no external libraries)
- Custom CSS classes for keys, strings, numbers, booleans, null, brackets

**Mobile Navigation** ([app.js:348-396](app.js#L348-L396))
- Hamburger menu toggle with smooth slide-in animation
- Overlay backdrop for focus management
- Escape key handler and body scroll lock

**Progress Tracking** ([app.js:497-509](app.js#L497-L509))
- Scroll position calculation with throttling for performance
- Gradient-filled progress bar in sidebar

### Design System

CSS custom properties in [styles.css:14-111](styles.css#L14-L111) define:
- **Colors**: Primary purple (#7133AE), primary teal (#38B8B3), semantic colors
- **Typography**: System font stack, monospace for code, 8 size scales
- **Spacing**: 12 spacing scales (0.25rem to 4rem)
- **Layout**: Sidebar width (280px), content max-width (900px), border radii
- **Shadows**: 5 elevation levels for depth
- **Transitions**: 3 timing functions for consistent animations
- **Z-index**: Layering system for overlays and modals

### Responsive Breakpoints

- **Desktop**: Default (1024px+)
- **Tablet**: 1024px and below - sidebar width reduced
- **Mobile**: 768px and below - sidebar hidden, hamburger menu shown, main content full width
- **Small Mobile**: 480px and below - reduced font sizes

## FHIR Resource Conventions

Resource IDs follow a consistent pattern ([fhir-data.js:5-21](fhir-data.js#L5-L21)):

```
patient-maria-santos
practitioner-dr-chen (Primary Care)
practitioner-dr-patel (Cardiologist)
organization-city-general
appointment-001
encounter-001
servicerequest-001 (Lab)
observation-001 (Blood Pressure)
condition-001 (Hypertension)
allergyintolerance-001 (Penicillin)
medication-001 (Lisinopril)
medicationrequest-001
procedure-001 (ECG)
diagnosticreport-001
immunization-001 (Flu)
```

All resources conform to HL7 FHIR R4 specification and reference the US Core profiles where applicable.

## Modifying Content

### Adding a New FHIR Resource Section

1. Add resource data to `FHIRData` object in [fhir-data.js](fhir-data.js)
2. Add section entry to `FHIRData.sections[]` array with required properties:
   - Clinical story explaining the scenario
   - Workflow description of the healthcare process
   - FHIR explanation covering key fields and relationships
   - Complete FHIR R4 JSON resource

3. Add navigation link in [index.html](index.html) sidebar nav list (around line 44-122)
4. No code changes needed in [app.js](app.js) - rendering is data-driven

### Modifying Styles

The design system uses CSS custom properties. To change colors, spacing, or typography:

1. Modify variables in [styles.css:14-111](styles.css#L14-L111)
2. Changes will propagate throughout the application
3. Component-specific styles are organized by feature (sidebar, content cards, JSON viewer, etc.)

### Extending Interactivity

The application uses event delegation for efficiency. To add new interactive features:

1. Add event listeners in appropriate init functions ([app.js:56-61](app.js#L56-L61))
2. Use `document.addEventListener('click', handler)` pattern with `e.target.closest()` for delegation
3. Follow existing patterns for state management and DOM updates

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy, landmark regions (`nav`, `main`, `footer`)
- **ARIA attributes**: `aria-label`, `aria-expanded`, `aria-current`, `aria-live` for dynamic updates
- **Keyboard navigation**: Arrow keys for sidebar navigation ([app.js:591-624](app.js#L591-L624))
- **Skip link**: Bypass navigation for screen reader users ([index.html:12](index.html#L12))
- **Focus management**: Visible focus indicators, focus trap in mobile menu
- **Reduced motion**: Respects `prefers-reduced-motion` media query ([styles.css:1397-1407](styles.css#L1397-L1407))

## Browser Compatibility

The application uses modern JavaScript features:
- Intersection Observer API (scrollspy, animations)
- CSS Grid and Flexbox
- CSS custom properties
- async/await for clipboard API
- ES6+ syntax (arrow functions, template literals, destructuring)

Target: Modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
