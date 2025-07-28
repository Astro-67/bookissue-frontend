# BookIssue Tracker - AI Coding Agent Instructions

This is a full-stack ticket management system for educational institutions with role-based access (Student/Staff/ICT).

## Architecture Overview

**Frontend**: React + TypeScript with TanStack Router, React Query, Tailwind CSS  
**Backend**: Django REST API with JWT authentication (port 8000)  
**Real-time**: Polling-based updates (tickets: 30s, comments: 10s)  

## Key Patterns & Conventions

### 1. Role-Based Layout System
- Routes use path-based role detection: `/student/*`, `/staff/*`, `/ict/*`
- `SharedLayout` component dynamically configures navigation per role
- Each role has separate dashboards with tailored permissions

### 2. API & State Management
- **API Layer**: `src/lib/api.ts` - Dynamic base URL (localhost vs network IP)
- **Hooks Layer**: `src/hooks/api.ts` - React Query wrappers with toast notifications
- **Services Layer**: `src/lib/api-services.ts` - Raw API functions
- All mutations invalidate relevant queries for immediate UI updates

### 3. Authentication Flow
- JWT tokens stored in localStorage (`access_token`, `refresh_token`)
- `AuthContext` manages auth state with automatic redirects
- Protected routes redirect unauthenticated users to `/login`
- Role mismatches redirect to correct dashboard

### 4. Ticket & Comment System
- **Tickets**: Students create, ICT assigns/resolves, Staff monitors
- **Comments**: Chat-style interface with permission-based visibility
- **Real-time**: Aggressive polling + optimistic updates
- **Permissions**: Students (own tickets), ICT (assigned tickets), Staff (all tickets)

## Development Workflows

### Running the Application
```bash
# Frontend (from bookissue-frontend/)
bun run dev --host        # Network access: 0.0.0.0:3000

# Backend (from bookissue-backend/)
python manage.py runserver 0.0.0.0:8000  # Network access required
```

### Network Development
- Frontend adapts API URL based on hostname (`localhost` vs network IP)
- Both servers must bind to `0.0.0.0` for cross-device testing
- CORS configured for all origins in development

### File Organization
```
src/
├── contexts/         # AuthContext for global state
├── features/         # Domain-specific components (auth, tickets, etc.)
├── hooks/           # React Query API hooks
├── lib/             # API configuration & services
├── routes/          # File-based routing (TanStack Router)
├── types/           # TypeScript interfaces
└── ui/              # Shared components (Layout, Header, Sidebar)
```

## Critical Implementation Details

### Real-time Updates
- `useRealTimeTickets()` and `useRealTimeComments()` provide polling
- All mutations use `queryClient.invalidateQueries()` + `refetchQueries()`
- Background refetch enabled: `refetchIntervalInBackground: true`

### Toast Notifications
- `react-hot-toast` integrated globally via `__root.tsx`
- All mutation hooks include success/error toasts
- Error handling replaces console.error with user-facing messages

### Responsive Design
- Mobile-first Tailwind CSS with `lg:` breakpoints
- Sidebar collapses on mobile with backdrop overlay
- Auto-close sidebar on navigation for mobile UX

### Component Patterns
- Feature-based organization under `src/features/`
- Shared UI components are role-agnostic
- Props drilling minimized via context providers

## Common Pitfalls

1. **API URLs**: Must handle both localhost and network IP scenarios
2. **Role Permissions**: Check user role before rendering actions/forms
3. **Query Keys**: Include relevant parameters for proper cache invalidation
4. **Real-time**: Use `useRealTime*` hooks instead of basic `useQuery`
5. **Mobile Layout**: Test sidebar behavior and backdrop interactions

## Key Files to Reference

- `src/ui/SharedLayout.tsx` - Role-based layout logic
- `src/hooks/api.ts` - React Query patterns with real-time polling
- `src/lib/api.ts` - Network-aware API configuration
- `src/routes/__root.tsx` - Authentication and routing setup
- `vite.config.ts` - Development server with network access
