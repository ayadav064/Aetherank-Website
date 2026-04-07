import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHero } from "@/components/ui/PageHero";
import { FinalCTA } from "@/components/Sections";
import { ArrowRight, Clock, User, Loader2 } from "lucide-react";
import { articles } from "@/data/articles";
import { usePageContent, useBlogNewsletterCta } from "@/context/CmsContext";
import { fetchBlogPosts, type BlogPost } from "@/lib/cmsApi";
import { submitNewsletterSubscribe } from "@/lib/submitForm";

const CATEGORY_COLOR: Record<string, string> = {
  "SEO, GEO": "bg-emerald-100 text-emerald-700",
  PPC: "bg-blue-100 text-blue-700",
  "Social Media": "bg-violet-100 text-violet-700",
  "Content Marketing": "bg-amber-100 text-amber-700",
  "Web Design": "bg-sky-100 text-sky-700",
  ORM: "bg-rose-100 text-rose-700",
  "AI & Marketing": "bg-cyan-100 text-cyan-700",
  "Local Business": "bg-orange-100 text-orange-700",
  "Case Study": "bg-indigo-100 text-indigo-700",
  General: "bg-slate-100 text-slate-700",
};

function apiPostToDisplay(p: BlogPost) {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    image: p.image || "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    category: p.category,
    categoryColor: CATEGORY_COLOR[p.category] ?? "bg-slate-100 text-slate-700",
    author: p.author,
    date: p.date,
    readTime: p.readTime,
  };
}

export default function BlogPage() {
  const content = usePageContent("/blog");
  const newsletterCta = useBlogNewsletterCta();
  const [posts, setPosts] = useState<ReturnType<typeof apiPostToDisplay>[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [subMsg, setSubMsg] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubState("submitting");
    setSubMsg("");
    const result = await submitNewsletterSubscribe(email.trim());
    if (result.ok) {
      setSubState("success");
      setSubMsg(result.message ?? "You've been subscribed!");
      setEmail("");
    } else {
      setSubState("error");
      setSubMsg(result.error ?? "Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    fetchBlogPosts().then((apiPosts) => {
      const published = apiPosts
        .filter((p) => p.status === "published")
        .map(apiPostToDisplay);
      if (published.length > 0) {
        setPosts(published);
      } else {
        setPosts(articles.map((a) => ({ ...a, categoryColor: a.categoryColor })));
      }
      setLoading(false);
    });
  }, []);

  const displayPosts = loading
    ? articles.map((a) => ({ ...a, categoryColor: a.categoryColor }))
    : posts.length > 0
    ? posts
    : articles.map((a) => ({ ...a, categoryColor: a.categoryColor }));

  const featured = displayPosts[0];
  const rest = displayPosts.slice(1);

  return (
    <Layout>
      <div className="bg-white">
        <PageHero
          badge="Insights & Resources"
          heading={
            <>
              {content.headline}{" "}
              <span className="text-emerald-400">{content.headline_highlight}</span>
            </>
          }
          subtext={content.subheadline}
        />

        {/* Featured Post */}
        {featured && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <Link href={`/blog/${featured.slug}`} className="block group">
                  <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-white hover:shadow-lg transition-shadow">
                    <div className="grid lg:grid-cols-2">
                      <div className="relative h-64 lg:h-auto overflow-hidden">
                        <img
                          src={featured.image}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                      </div>
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${featured.categoryColor}`}>
                            {featured.category}
                          </span>
                          <span className="text-xs text-slate-400">Featured Article</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">{featured.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              {featured.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {featured.readTime}
                            </span>
                          </div>
                          <span className="flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                            Read More <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Article Grid */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && (
              <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading articles…
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article, i) => (
                <FadeIn key={article.slug} delay={i * 0.1}>
                  <Link href={`/blog/${article.slug}`} className="group block h-full">
                    <article className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.categoryColor}`}>
                            {article.category}
                          </span>
                          <span className="text-xs text-slate-400">{article.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-3 leading-snug group-hover:text-emerald-600 transition-colors flex-grow">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{article.excerpt}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{newsletterCta.heading}</h2>
              <p className="text-slate-600 mb-8">
                {newsletterCta.subheading}
              </p>

              {subState === "success" ? (
                <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  {subMsg}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (subState === "error") setSubState("idle"); }}
                    placeholder={newsletterCta.placeholder}
                    disabled={subState === "submitting"}
                    className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={subState === "submitting"}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {subState === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                    {subState === "submitting" ? "Subscribing…" : newsletterCta.button_text}
                  </button>
                </form>
              )}

              {subState === "error" && subMsg && (
                <p className="mt-3 text-sm text-red-600 font-medium">{subMsg}</p>
              )}
            </FadeIn>
          </div>
        </section>

        <FinalCTA />
      </div>
    </Layout>
  );
}
