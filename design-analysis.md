# Design Analysis: zsceladna.cz

Reference site for MŠ Čeladná — same organization family (ZŠ + MŠ), same visual identity.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Dark Teal | `#275D56` | Primary — headings, nav links, icons, buttons |
| Lime Green | `#AFC25E` | Accent — tags/pills, dates, left border on headings, highlights |
| Dark Navy | `#1F365C` | Info banners, dark backgrounds (footer bar, alerts) |
| White | `#FFFFFF` | Page background, card backgrounds |
| Light Gray | `#F2F2F2` (approx) | Page background behind cards (very subtle off-white) |
| Medium Gray | `#E0E0E0` (approx) | Card borders, dividers |

## Typography

- **Headings**: Bold, italic serif-like font (custom/web font) — dark teal `#275D56`
- **Body text**: Clean sans-serif, dark gray/black
- **Dates**: Lime green `#AFC25E`, smaller size
- **Nav links**: Sans-serif, regular weight, dark teal

## Key Design Patterns

### Navigation
- **Top bar**: Clean, horizontal, left-aligned menu items + right-side "Přihlášení" button (lime green pill)
- Hamburger icon on far left (mobile / sidebar toggle)
- No dropdown menus observed — section pages use icon grids instead
- **Breadcrumbs**: Simple text trail under nav (`Hlavní stránka > O škole > ...`)

### Heading Style
- **Left border accent**: Lime/yellow-green vertical bar (`|`) before main page headings
- Bold italic style for main titles
- Dark teal color

### Cards
- White background, subtle rounded corners (~8-12px)
- Very light box-shadow (barely visible, no harsh shadows)
- No gradients anywhere
- Thin gray border on icon-grid cards

### Icon Grid (Section Landing Pages)
- Used on "O škole", "Pro rodiče" — grid of clickable cards
- Each card: line-art icon (teal) + label text
- 5 columns on desktop, wraps on smaller screens
- Icons are outline/stroke style, not filled
- Rounded corners, thin border

### News/Aktuality Cards
- Image thumbnail (square/rectangle)
- Title below image (dark teal, bold)
- Date below title (lime green)
- 4-column grid on desktop
- Fallback: teal line-art icon when no photo

### Sidebar ("Rychlá nabídka")
- Right sidebar on content pages
- "Kategorie aktualit" — lime green pills/tags
- Recent news list with dates
- "Zobrazit více" link

### Tags/Pills
- Lime green background `#AFC25E`, white text
- Rounded corners (pill shape)
- Used for category filters

### Buttons
- Primary: Dark teal background, white text, rounded corners
- Login: Lime green background, white text with icon
- No gradients, flat design

### Footer
- Dark teal background `#275D56`
- White text
- Sections: Kontakty (contacts), Kde nás najdete (map), document links
- Embedded Google Map
- Contact info with labels in bold

### Article Detail
- White card on gray background
- Heading with lime left-border
- Date below heading
- Full-width image
- Rich text content
- Breadcrumbs above

### Contact Cards
- Circle avatar with initials (gray background)
- Name (teal, bold), role, email (link), phone
- 2-column grid
- Info banner: dark navy background with icon

### Background Decorations
- Large, subtle gray decorative shapes in the background (swooshes, curves, checkmarks)
- Lime green decorative shape (paper plane / checkmark) in bottom-right area
- These are purely decorative, low opacity gray

### Downloads
- File icon + name + size + download icon
- Grouped under category headings
- Clean list layout with horizontal dividers

## Summary of Style Principles

1. **Flat design** — no gradients, no heavy shadows
2. **Clean and airy** — lots of whitespace
3. **Two accent colors** — teal for structure, lime for highlights
4. **Outline icons** — consistent teal stroke icons
5. **Card-based layout** — white cards on light gray background
6. **Left-border accent** — signature element on headings
7. **Pill-shaped tags** — lime green for categories
8. **Decorative shapes** — subtle gray background elements add visual interest without clutter
9. **Responsive grid** — cards adapt from 4-5 columns down
10. **Serif-style headings** — distinctive italic/bold headings vs sans-serif body
