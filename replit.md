# Overview

This is a multitenant e-commerce platform built with Next.js 14+ and PayloadCMS. The application enables multiple independent stores (tenants) to operate on a single platform, each with their own products, branding, and Stripe payment integration. It features a headless CMS architecture with PayloadCMS managing content and MongoDB for data persistence.

The platform supports product browsing with advanced filtering, user authentication, shopping cart functionality, order management, and product reviews. Each tenant operates independently with their own subdomain-style routing and customized storefront.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 14+ with App Router
- Uses React Server Components (RSC) for server-side rendering and optimal performance
- Client components marked with "use client" directive for interactive features
- File-based routing under `src/app/(app)` and `src/app/(payload)` route groups

**UI Component System**: Shadcn/ui with Radix UI primitives
- Component library located in `src/components/ui/`
- Styled with Tailwind CSS v4 (using `@import` directives)
- Custom theme configuration in `src/app/(app)/globals.css`
- DM Sans font family for typography

**State Management**:
- **TanStack Query (React Query)**: Server state management for API data fetching, caching, and synchronization
  - Custom hooks in `src/lib/hooks/use-api.ts` wrap API endpoints
  - QueryProvider configured in `src/components/providers/query-provider.tsx`
- **Zustand**: Client-side state for shopping cart persistence with localStorage
- **nuqs**: Type-safe URL query string management for filters and search parameters

**Form Handling**:
- React Hook Form for form state management
- Zod schemas for validation (see `src/modules/auth/schemas.ts`)
- Hookform Resolvers for integrating Zod with React Hook Form

## Backend Architecture

**Content Management**: PayloadCMS 3.x
- Headless CMS with custom collections defined in `src/collections/`
- Admin panel served at `/admin` route group
- TypeScript type generation via `payload generate:types`

**Database**: MongoDB via Mongoose adapter
- Connection configured in `payload.config.ts`
- Database URL from `DATABASE_URI` environment variable

**API Architecture**:
- **REST API Routes**: Direct Next.js API routes under `src/app/(app)/api/`
  - Authentication: `/api/auth/*` (session, login, register, logout)
  - Categories: `/api/categories`
  - Products: `/api/products`, `/api/products/[id]`
  - Tags: `/api/tags`
  - Tenants: `/api/tenants/[slug]`
  - Checkout: `/api/checkout/*` (purchase, products)
  - Library: `/api/library`, `/api/library/[productId]`
  - Reviews: `/api/reviews`, `/api/reviews/[productId]`
- **API Client**: Centralized fetch wrapper in `src/lib/api-client.ts`
- **React Query Hooks**: Custom hooks in `src/lib/hooks/use-api.ts` for data fetching
- **Server Utilities**: Payload access helpers in `src/lib/api.ts` (getPayloadClient, getSession)
- **Error Handling**: Custom `ApiError` class and `createErrorResponse` for standardized HTTP responses

**Multi-Tenancy Plugin**:
- `@payloadcms/plugin-multi-tenant` for tenant isolation
- Tenant-specific product filtering and access control
- Super admin role can access all tenants

**Authentication**:
- Built-in PayloadCMS authentication system
- Role-based access control (super-admin role)
- Cookie-based sessions with custom prefix "funroad"
- Session management utilities in `src/lib/api.ts`

## Data Models (Collections)

**Users**: Authentication with roles (super-admin), username, email, tenant associations
**Tenants**: Store configurations with slug, name, Stripe account, approval status
**Products**: Tenant-scoped items with name, price, description, category, tags, images
**Categories**: Hierarchical structure with parent/subcategory relationships, color coding
**Tags**: Product classification and filtering
**Orders**: Purchase records linking users, products, and Stripe sessions
**Reviews**: User ratings and feedback for products (1-5 stars)
**Media**: Upload collection for images with alt text

## Access Control Strategy

- Super admins have full system access across all tenants
- Regular users are scoped to their assigned tenants
- Product creation requires tenant Stripe account approval
- Read access is public for browsing; write operations require authentication
- Access control functions centralized in `src/lib/access.ts`

## Module Organization

Code organized by feature modules under `src/modules/`:
- **auth**: Authentication flows, schemas, constants
- **home**: Main storefront UI components (navbar, footer, filters)
- **products**: Product listing, filtering, types, search parameters
- **categories**: Category-related types and logic
- **reviews**: Review creation and management types
- **checkout**: Cart state management, checkout flows, Stripe integration
- **library**: User's purchased products view

Each module contains:
- `types.ts`: TypeScript interfaces
- `schemas.ts`: Zod validation schemas
- `constants.ts`: Module-specific constants
- `ui/`: UI components and views
- `hooks/`: Custom React hooks

# External Dependencies

## Payment Processing

**Stripe**: Payment gateway integration
- Stripe SDK initialized in `src/lib/stripe.ts`
- API key from `STRIPE_SECRET_KEY` environment variable
- API version: "2025-08-27.basil"
- Connect accounts for tenant-specific payments
- Checkout session creation for purchases
- Product metadata includes tenant Stripe account information

## Content Management

**PayloadCMS**: Headless CMS framework
- Version 3.54.0
- MongoDB adapter for data persistence
- Lexical rich text editor
- Multi-tenant plugin for tenant isolation
- Payload Cloud plugin for deployment
- Media upload handling with Sharp for image processing

## Database

**MongoDB**: Primary data store
- Accessed via Mongoose adapter in PayloadCMS
- Connection string from environment variable
- No direct Drizzle usage currently (may be added in future)

## UI Libraries

**Radix UI**: Unstyled accessible component primitives (30+ components)
**Lucide React**: Icon library
**Tailwind CSS v4**: Utility-first styling with CSS imports
**class-variance-authority**: Component variant management
**tailwind-merge & clsx**: Class name utilities

## Developer Tools

**TypeScript**: Strict type checking with custom tsconfig
**Bun**: Runtime for development and package management
**Next.js**: React framework with App Router

# Recent Changes (October 2025)

## Migration from tRPC to REST API

**Date**: October 4, 2025

The project was successfully migrated from tRPC to a direct REST API implementation using Payload CMS. This change improves simplicity, reduces dependencies, and provides better integration with Next.js patterns.

### What Changed:
- **Removed**: All tRPC dependencies (@trpc/client, @trpc/server, @trpc/tanstack-react-query)
- **Removed**: tRPC infrastructure files (src/trpc/ directory)
- **Added**: Direct REST API routes using Next.js App Router conventions
- **Added**: Centralized API client with fetch wrapper (src/lib/api-client.ts)
- **Added**: Custom React Query hooks for all API endpoints (src/lib/hooks/use-api.ts)
- **Added**: Server utilities for Payload access and session management (src/lib/api.ts)
- **Updated**: All React components to use new API client and hooks
- **Updated**: All server components to use direct Payload API calls

### Benefits:
- Simpler architecture with standard REST endpoints
- Better compatibility with Next.js App Router
- Reduced bundle size (3 fewer dependencies)
- Easier to debug and maintain
- Direct integration with Payload CMS without abstraction layers

## Replit Configuration

**Environment**: Configured for Replit deployment
- Dev server runs on port 5000 (bind to 0.0.0.0)
- Production server runs on port 5000 (bind to 0.0.0.0)
- Environment variables configured in Replit Secrets:
  - `DATABASE_URI`: MongoDB connection string
  - `PAYLOAD_SECRET`: Payload CMS encryption key
  - `STRIPE_SECRET_KEY`: Stripe API secret key
  - `STRIPE_WEBHOOK_SECRET`: Stripe webhook signature secret