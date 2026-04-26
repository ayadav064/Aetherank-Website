import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowLeft, Clock, User, Calendar, Loader2 } from "lucide-react";
import { getArticleBySlug, type Article } from "@/data/articles";
import { fetchBlogPost, type BlogPost } from "@/lib/cmsApi";
import NotFound from "@/pages/not-found";

const SITE = "https://aetherank.in";
const DEFAULT_IMAGE = `${SITE}/opengraph.jpg`;

// All document.* helpers are client-only — guard every call.
function setMetaName(name: string, content: string) {
  if (!content || typeof document === "undefined") return;
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
  el.content = content;
}
function setMetaProp(property: string, content: string) {
  if (!content || typeof document === "undefined") return;
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
  el.content = content;
}
function setCanonical(href: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector<HTMLLinkElement>(`link[rel="canonical"]`);
  if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
  el.href = href;
}
function injectBlogSchema(json: string) {
  if (typeof document === "undefined") return;
  const ID = "aetherank-blog-post-schema";
  let el = document.getElementById(ID);
  if (!el) { el = document.createElement("script"); el.id = ID; el.setAttribute("type", "application/ld+json"); document.head.appendChild(el); }
  el.textContent = json;
}
function removeBlogSchema() {
  if (typeof document === "undefined") return;
  document.getElementById("aetherank-blog-post-schema")?.remove();
  document.getElementById("aetherank-faq-schema-ld")?.remove();
}

interface PostSeoData {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  author?: string;
  date?: string;
  category?: string;
}

/** Build the BlogPosting JSON-LD object (used both server-side and client-side) */
function buildBlogSchema({ title, excerpt, slug, image, author, date, category }: PostSeoData) {
  const url = `${SITE}/blog/${slug}`;
  const img = image || DEFAULT_IMAGE;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "url": url,
    "image": img,
    "datePublished": date ?? new Date().toISOString(),
    "dateModified": date ?? new Date().toISOString(),
    "author": { "@type": "Person", "name": author ?? "Aetherank Team" },
    "publisher": {
      "@type": "Organization",
      "name": "Aetherank",
      "url": SITE,
      "logo": { "@type": "ImageObject", "url": `${SITE}/favicon.svg` }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "articleSection": category ?? "Digital Marketing",
    "inLanguage": "en-IN",
  });
}

function applyPostSeo(data: PostSeoData) {
  // Client-only: update live DOM meta tags on navigation
  const { title, excerpt, slug, image, category } = data;
  const url = `${SITE}/blog/${slug}`;
  const img = image || DEFAULT_IMAGE;
  const fullTitle = `${title} | Aetherank`;

  if (typeof document !== "undefined") document.title = fullTitle;
  setMetaName("description", excerpt);
  setMetaName("keywords", `${category ?? "digital marketing"}, aetherank blog, marketing insights india`);
  setCanonical(url);
  setMetaProp("og:type", "article");
  setMetaProp("og:title", fullTitle);
  setMetaProp("og:description", excerpt);
  setMetaProp("og:url", url);
  setMetaProp("og:image", img);
  setMetaProp("og:site_name", "Aetherank");
  setMetaProp("og:locale", "en_IN");
  setMetaName("twitter:card", "summary_large_image");
  setMetaName("twitter:site", "@aetherank");
  setMetaName("twitter:title", fullTitle);
  setMetaName("twitter:description", excerpt);
  setMetaName("twitter:image", img);
  injectBlogSchema(buildBlogSchema(data));
}

