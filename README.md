# ok.css

A visual CSS generator toolkit — build, preview, save, and share CSS effects without writing a single line by hand.

---

## Features

### 15+ CSS Generators
| Generator | What it produces |
|---|---|
| Box Shadow | Multi-layer `box-shadow` with live preview |
| Gradient | Linear, radial, and conic `background` gradients |
| Glassmorphism | Frosted-glass `backdrop-filter` + `background` combos |
| Neumorphism | Soft-UI inset/outset shadow pairs |
| CSS Filter | `filter` chains (blur, brightness, contrast, hue-rotate, …) |
| Border Radius | All-corner or per-corner `border-radius` |
| Transform | `rotate`, `scale`, `translate`, `skew` + `transform-origin` |
| Clip Path | Polygon, circle, ellipse, and inset `clip-path` shapes |
| Text Shadow | Multi-layer `text-shadow` |
| Text Gradient | `background-clip: text` gradient fills |
| Transition | `transition` timing, duration, and easing |
| Keyframes | `@keyframes` builder with step editor |
| Cubic Bezier | Visual curve editor → `cubic-bezier(…)` |
| Scrollbar | Custom `::-webkit-scrollbar` styles |
| Outline | `outline` width, style, color, and offset |
| Color Palette | Harmonious palette generator with WCAG contrast scores |
| Type Scale | Modular type scale → `font-size` CSS variables |

### Presets
- **Local presets** — saved to `localStorage`, no sign-in required
- **Cloud presets** — sign in to sync presets via Supabase
- **Keyboard shortcuts** — `⌘S` save, `⌘K` preset panel
- **URL state** — every generator state is encoded in the URL (`?s=…`) for easy sharing

### Explore
- Community gallery of public presets
- Filter by tool, search by name, or view liked presets
- Heart any preset — persisted to `localStorage` (no account needed)
- One-click "Open" loads a preset directly into the generator

### Dashboard
- Manage all your cloud-saved presets in one place
- Multi-select presets and export as:
  - **CSS custom properties** (namespaced `:root { --tool--name--prop: value }`)
  - **Style Dictionary tokens** (`.json` compatible with design token tooling)
- Usage stats bar — visual breakdown of presets by tool

### Combine Mode
Stack multiple generators side-by-side and compose their CSS output into a single rule.

### CSS Import
Paste existing CSS into any generator and it auto-populates the controls.

### Browser Compat Warnings
Inline caniuse-based warnings flag properties with limited browser support.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Auth | [NextAuth.js](https://next-auth.js.org) |
| Font | Geist Mono |

---

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)
- A [Supabase](https://supabase.com) project
- OAuth credentials (GitHub or Google) for NextAuth

### 1. Clone and install

```bash
git clone https://github.com/pushparaj13811/okcss.git
cd okcss
bun install
```

### 2. Environment variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# OAuth provider (e.g. GitHub)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Database setup

Run the migration in your Supabase SQL editor:

```bash
# Apply schema
supabase/migrations/001_presets.sql

# (Optional) Seed curated presets
supabase/seeds/001_curated_presets.sql
```

### 4. Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (tool pages)/         # One route per generator (shadow, gradient, …)
  api/
    auth/               # NextAuth route handler
    presets/            # CRUD for cloud presets
    explore/            # Public preset feed
  combine/              # Combine mode page
  dashboard/            # User dashboard
  explore/              # Community gallery

src/
  components/
    combine/            # CombineClient
    dashboard/          # DashboardClient
    explore/            # ExploreClient
    layout/             # Header, Footer, AuthButton
    ui/                 # PresetPanel, PresetThumbnail, CssImportButton, …
    icons/              # Centralised SVG icon library
    providers/          # ThemeProvider, SessionProvider
  hooks/
    useCloudPresets.ts  # Cloud preset CRUD + sync
    useUrlState.ts      # URL-encoded generator state
    useGeneratorShortcuts.ts
  lib/
    tools.ts            # Tool registry (href, label, metadata)
    presets.ts          # Local preset helpers
    likes.ts            # localStorage-backed liked preset IDs
    css-import.ts       # Paste-CSS parser
    compat.ts           # Browser compat warning data
    shadow.ts           # Shadow generator logic
    gradient.ts         # Gradient generator logic
    …                   # One lib file per generator

supabase/
  migrations/           # SQL schema files
  seeds/                # Curated preset data
```

---

## Scripts

```bash
bun dev          # Start dev server
bun run build    # Production build
bun run start    # Start production server
bun run lint     # ESLint
```

---

## Contributing

Issues and pull requests are welcome. For significant changes, please open an issue first to discuss the approach.

---

## Author

**Hompushparaj Mehta**
[hpm.com.np](https://hpm.com.np) · [GitHub](https://github.com/pushparaj13811) · [LinkedIn](https://linkedin.com/in/pushparaj1381-) · [X](https://x.com/Pushparaj1381_)

---

## License

MIT
