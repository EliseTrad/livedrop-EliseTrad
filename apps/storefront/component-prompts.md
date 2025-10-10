# Component Prompts Log

This file documents the AI prompts used to scaffold and generate components for
the Storefront v1 project.

## Atomic Components

### Button Component

- **Prompt**: "Create a reusable Button component with variants (primary,
  secondary, outline, ghost), sizes (sm, md, lg), and proper TypeScript props
  extending HTMLButtonElement"
- **Features**: Tailwind styling, focus management, disabled states

### Input Component

- **Prompt**: "Create an Input component with label, error state, and proper
  form accessibility"
- **Features**: Label association, error styling, focus ring

### LoadingSpinner Component

- **Prompt**: "Create a simple loading spinner with size variants using Tailwind
  CSS animations"
- **Features**: Multiple sizes, Tailwind animation classes

## Molecule Components

### ProductCard Component

- **Prompt**: "Create a ProductCard component for displaying products in a grid
  with image, title, price, tags, stock status, and add to cart functionality"
- **Features**: Hover effects, lazy loading, cart integration

### CartItemCard Component

- **Prompt**: "Create a CartItemCard for displaying cart items with quantity
  controls, remove functionality, and price calculations"
- **Features**: Quantity increment/decrement, remove item, price formatting

## Organism Components

### Header Component

- **Prompt**: "Create a Header component with logo, navigation, cart indicator
  showing item count, and support panel trigger"
- **Features**: Responsive design, cart count badge, support integration

### Footer Component

- **Prompt**: "Create a Footer component with multiple columns of links and
  company information"
- **Features**: Responsive grid layout, hover effects

### SupportPanel Component

- **Prompt**: "Create a slide-over SupportPanel that uses the AI assistant
  engine for customer support queries"
- **Features**: Slide animation, AI integration, order ID detection, focus
  management

## Template Components

### Layout Component

- **Prompt**: "Create a Layout template with Header, main content area using
  Outlet, and Footer"
- **Features**: Flex layout, proper semantic HTML

## Pages

### CatalogPage

- **Prompt**: "Create a product catalog page with search, filtering by tags,
  sorting by name/price, and responsive product grid"
- **Features**: Debounced search, real-time filtering, responsive grid

### ProductPage

- **Prompt**: "Create a product detail page with breadcrumbs, large image,
  product info, and related products based on shared tags"
- **Features**: Related products algorithm, responsive layout

### CartPage

- **Prompt**: "Create a shopping cart page with item list, quantity management,
  order summary with tax calculation, and checkout flow"
- **Features**: Persistent storage, price calculations, empty state

### CheckoutPage

- **Prompt**: "Create a checkout page with order summary, demo payment form, and
  order placement with loading states"
- **Features**: Order processing, navigation after success

### OrderStatusPage

- **Prompt**: "Create an order status page with order progress tracking, item
  details, and delivery information"
- **Features**: Progress indicators, order timeline, responsive design

## AI Assistant System

### Support Engine

- **Prompt**: "Create a support engine that matches user queries to ground truth
  data using keyword overlap, handles order ID detection, and provides confident
  answers or polite refusals"
- **Features**: Keyword matching algorithm, order integration, confidence
  scoring

### Ground Truth Data

- **Prompt**: "Create 20 curated Q&A pairs covering common e-commerce topics
  like account creation, payments, shipping, returns, etc."
- **Features**: Comprehensive coverage, structured format, keyword optimization

## Testing & Documentation

### Unit Tests

- **Prompt**: "Create unit tests for the support engine covering ground truth
  matching, order queries, out-of-scope handling, and error cases"
- **Features**: Vitest integration, mocking, comprehensive coverage

### Storybook Stories

- **Prompt**: "Create Storybook stories for Button (all variants), ProductCard
  (default, out of stock), and Header (with/without cart items)"
- **Features**: Interactive documentation, multiple states, accessibility
  testing

## Performance & Accessibility Considerations

- Lazy loading for images
- Code splitting by route
- Focus management in modals
- ARIA labels and roles
- Keyboard navigation support
- Responsive design patterns
- Optimized bundle sizes
