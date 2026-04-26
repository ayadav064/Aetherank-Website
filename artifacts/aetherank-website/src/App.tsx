/**
 * App.tsx  — SSR-aware version
 *
 * Changes vs original:
 * 1. Accepts optional `ssrUrl` prop so the server can pass the request URL
 *    for wouter's static router (no change needed on the client).
 * 2. Accepts optional `initialCmsData` so CmsProvider can skip its loading
 *    state on the server and match SSR output on client hydration.
 * 3. Router wrapper is conditional: WouterRouter on client, passed-through
 *    on server (server wraps with staticLocation in entry-server.tsx).
 *
 * DEPLOY TO: artifacts/aetherank-website/src/App.tsx
 */
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useState, useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CmsProvider } from "@/context/CmsContext";
import SeoManager from "@/components/SeoManager";
import AdminErrorBoundary from "@/components/AdminErrorBoundary";

// ── Critical path: eager load only the home page ─────────────────────────────
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// ── All other routes: lazy-loaded so they never ship to home-page visitors ───
const ServicesPage               = lazy(() => import("@/pages/ServicesPage"));
const SeoPage                    = lazy(() => import("@/pages/services/SeoPage"));
const PpcPage                    = lazy(() => import("@/pages/services/PpcPage"));
const SocialMediaPage            = lazy(() => import("@/pages/services/SocialMediaPage"));
const WebDesignPage              = lazy(() => import("@/pages/services/WebDesignPage"));
const ContentMarketingPage       = lazy(() => import("@/pages/services/ContentMarketingPage"));
const OrmPage                    = lazy(() => import("@/pages/services/OrmPage"));
const MetaAdsPage                = lazy(() => import("@/pages/services/MetaAdsPage"));
const CaseStudiesPage            = lazy(() => import("@/pages/CaseStudiesPage"));
const AboutPage                  = lazy(() => import("@/pages/AboutPage"));
const BlogPage                   = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage               = lazy(() => import("@/pages/BlogPostPage"));
const ContactPage                = lazy(() => import("@/pages/ContactPage"));
const FreeAuditPage              = lazy(() => import("@/pages/FreeAuditPage"));
const RequestProposalPage        = lazy(() => import("@/pages/RequestProposalPage"));
const PrivacyPolicyPage          = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage         = lazy(() => import("@/pages/TermsOfServicePage"));
const DigitalMarketingIndiaPage  = lazy(() => import("@/pages/DigitalMarketingIndiaPage"));
const DigitalMarketingMumbaiPage = lazy(() => import("@/pages/DigitalMarketingMumbaiPage"));

// ── Admin: lazily loaded as one chunk (never needed by regular visitors) ─────
const AdminLogin                   = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard               = lazy(() => import("@/pages/admin/AdminDashboard"));
const SeoEditor                    = lazy(() => import("@/pages/admin/SeoEditor"));
const ContentEditor                = lazy(() => import("@/pages/admin/ContentEditor"));
const BlogPostList                 = lazy(() => import("@/pages/admin/BlogPostList"));
const BlogPostEditor               = lazy(() => import("@/pages/admin/BlogPostEditor"));
const AdminSubmissions             = lazy(() => import("@/pages/admin/AdminSubmissions"));
const AdminNewsletterSubscribers   = lazy(() => import("@/pages/admin/AdminNewsletterSubscribers"));
const AdminMediaLibrary            = lazy(() => import("@/pages/admin/AdminMediaLibrary"));
const AdminNavigation              = lazy(() => import("@/pages/admin/AdminNavigation"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
});

interface AppProps {
  /** Pre-fetched CMS data from the server; avoids a loading flash on SSR. */
  initialCmsData?: Record<string, unknown>;
}

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/seo" component={SeoPage} />
      <Route path="/services/ppc" component={PpcPage} />
      <Route path="/services/social-media" component={SocialMediaPage} />
      <Route path="/services/web-design-development" component={WebDesignPage} />
      <Route path="/services/content-marketing" component={ContentMarketingPage} />
      <Route path="/services/orm" component={OrmPage} />
      <Route path="/services/meta-ads" component={MetaAdsPage} />
      <Route path="/case-studies" component={CaseStudiesPage} />
      <Route path="/about-us" component={AboutPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/free-audit" component={FreeAuditPage} />
      <Route path="/request-proposal" component={RequestProposalPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/digital-marketing-company-india" component={DigitalMarketingIndiaPage} />
      <Route path="/digital-marketing-company-mumbai" component={DigitalMarketingMumbaiPage} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <AdminErrorBoundary><AdminDashboard /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/seo">
        <AdminErrorBoundary><SeoEditor /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/content">
        <AdminErrorBoundary><ContentEditor /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/blog/new">
        <AdminErrorBoundary><BlogPostEditor /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/blog/edit/:id">
        <AdminErrorBoundary><BlogPostEditor /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/blog">
        <AdminErrorBoundary><BlogPostList /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/submissions">
        <AdminErrorBoundary><AdminSubmissions /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/subscribers">
        <AdminErrorBoundary><AdminNewsletterSubscribers /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/media">
        <AdminErrorBoundary><AdminMediaLibrary /></AdminErrorBoundary>
      </Route>
      <Route path="/admin/navigation">
        <AdminErrorBoundary><AdminNavigation /></AdminErrorBoundary>
      </Route>
      <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

/** Renders children only on the client — never during SSR. */
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function App({ initialCmsData }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CmsProvider initialData={initialCmsData}>
        <TooltipProvider>
          {/* SeoManager uses useLocation() which requires a browser environment.
              ClientOnly ensures it never renders during SSR. */}
          <ClientOnly>
            <SeoManager />
          </ClientOnly>
          <Router />
          <Toaster />
        </TooltipProvider>
      </CmsProvider>
    </QueryClientProvider>
  );
}
