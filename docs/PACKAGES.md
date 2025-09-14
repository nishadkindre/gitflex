# Packages Used in GitFlex

This document provides a comprehensive overview of all packages and dependencies used in GitFlex, their purposes, and links to their documentation.

## Core Framework & Runtime

### React Ecosystem
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **react** | ^19.1.1 | Core React library for building user interfaces | [npm](https://www.npmjs.com/package/react) • [docs](https://react.dev/) |
| **react-dom** | ^19.1.1 | React DOM rendering and manipulation | [npm](https://www.npmjs.com/package/react-dom) • [docs](https://react.dev/reference/react-dom) |
| **react-router-dom** | ^7.9.1 | Client-side routing and navigation | [npm](https://www.npmjs.com/package/react-router-dom) • [docs](https://reactrouter.com/) |

**Usage**: Foundation for the entire application, providing component-based architecture, efficient rendering, and smooth navigation between pages.

---

## Animation & Interactions

### Framer Motion
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **framer-motion** | ^12.23.12 | Advanced animations and transitions | [npm](https://www.npmjs.com/package/framer-motion) • [docs](https://www.framer.com/motion/) |

**Usage**: Powers all animations including:
- Page transitions and component animations
- Hover effects and micro-interactions  
- Card animations and loading states
- Smooth layout transitions and morphing effects

---

## Data Visualization

### Charts & Graphs
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **recharts** | ^3.2.0 | Modern React chart library | [npm](https://www.npmjs.com/package/recharts) • [docs](https://recharts.org/) |
| **react-github-calendar** | ^4.5.10 | GitHub contribution calendar component | [npm](https://www.npmjs.com/package/react-github-calendar) • [docs](https://github.com/grubersjoe/react-github-calendar) |

**Usage**: 
- **Recharts**: All analytics charts (pie, area, bar, radial charts) for repository statistics
- **GitHub Calendar**: Interactive contribution heatmap with activity visualization

---

## UI Components & Icons

### Icon Libraries
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **lucide-react** | ^0.544.0 | Beautiful, customizable SVG icons | [npm](https://www.npmjs.com/package/lucide-react) • [docs](https://lucide.dev/) |
| **react-icons** | ^5.5.0 | Popular icon library collection | [npm](https://www.npmjs.com/package/react-icons) • [docs](https://react-icons.github.io/react-icons/) |
| **simple-icons** | ^15.14.0 | Brand and technology icons | [npm](https://www.npmjs.com/package/simple-icons) • [docs](https://simpleicons.org/) |

**Usage**:
- **Lucide**: Primary UI icons (buttons, navigation, status indicators)
- **React Icons**: Social media and platform icons 
- **Simple Icons**: Technology logos and programming language icons

---

## HTTP & Data Management

### API Communication
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **axios** | ^1.12.1 | HTTP client for API requests | [npm](https://www.npmjs.com/package/axios) • [docs](https://axios-http.com/) |

**Usage**: All GitHub API communication with features:
- Request/response interceptors for authentication
- Automatic error handling and rate limiting
- Request timeout and retry logic
- Response caching and optimization

---

## Utilities & Helpers

### Date & Time
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **date-fns** | ^4.1.0 | Modern JavaScript date utility library | [npm](https://www.npmjs.com/package/date-fns) • [docs](https://date-fns.org/) |

**Usage**: Date formatting, relative time calculations, and timestamp processing for:
- Repository creation/update times
- Contribution activity dates
- Time-based analytics and filtering

---

## Development Dependencies

### Build & Bundling
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **vite** | ^7.1.2 | Next-generation frontend build tool | [npm](https://www.npmjs.com/package/vite) • [docs](https://vitejs.dev/) |
| **@vitejs/plugin-react-swc** | ^4.0.0 | React plugin with SWC for fast refresh | [npm](https://www.npmjs.com/package/@vitejs/plugin-react-swc) • [docs](https://github.com/vitejs/vite-plugin-react-swc) |

**Usage**: Ultra-fast development server, optimized production builds, and hot module replacement.

---

### Styling & CSS

### Tailwind CSS Ecosystem
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **tailwindcss** | ^3.4.17 | Utility-first CSS framework | [npm](https://www.npmjs.com/package/tailwindcss) • [docs](https://tailwindcss.com/) |
| **@tailwindcss/typography** | ^0.5.16 | Typography plugin for prose content | [npm](https://www.npmjs.com/package/@tailwindcss/typography) • [docs](https://tailwindcss.com/docs/typography-plugin) |
| **autoprefixer** | ^10.4.21 | CSS vendor prefix automation | [npm](https://www.npmjs.com/package/autoprefixer) • [docs](https://github.com/postcss/autoprefixer) |
| **postcss** | ^8.5.6 | CSS processing and transformation | [npm](https://www.npmjs.com/package/postcss) • [docs](https://postcss.org/) |

**Usage**: Complete styling solution with:
- Utility-first responsive design
- Custom neomorphic design system
- Dark/light theme support
- Optimized typography and spacing

---

### Code Quality & Linting

### ESLint Ecosystem
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **eslint** | ^9.35.0 | JavaScript/TypeScript linting | [npm](https://www.npmjs.com/package/eslint) • [docs](https://eslint.org/) |
| **@eslint/js** | ^9.33.0 | ESLint JavaScript configurations | [npm](https://www.npmjs.com/package/@eslint/js) • [docs](https://eslint.org/docs/latest/) |
| **eslint-plugin-react** | ^7.37.5 | React-specific linting rules | [npm](https://www.npmjs.com/package/eslint-plugin-react) • [docs](https://github.com/jsx-eslint/eslint-plugin-react) |
| **eslint-plugin-react-hooks** | ^5.2.0 | React Hooks linting rules | [npm](https://www.npmjs.com/package/eslint-plugin-react-hooks) • [docs](https://www.npmjs.com/package/eslint-plugin-react-hooks) |
| **eslint-plugin-react-refresh** | ^0.4.20 | React Fast Refresh compatibility | [npm](https://www.npmjs.com/package/eslint-plugin-react-refresh) • [docs](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) |

**Usage**: Maintains code quality with:
- JavaScript/React best practices enforcement
- Automatic error detection and prevention
- Consistent coding standards across the project
- Hook dependencies and lifecycle validation

---

### TypeScript Support
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **@types/react** | ^19.1.10 | TypeScript definitions for React | [npm](https://www.npmjs.com/package/@types/react) • [docs](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| **@types/react-dom** | ^19.1.7 | TypeScript definitions for React DOM | [npm](https://www.npmjs.com/package/@types/react-dom) • [docs](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| **@typescript-eslint/eslint-plugin** | ^8.43.0 | TypeScript ESLint rules | [npm](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) • [docs](https://typescript-eslint.io/) |
| **@typescript-eslint/parser** | ^8.43.0 | TypeScript ESLint parser | [npm](https://www.npmjs.com/package/@typescript-eslint/parser) • [docs](https://typescript-eslint.io/packages/parser) |

**Usage**: Enhanced development experience with:
- Type safety and IntelliSense support
- Better error detection during development
- Improved code documentation and maintainability

---

### Code Formatting
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **prettier** | ^3.6.2 | Opinionated code formatter | [npm](https://www.npmjs.com/package/prettier) • [docs](https://prettier.io/) |

**Usage**: Ensures consistent code formatting across the entire codebase with automatic formatting on save and pre-commit hooks.

---

### Configuration & Globals
| Package | Version | Purpose | Links |
|---------|---------|---------|-------|
| **globals** | ^16.3.0 | Global variables for ESLint | [npm](https://www.npmjs.com/package/globals) • [docs](https://github.com/sindresorhus/globals) |

**Usage**: Provides proper global variable definitions for browser and Node.js environments in ESLint configuration.

## Package Categories Summary

### 🎯 **Production Dependencies (11 packages)**
Essential packages shipped with the application for core functionality, UI components, and user experience.

### 🛠️ **Development Dependencies (15 packages)**  
Tools and utilities for development workflow, code quality, building, and deployment optimization.

### 📊 **Total Package Count**: 26 packages
Carefully selected for optimal bundle size, performance, and developer experience.

## Installation & Management

### Package Manager
- **Primary**: npm (Node Package Manager)
- **Minimum Versions**: Node >=18.0.0, npm >=9.0.0

### Browser Support
- Modern browsers (> 1% market share)
- Last 2 major versions
- No Internet Explorer support
- Progressive enhancement for older browsers

### Security & Updates
- Regular dependency audits via `npm audit`
- Automated security updates for vulnerabilities
- Semantic versioning for stable upgrades
- Lock files (`package-lock.json`) for reproducible builds