# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Aetherank Website (`artifacts/aetherank-website`)
- React + Vite website for Aetherank Digital Marketing Agency
- URL: `/` (root, port 21090)
- Full-featured marketing site with blog, services, contact, CMS admin
- Admin login at `/admin` (default password: `aetherank2026`)
- Rich blog CMS with TipTap editor
- SEO management per-page
- Contact forms, free audit, proposal request
- Media Library at `/admin/media` — drag-and-drop uploads to object storage with image grid, copy URL, delete

### API Server (`artifacts/api-server`)
- Express backend, port 8080
- Routes: `/api/blog/posts`, `/api/admin/*`, `/api/submissions/*`, `/api/stats/*`, `/api/track`, `/api/newsletter/*`, `/api/storage/*`
- Sitemap served at `/sitemap.xml`, robots at `/robots.txt`
- Authentication via `ADMIN_PASSWORD` env (default: `aetherank2026`)
- Email notifications via SMTP (optional: SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM)
- Object storage via Replit App Storage (GCS) for Media Library

## Database Tables

- `blog_posts` - Blog articles with rich content, SEO, status
- `submissions` - Contact/audit/proposal form submissions
- `settings` - CMS settings keyed by path (SEO) and named keys
- `newsletter_subscribers` - Email newsletter list
- `page_views` - Analytics page view tracking
- `media` - Media library: uploaded files tracked with objectPath, contentType, size

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/aetherank-website run dev` — run frontend locally

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit DB)
- `ADMIN_PASSWORD` — Admin panel password (default: `aetherank2026`)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — Email (optional)
- `SITE_URL` — Production site URL for sitemap/emails (default: `https://aetherank.com`)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
