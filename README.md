# Intranet CSS preset

The design system from the intranet portal, packaged as plain CSS for reuse in other projects.
No build step and no framework required. MudBlazor support is an optional add-on.

Open `demo.html` through a local web server (fonts don't load over `file://`) to see every component.
`demo.html?theme=dark&glass=1` jumps straight to a variant.

## Contents

| File | What it is | Required |
|---|---|---|
| `preset.css` | Bundle that `@import`s the four core files below | – |
| `css/fonts.css` + `fonts/sarabun/` | Self-hosted Sarabun (Thai + Latin), OFL licence | yes* |
| `css/tokens.css` | Colours, radii, shadows, type, motion; light + dark | yes |
| `css/base.css` | Body defaults, container, sticky-footer shell, focus ring, reduced motion | yes |
| `css/components.css` | Header, nav, buttons, inputs, cards, tiles, link list, hero, footer… | yes |
| `css/glass.css` | Optional "liquid glass" look. Re-points tokens, adds translucency | no |
| `css/mudblazor.css` | MudBlazor refinements (no uppercase buttons, border colours, nav) | MudBlazor only |
| `css/mudblazor-glass.css` | Glass for Mud papers, popovers, dialogs, buttons | MudBlazor + glass only |
| `js/theme.js` | Sets `data-theme` before first paint, plus a toggle API | for dark mode |

\* Skip `fonts.css` if the project already ships Sarabun; `--font-sans` falls back to `system-ui`.

## Install

Copy the whole `css-preset/` folder into the project's static root (for example `wwwroot/css-preset/`),
keeping the folder structure so the relative font paths still resolve.

### Plain HTML / MVC / Razor Pages

```html
<head>
  <script src="css-preset/js/theme.js" data-storage-key="myapp.theme"></script>
  <link href="css-preset/preset.css" rel="stylesheet" />
  <link href="css-preset/css/glass.css" rel="stylesheet" />  <!-- optional -->
  <link href="css/site.css" rel="stylesheet" />               <!-- your overrides last -->
</head>
<body>
  <div class="portal-shell">
    <header class="portal-header">…</header>
    <main class="portal-container portal-main">…</main>
    <footer class="portal-footer">…</footer>
  </div>
</body>
```

`preset.css` uses `@import`, which loads its files one after another. In production, link the four
`css/` files directly instead: `fonts.css`, `tokens.css`, `base.css`, `components.css`.

### Blazor + MudBlazor

Order matters: tokens/components, then Mud, then the Mud refinements, then glass.

```html
<script src="css-preset/js/theme.js" data-storage-key="myapp.theme"></script>
<link href="css-preset/preset.css" rel="stylesheet" />
<link href="_content/MudBlazor/MudBlazor.min.css" rel="stylesheet" />
<link href="css-preset/css/mudblazor.css" rel="stylesheet" />
<link href="css-preset/css/glass.css" rel="stylesheet" />            <!-- optional -->
<link href="css-preset/css/mudblazor-glass.css" rel="stylesheet" />  <!-- only with glass.css -->
<link href="MyApp.styles.css" rel="stylesheet" />
```

Read and toggle the theme from C# through `window.presetTheme`:

```csharp
IsDark = await js.InvokeAsync<bool>("presetTheme.isDark");
await js.InvokeVoidAsync("presetTheme.set", IsDark);
```

Then pass `IsDarkMode="IsDark"` to `MudThemeProvider` with this theme, which mirrors `tokens.css`:

```csharp
readonly MudTheme _theme = new()
{
    PaletteLight = new PaletteLight
    {
        Primary = "#1a3a6b", PrimaryDarken = "#0f2446", PrimaryLighten = "#2f5da3",
        Secondary = "#0f766e", Info = "#2f5da3", Success = "#15803d", Warning = "#b45309", Error = "#c2410c",
        TextPrimary = "#16202e", TextSecondary = "#5b6778",
        AppbarBackground = "#ffffff", Background = "#f5f7fa", Surface = "#ffffff",
        LinesDefault = "#e2e7ee", LinesInputs = "#cfd7e3", TableLines = "#e2e7ee", Divider = "#e2e7ee",
        ActionDefault = "#5b6778",
    },
    PaletteDark = new PaletteDark
    {
        Primary = "#6b9be0", PrimaryContrastText = "#0b1526", PrimaryDarken = "#5a88cc", PrimaryLighten = "#8fb0e8",
        Secondary = "#2dd4bf", SecondaryContrastText = "#0b1526",
        Info = "#6b9be0", Success = "#4ade80", Warning = "#fbbf24", Error = "#fb7185",
        TextPrimary = "#e6ebf2", TextSecondary = "#97a3b6",
        AppbarBackground = "#151e2c", Background = "#0d1420", BackgroundGray = "#111a28",
        Surface = "#151e2c", DrawerBackground = "#151e2c",
        LinesDefault = "#253246", LinesInputs = "#33435c", TableLines = "#253246",
        TableHover = "rgba(255,255,255,.04)", Divider = "#253246", ActionDefault = "#97a3b6",
    },
    LayoutProperties = new LayoutProperties { DefaultBorderRadius = "10px" },
    Typography = new Typography
    {
        Default = new DefaultTypography { FontFamily = new[] { "Sarabun", "system-ui", "sans-serif" } },
        Button = new ButtonTypography { FontWeight = "500", TextTransform = "none" },
        H4 = new H4Typography { FontWeight = "700" },
        H5 = new H5Typography { FontWeight = "700" },
        H6 = new H6Typography { FontWeight = "600" },
    }
};
```

## Customising

Override tokens in your own stylesheet, loaded after the preset. Change the brand colour once for each
theme, and every component follows:

```css
:root                   { --brand-700: #7a1f3d; --brand-500: #a83259; --brand-100: #f6e3ea; --brand-50: #fbf1f4; }
html[data-theme="dark"] { --brand-700: #f0a6bf; --brand-500: #e57fa1; --brand-100: #4a1f2e; --brand-50: #33161f; }
```

If you rebrand, update the MudTheme palette and the `.brand-mark` gradient as well.

Useful tokens: `--brand-50…900`, `--accent-100/600`, `--canvas`, `--surface`, `--border(-strong)`,
`--text(-muted)`, `--success/--warning/--error/--info`, `--tone-0…5-bg/fg`, `--radius-sm/md/lg/control/pill`,
`--shadow-sm/md/lg`, `--focus-ring`, `--ease`, `--container-max`, `--font-sans`, `--font-mono`.

## Component classes

| Area | Classes |
|---|---|
| Layout | `portal-shell`, `portal-container`, `portal-main` |
| Header | `portal-header`, `header-bar`, `header-spacer`, `brand`, `brand-mark`, `brand-name`, `admin-nav`, `portal-nav` (mark the active link with `aria-current="page"`), `notice-banner` + `.dismiss` |
| Controls | `btn` + `btn-primary` / `btn-accent` / `btn-outline` / `btn-icon`, `field`, `input` (also for `select`/`textarea`), `hint` |
| Page | `page-header` (+ `page-desc`), `eyebrow`, `section`, `section-head`, `section-title`, `home-hero` |
| Containers | `surface`, `empty-state`, `card-grid`, `link-card` (+ `card-action`) |
| Icons & tags | `icon-badge` (+ `warn` / `muted`), `chip`, `tone-0` … `tone-5` (sets `--tone-bg/--tone-fg` for any child) |
| Tiles | `icon-bar`, `icon-tile` > `tile-icon` + `caption` |
| Link list | `side-panel` > `side-head`, `side-scroll`, `side-group`, `side-label`, `side-link` > `side-badge`, `side-text` (`side-title`, `side-desc`), `side-arrow` |
| Media | `slide` > `img` + `overlay` (`h3`, `p`) |
| Footer | `portal-footer`, `footer-inner`, `footer-links`, `footer-social` |
| Utilities | `mono`, `text-muted` |

The demo shows the expected markup for each one.

### Differences from the intranet's `app.css`

- `mock-banner` → `notice-banner`; `home-side` → `side-panel`.
- `portal-nav` / `admin-nav` style plain `<a>`/`<button>` children. The `.mud-button-root` variants are in `mudblazor.css`.
- New here: `btn*`, `field`/`input`, `chip`, `card-grid`, `header-spacer`, `portal-shell`, `text-muted`, plus the
  `--on-brand`, status-colour, `--radius-control`, `--font-*` and `--container-*` tokens.
- Left out (page-specific): home grid, bookmarks, reorder rows, department frame, boot skeleton, Blazor error UI.