function renderContent(line: string, index: number) {
  if (line.startsWith("## ")) {
    return (
      <h2 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 mt-10 mb-4">
        {line.replace("## ", "")}
      </h2>
    );
  }
  if (line.includes("\n")) {
    return (
      <ul key={index} className="list-none space-y-1 my-4 text-slate-700 leading-relaxed">
        {line.split("\n").map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-emerald-500 mt-1 shrink-0">•</span>
            <span className="break-words min-w-0">{item.replace(/^[-•]\s*/, "")}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p key={index} className="text-slate-700 leading-relaxed text-base sm:text-lg break-words">
      {line}
    </p>
  );
}

function isHtmlContent(content: string) {
  return content.trim().startsWith("<");
}

function ApiPostContent({ post }: { post: BlogPost }) {
  const isHtml = isHtmlContent(post.content);

  const lines = isHtml
    ? []
    : post.content
        .split(/\n\n+/)
        .map((block) => block.trim())
        .filter(Boolean);

  const seoData: PostSeoData = {
    title: post.title,
    excerpt: post.excerpt || post.content.replace(/<[^>]+>/g, "").slice(0, 160),
    slug: post.slug,
    image: post.image,
    author: post.author,
    date: post.date,
    category: post.category,
  };

  // Client-only: update DOM meta tags when post changes
  useEffect(() => {
    applyPostSeo(seoData);
    return () => removeBlogSchema();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const schemaJson = buildBlogSchema(seoData);

  return (
    <Layout>
      {/* Inline JSON-LD rendered in JSX so SSR sends it to crawlers.
          The useEffect above keeps it updated on client-side navigation. */}
      <script
        type="application/ld+json"
        id="aetherank-blog-post-schema"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
      <div className="bg-white">
        {/* Hero */}
        <div className="relative h-[460px] sm:h-[520px] overflow-hidden">
          <img
            src={
              post.image ||
              "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80"
            }
            alt={post.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <FadeIn>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-emerald-100 text-emerald-700">
                  {post.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {post.title}
                </h1>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-8 border-b border-slate-100 mb-10">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-500" />
                {post.author}
              </span>
            )}
            {(post.date || post.createdAt) && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {post.date || new Date(post.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
          </div>

          {post.content ? (
            isHtml ? (
              <div
                className="blog-prose prose prose-slate max-w-none prose-sm sm:prose-lg prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-img:max-w-full prose-pre:overflow-x-auto prose-code:break-words prose-p:break-words prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="space-y-6">
                {lines.map((block, i) => renderContent(block, i))}
              </div>
            )
          ) : (
            <p className="text-slate-500 italic">Content coming soon.</p>
          )}

          <div className="mt-16 pt-8 border-t border-slate-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [apiPost, setApiPost] = useState<BlogPost | null | "loading">("loading");

  useEffect(() => {
    if (!slug) { setApiPost(null); return; }
    fetchBlogPost(slug).then((p) => setApiPost(p));
  }, [slug]);

  if (apiPost === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (apiPost) return <ApiPostContent post={apiPost} />;

  const staticArticle = getArticleBySlug(slug ?? "");
  if (!staticArticle) return <NotFound />;

  return <StaticPostContent slug={slug ?? ""} article={staticArticle} />;
}

function StaticPostContent({ slug, article }: { slug: string; article: Article }) {
  const seoData: PostSeoData = {
    title: article.title,
    excerpt: article.excerpt,
    slug,
    image: article.image,
    author: article.author,
    date: article.date,
    category: article.category,
  };

  useEffect(() => {
    applyPostSeo(seoData);
    return () => removeBlogSchema();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, slug]);

  const schemaJson = buildBlogSchema(seoData);

  return (
    <Layout>
      <script
        type="application/ld+json"
        id="aetherank-blog-post-schema"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
      <div className="bg-white">
        <div className="relative h-[460px] sm:h-[520px] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <FadeIn>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-4 ${article.categoryColor}`}>
                  {article.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {article.title}
                </h1>
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 pb-8 border-b border-slate-100 mb-10">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-500" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              {article.readTime}
            </span>
          </div>

          {article.content.length === 1 && article.content[0].trimStart().startsWith("<") ? (
            <div
              className="blog-prose prose prose-slate max-w-none prose-sm sm:prose-lg prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-img:max-w-full prose-code:break-words prose-p:break-words prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content[0] }}
            />
          ) : (
            <div className="space-y-6">
              {article.content.map((block, i) => renderContent(block, i))}
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-slate-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
