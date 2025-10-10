# Storefront v1

A modern React + TypeScript e-commerce storefront built with Vite and Tailwind
CSS.

## Features

- **Product Catalog**: Grid view with search, filtering, and sorting
- **Product Details**: Individual product pages with related items
- **Shopping Cart**: Persistent cart with local storage
- **Checkout**: Order placement with mock order tracking
- **AI Support Assistant**: Knowledge-based customer support using ground truth
  data
- **Accessibility**: Full keyboard navigation and ARIA support
- **Performance**: Optimized for fast loading and smooth interactions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Testing**: Vitest + Testing Library
- **Documentation**: Storybook

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Start Storybook (Note: Currently has dependency conflicts with Vite 7.x)
# npm run storybook

# Build for production
pnpm build
```

## Project Structure

```
src/
├── pages/          # Route components
├── components/     # Atomic design components
│   ├── atoms/      # Basic UI elements
│   ├── molecules/  # Composed components
│   ├── organisms/  # Complex components
│   └── templates/  # Page layouts
├── lib/           # Utilities and services
├── assistant/     # AI support system
└── stories/       # Storybook stories
```

## Performance Targets

- Cold load: ≤200 KB JS gzipped
- Route transitions: p95 < 250ms
- Lazy-loaded images and code splitting
- Optimized bundle structure

## AI Support Features

The support assistant uses a knowledge-based approach:

- Ground truth data from 20+ curated Q&As
- Keyword overlap matching for high confidence responses
- Order status integration
- Privacy-aware (shows only last 4 chars of sensitive data)
- Graceful fallbacks for out-of-scope queries

## Accessibility

- Full keyboard navigation
- Focus management in modals
- ARIA labels and roles
- Screen reader support
- High contrast support
