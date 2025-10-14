# Kada Manager - Shop Inventory & Expense Tracker

## Overview

Kada Manager is a mobile-first inventory and expense management application designed specifically for Kerala shopkeepers. The application provides simple, bilingual (English/Malayalam) interfaces for managing shop inventory, tracking expenses and income, maintaining seller contacts, and generating reports. Built with a modern React + TypeScript stack, it features a clean, accessible UI optimized for mobile devices with bottom navigation.

## Recent Changes

**October 14, 2025:**
- Fixed dark mode functionality by adding ThemeProvider from next-themes to App.tsx
- Dark mode now properly syncs with database settings and persists across sessions
- Implemented complete backup/restore system:
  - Download Backup: Exports all shop data (inventory, transactions, sellers, settings) as timestamped JSON file
  - Upload Backup: Imports backup files with intelligent ID mapping to preserve relational integrity
  - Deep sanitization removes read-only fields before import
  - Per-entity error handling with detailed feedback
  - Automatic ID remapping ensures transaction references remain valid after import
- Completed project migration to Replit environment:
  - Installed all npm dependencies (497 packages)
  - Verified all application features are working correctly
  - Updated favicon with custom shop icon (SVG format with green theme)
  - Updated meta tags with proper Open Graph descriptions for social sharing
  - Tested all pages: Dashboard, Inventory, Expenses, Sellers, Pricing, Reports, Settings
  - Confirmed all CRUD operations, dark mode, and backup/restore features are functional

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- React Router for client-side routing with named routes (/, /inventory, /expenses, /sellers, /reports, /settings)
- Mobile-first responsive design with bottom navigation component

**UI Component System:**
- Radix UI primitives for accessible, headless UI components
- shadcn/ui component library built on Radix primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Poppins font family for consistent typography
- Custom color scheme with primary green (#4A7C59), secondary orange, and muted tones optimized for Kerala shopkeeper aesthetic

**State Management:**
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod validation for form handling
- next-themes ThemeProvider for dark mode management with persistence
- Context API for toast notifications

**Key Design Patterns:**
- Component composition with UI primitives (Card, Dialog, Form, etc.)
- Custom hooks for mobile detection and toast notifications
- API abstraction layer separating data fetching from components
- TypeScript path aliases (@/ for src, @shared/ for shared) for clean imports

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Bun runtime for development and production execution
- CORS enabled for cross-origin requests
- JSON and URL-encoded body parsing middleware

**Development vs Production:**
- Development: Vite middleware integration with HMR (Hot Module Replacement)
- Production: Static file serving from dist/public directory
- Single server instance handles both API routes and frontend serving

**API Structure:**
- RESTful API endpoints under /api/* prefix
- Route organization:
  - /api/inventory - CRUD operations for inventory items
  - /api/sellers - CRUD operations for seller contacts
  - /api/transactions - CRUD operations for expenses/income
  - /api/settings - Shop settings management

**Data Validation:**
- Zod schemas for request validation at API layer
- Shared schema definitions between frontend and backend via @shared/schema
- Type-safe data transfer using inferred TypeScript types from Drizzle schemas

### Data Storage

**Database:**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database interactions
- postgres.js as the database client driver

**Schema Design:**
- `inventory_items`: Product inventory with quantities, pricing, and low stock alerts
- `sellers`: Supplier/seller contact information with product types
- `transactions`: Financial transactions with income/expense categorization
- `settings`: Shop configuration and preferences

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Migration files stored in /migrations directory
- Schema definitions in shared/schema.ts for cross-environment consistency

**Data Access Layer:**
- Repository pattern implemented via IStorage interface
- DbStorage class provides concrete PostgreSQL implementation
- Centralized database connection management in server/db.ts
- Type-safe query building with Drizzle query builder

### External Dependencies

**Third-Party UI Libraries:**
- @radix-ui/* - Headless UI component primitives (accordion, dialog, dropdown, popover, etc.)
- cmdk - Command menu component
- vaul - Drawer component
- react-day-picker - Calendar/date picker
- input-otp - OTP input component
- embla-carousel-react - Carousel functionality
- recharts - Chart visualization (though not actively used in current implementation)

**Utility Libraries:**
- class-variance-authority - Variant-based component styling
- clsx & tailwind-merge - CSS class name utilities
- zod - Schema validation library
- react-hook-form - Form state management
- sonner - Toast notification system
- next-themes - Theme management with localStorage persistence

**Development Tools:**
- TypeScript ESLint for code linting
- Vite for build optimization
- Drizzle Kit for database management
- lovable-tagger for component development tagging (dev only)

**Database & ORM:**
- PostgreSQL database (connection via DATABASE_URL environment variable)
- Drizzle ORM with postgres.js driver
- drizzle-zod for schema-to-Zod conversion

**Infrastructure Notes:**
- Replit deployment configuration present (allowed hosts in vite.config.ts)
- Environment-based configuration (NODE_ENV for production detection)
- Port configuration via PORT environment variable (default: 5000)
- Server listens on 0.0.0.0 for container compatibility