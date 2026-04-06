import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ServicesPage from "@/pages/ServicesPage";
import SeoPage from "@/pages/services/SeoPage";
import PpcPage from "@/pages/services/PpcPage";
import SocialMediaPage from "@/pages/services/SocialMediaPage";
import WebDesignPage from "@/pages/services/WebDesignPage";
import ContentMarketingPage from "@/pages/services/ContentMarketingPage";
import OrmPage from "@/pages/services/OrmPage";
import MetaAdsPage from "@/pages/services/MetaAdsPage";
import CaseStudiesPage from "@/pages/CaseStudiesPage";
import AboutPage from "@/pages/AboutPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import FreeAuditPage from "@/pages/FreeAuditPage";
import RequestProposalPage from "@/pages/RequestProposalPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SeoEditor from "@/pages/admin/SeoEditor";
import ContentEditor from "@/pages/admin/ContentEditor";
import BlogPostList from "@/pages/admin/BlogPostList";
import BlogPostEditor from "@/pages/admin/BlogPostEditor";
import AdminSubmissions from "@/pages/admin/AdminSubmissions";

import AdminNewsletterSubscribers from "@/pages/admin/AdminNewsletterSubscribers";
import AdminMediaLibrary from "@/pages/admin/AdminMediaLibrary";
import { CmsProvider } from "@/context/CmsContext";
import SeoManager from "@/components/SeoManager";

const queryClient = new QueryClient();

function Router() {
  return (
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
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/seo" component={SeoEditor} />
      <Route path="/admin/content" component={ContentEditor} />
      <Route path="/admin/blog" component={BlogPostList} />
      <Route path="/admin/blog/new" component={BlogPostEditor} />
      <Route path="/admin/blog/edit/:id" component={BlogPostEditor} />
      <Route path="/admin/home" component={ContentEditor} />
      <Route path="/admin/submissions" component={AdminSubmissions} />
      <Route path="/admin/subscribers" component={AdminNewsletterSubscribers} />
      <Route path="/admin/media" component={AdminMediaLibrary} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CmsProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <SeoManager />
            <Router />
          </WouterRouter>
        </CmsProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
