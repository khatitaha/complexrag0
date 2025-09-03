# Agent Guidelines for ComplexRAG

## Build & Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (no test commands configured yet)

## Code Style Guidelines

### TypeScript & React
- Use strict TypeScript with proper type annotations
- Avoid `any` types; use specific interfaces
- Use React 19 with functional components
- Use `React.forwardRef` for components that need refs

### Imports & File Structure
- Use `@/` path alias for all local imports
- Group imports: external libraries → local components → types
- File naming: PascalCase for components, camelCase for utilities
- Use `.tsx` for React components, `.ts` for utilities

### Component Patterns
- Use class-variance-authority (cva) for component variants
- Use `cn()` utility for conditional className merging
- Extend Radix UI primitives for accessibility
- Use proper TypeScript interfaces extending HTML attributes

### Server Actions & API
- Use `'use server'` directive for server functions
- Implement proper try/catch error handling
- Use `console.error()` for errors, `console.log()` for debugging
- Use React `cache()` for expensive operations

### State Management
- Use Zustand for client-side state
- Use Supabase for database operations with proper auth checks
- Cache database queries when appropriate

### Styling
- Use Tailwind CSS with utility-first approach
- Follow existing design system patterns
- Use semantic class names with component variants

### Error Handling
- Wrap async operations in try/catch blocks
- Log errors with context information
- Return null/undefined for expected failures
- Use proper HTTP status codes in API routes

Run `npm run lint` after changes to ensure code quality.