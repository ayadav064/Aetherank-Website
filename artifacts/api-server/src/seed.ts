import { db } from "@workspace/db";
import { blogPostsTable, settingsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const SEED_POSTS = [
  {
    "id": "abf3d265-a8d0-4238-88b9-9189def324d2",
    "title": "₹5,000/month SEO Agency vs ₹50,000/month — Actually Kya Farak Hai?",
    "slug": "seo-agency-5000-vs-50000-kya-farak-hai",
    "excerpt": "Ek agency ₹5,000 mein SEO offer karti hai, doosri ₹50,000 maangti hai — dono bol rahe hain results aayenge. Honest Hinglish breakdown of what you actually get at each price point.",
    "content": "<article>\n\n<p class=\"lead\">Ek business owner ka typical confusion: \"Bhai, ek agency ₹5,000/month mein SEO kar rahi hai, doosri ₹50,000 maang rahi hai — dono bol rahe hain results aayenge. Mujhe samajh nahi aa raha.\"</p>\n\n<p>Yeh confusion bilkul valid hai. Digital marketing India mein ek unregulated market hai — koi bhi khud ko \"SEO expert\" bol sakta hai, aur pricing mein 10x ka farak dikh jaata hai bina kisi clear explanation ke.</p>\n\n<p>Is article mein hum honestly break karenge ki <strong>₹5,000/month SEO aur ₹50,000/month SEO ke beech actually kya farak hota hai</strong> — aur aapke liye kaunsa sahi hai.</p>\n\n<h2>Pehle samjhein: SEO mein paise kahan jaate hain?</h2>\n<p>Koi bhi SEO agency jab kaam karti hai, toh uske cost drivers hote hain:</p>\n<ul>\n<li><strong>Manpower:</strong> Content writer, SEO strategist, technical SEO expert, link outreach specialist</li>\n<li><strong>Tools:</strong> Ahrefs/Semrush (~₹8,000–₹15,000/month), Screaming Frog, rank trackers</li>\n<li><strong>Content production:</strong> Research + writing + editing + formatting</li>\n<li><strong>Link building:</strong> Outreach, relationship building, guest posting fees</li>\n<li><strong>Reporting:</strong> Analysis, strategy adjustment, client communication</li>\n</ul>\n<p>Ab socho — agar ek agency ₹5,000/month le rahi hai, toh upar ke saare kaam kaise cover honge? <strong>Short answer:</strong> Nahi ho sakte. Kuch toh trade-off zaroor hoga.</p>\n\n<h2>₹5,000/month SEO — honestly kya milta hai?</h2>\n\n<h3>1. Volume over quality content</h3>\n<p>₹5K budgets mein usually content mill-style writing hoti hai — AI-generated ya outsourced at ₹0.50–₹1 per word. Yeh content technically readable hoti hai par search intent match nahi karti, depth nahi hoti, aur Google ke Helpful Content update ke baad yeh type ka content rankings par aana band hua hai.</p>\n\n<h3>2. Generic keyword targeting</h3>\n<p>\"Digital marketing company India\" — high competition, no local intent, almost impossible to rank for without domain authority. Budget agencies often target easy-sounding par irrelevant keywords jo traffic toh laayen par leads nahi.</p>\n\n<h3>3. Black-hat ya grey-hat link building</h3>\n<p>Cheap backlinks = Private Blog Networks (PBNs), link farms, comment spam. Short term mein kuch rankings mil sakti hain, par Google ke manual actions ke baad website penalty mein aa sakti hai — aur recovery mein months lagte hain.</p>\n\n<h3>4. No technical SEO attention</h3>\n<p>Core Web Vitals fix karna, crawl errors resolve karna, schema markup implement karna — yeh sab time-intensive technical work hai jo ₹5K budgets mein almost never hoti.</p>\n\n<h3>5. Cookie-cutter reporting</h3>\n<p>Monthly ek PDF jo sirf \"keywords improved\" dikhata hai — bina context ke ki kyun improve hua, aur next month ka plan kya hai.</p>\n\n<h2>₹50,000/month SEO — is investment mein kya milta hai?</h2>\n\n<h3>1. Dedicated team, not a shared VA</h3>\n<p>Ek proper SEO strategist jo aapka account samjhe, industry research kare, competitors ko track kare. Freelancers 10–20 clients simultaneously handle karte hain — dedicated agencies mein account ownership hoti hai.</p>\n\n<h3>2. Real content strategy</h3>\n<p>Keyword research se sirf traffic nahi, <em>buying intent</em> identify karna. \"Best SEO agency Mumbai\" vs \"SEO agency Mumbai cheap\" — dono alag buyers hain. Premium budgets mein content calendars, topic clusters, aur funnel-mapped articles hote hain.</p>\n\n<h3>3. White-hat link building at scale</h3>\n<p>Genuine outreach, PR placements, industry publications mein guest posts. Yeh slow hai par permanent hai — Google iske liye reward karta hai.</p>\n\n<h3>4. Technical SEO as an ongoing process</h3>\n<p>Site speed, mobile usability, internal linking architecture, structured data, Core Web Vitals — yeh sab continuously monitor aur optimize hote hain.</p>\n\n<h3>5. GEO (Generative Engine Optimization)</h3>\n<p>2025–26 mein sirf Google rank karna kaafi nahi — ChatGPT, Perplexity, aur Google AI Overviews bhi answers de rahe hain. Premium agencies ab GEO strategies include karti hain jo ensure karti hain aapka brand AI-generated answers mein bhi appear kare.</p>\n\n<h3>6. Data-driven iteration</h3>\n<p>A/B testing meta descriptions, click-through rate optimization, conversion tracking — yeh decisions data se aate hain, intuition se nahi.</p>\n\n<h2>Comparison: Side-by-side breakdown</h2>\n<table style=\"width:100%;border-collapse:collapse;font-size:14px;\">\n<thead><tr style=\"background:#0f172a;color:#fff;\"><th style=\"padding:12px 16px;text-align:left;\">Factor</th><th style=\"padding:12px 16px;text-align:center;\">₹5,000/month</th><th style=\"padding:12px 16px;text-align:center;\">₹50,000/month</th></tr></thead>\n<tbody>\n<tr style=\"background:#f8fafc;\"><td style=\"padding:12px 16px;border-bottom:1px solid #e2e8f0;\">Content quality</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;\">Thin / AI bulk</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#16a34a;font-weight:600;\">Researched, intent-matched</td></tr>\n<tr><td style=\"padding:12px 16px;border-bottom:1px solid #e2e8f0;\">Link building</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#dc2626;\">Grey/black-hat risk</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#16a34a;font-weight:600;\">White-hat, sustainable</td></tr>\n<tr style=\"background:#f8fafc;\"><td style=\"padding:12px 16px;border-bottom:1px solid #e2e8f0;\">Technical SEO</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;\">Minimal / none</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#16a34a;font-weight:600;\">Ongoing monitoring</td></tr>\n<tr><td style=\"padding:12px 16px;border-bottom:1px solid #e2e8f0;\">GEO / AI search</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#dc2626;\">Not included</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#16a34a;font-weight:600;\">Core part of strategy</td></tr>\n<tr style=\"background:#f8fafc;\"><td style=\"padding:12px 16px;border-bottom:1px solid #e2e8f0;\">Reporting</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;\">Vanity metrics only</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#16a34a;font-weight:600;\">Revenue-tied insights</td></tr>\n<tr><td style=\"padding:12px 16px;border-bottom:1px solid #e2e8f0;\">Account ownership</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;\">Shared pool</td><td style=\"padding:12px 16px;text-align:center;border-bottom:1px solid #e2e8f0;color:#16a34a;font-weight:600;\">Dedicated strategist</td></tr>\n<tr style=\"background:#f8fafc;\"><td style=\"padding:12px 16px;\">Long-term risk</td><td style=\"padding:12px 16px;text-align:center;color:#dc2626;\">Penalty exposure</td><td style=\"padding:12px 16px;text-align:center;color:#16a34a;font-weight:600;\">Compound growth</td></tr>\n</tbody></table>\n\n<h2>Real baat: Toh cheap SEO \"scam\" hai?</h2>\n<p>Har baar nahi. Lekin yeh samajhna zaroori hai ki SEO ek skill + time + resource intensive kaam hai. Jab koi ₹5,000 mein full SEO offer karta hai, toh ya toh:</p>\n<ol>\n<li><strong>Woh shortcuts le raha hai</strong> (jo aage nuksaan karte hain)</li>\n<li><strong>Woh sirf basics kar raha hai</strong> (jo competitive niches mein kaafi nahi)</li>\n<li><strong>Woh genuinely skilled freelancer hai</strong> jo portfolio build kar raha hai (rare, par possible)</li>\n</ol>\n<p>Agar aap option 3 ko identify kar sakein — great, bargain hai. Par option 1 aur 2 bahut zyada common hain, aur dono ka risk aap hi uthate hain.</p>\n\n<h2>Aapke liye kaunsa budget sahi hai?</h2>\n<ul>\n<li><strong>Business size aur competition:</strong> Local bakery in a tier-3 city ka SEO ₹15K–₹20K mein ho sakta hai. Mumbai ka competitive real estate brand ₹50K+ se neeche serious results nahi milenge.</li>\n<li><strong>Timeline expectations:</strong> 6 months mein results chahiye ya 18 months mein? Realistic expectations set karein.</li>\n<li><strong>Business revenue:</strong> Agar aapka monthly revenue ₹5 lakh hai, toh ₹5K ka SEO investment waapas nahi aayega — consider karein minimum 3–5% of revenue.</li>\n<li><strong>Goal clarity:</strong> Brand awareness chahiye ya direct leads? Yeh strategy ko define karta hai.</li>\n</ul>\n\n<h2>7 questions jo aapko har SEO agency se poochhne chahiye</h2>\n<ol>\n<li>Aap link building kaise karte ho?</li>\n<li>Mere industry mein aapne kya results diye hain?</li>\n<li>Content aap khud likhoge ya outsource karoge?</li>\n<li>Technical SEO audit pehle karoge?</li>\n<li>Reporting mein kya dikhayenge — rankings only ya traffic aur leads bhi?</li>\n<li>GEO (AI search optimization) aapke plan mein hai?</li>\n<li>Agar results nahi aaye toh kya hoga?</li>\n</ol>\n\n<h2>Conclusion: Sasta SEO expensive ho sakta hai long-term mein</h2>\n<p>₹5,000/month SEO ka risk yeh nahi ki kuch nahi hoga — risk yeh hai ki <strong>galat cheez ho sakti hai</strong>. Google penalty, toxic backlinks, thin content — in sab se recover karne mein aapka double time aur double paisa lagega.</p>\n<p>Agar budget limited hai, toh better approach hai: <strong>kam scope mein achha kaam karwao</strong> — sirf technical SEO audit, ya sirf 2 quality articles per month — instead of cheap full-package jo sab kuch mediocre kare.</p>\n<p>Aur agar aap genuinely scale karna chahte ho — organic traffic jo consistent leads laaye, jo AI search mein bhi dikhao, jo competitor se better rank kare — toh ek serious SEO partner mein invest karna ek business decision hai, expense nahi.</p>\n\n</article>",
    "category": "SEO, GEO",
    "tags": [
      "SEO",
      "pricing",
      "India",
      "digital marketing",
      "Hinglish"
    ],
    "author": "Aetherank Team",
    "date": "April 5, 2026",
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&q=80",
    "status": "published",
    "readTime": "8 min read",
    "seo": {
      "title": "₹5,000/month SEO vs ₹50,000/month — Kya Farak Hai? | Aetherank",
      "schema": "{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"₹5,000/month SEO Agency vs ₹50,000/month — Actually Kya Farak Hai?\",\"author\":{\"@type\":\"Organization\",\"name\":\"Aetherank\"},\"datePublished\":\"2026-04-05\"}",
      "keywords": "seo agency price india, cheap seo vs expensive seo, seo cost india, seo agency comparison",
      "description": "Honest comparison of cheap vs premium SEO agencies in India. Kya ₹5K SEO worth it hai ya long-term mein expensive ho sakta hai? Full Hinglish breakdown."
    },
    "createdAt": "2026-04-05T17:41:31.986Z",
    "updatedAt": "2026-04-05T17:41:31.986Z"
  },
  {
    "id": "c28ba3fb6bdb",
    "title": "How to Scale Meta Ads from ₹50K to ₹5L/Month: An Indian Marketer Playbook",
    "slug": "scale-meta-ads-india-playbook-roas",
    "excerpt": "From learning phase to full-scale — the exact playbook Indian growth marketers use to scale Facebook and Instagram ad spend 10x while maintaining or improving ROAS.",
    "content": "<h2>What is ROAS and Why It Is Your Most Important Meta Ads Metric</h2><p>Return on Ad Spend (ROAS) = Revenue generated divided by Ad spend. A 4x ROAS means every rupee spent returned four rupees in revenue. Most brands optimise for the wrong metric — clicks or reach — and miss this number entirely.</p><h2>The Meta Ads Funnel: Match Creative to Awareness Stage</h2><h3>Top of Funnel (TOFU) — Awareness</h3><p>Target cold audiences. The goal is to introduce your brand, not sell. Use educational videos or problem-awareness ads. Expect high CPM and low conversion — that is fine at this stage.</p><h3>Middle of Funnel (MOFU) — Consideration</h3><p>Retarget people who watched 50% or more of your video or visited your website. Use testimonials, case studies, and comparison content. This is where trust is built.</p><h3>Bottom of Funnel (BOFU) — Conversion</h3><p>Retarget cart abandoners and product page viewers with incentive-led ads. Offer a discount, free shipping, or urgency. Expect highest ROAS here.</p><h2>A/B Testing: What to Test and When</h2><ul><li><strong>Creative first</strong> — Test 3–5 creative variations before touching anything else. Creative is the biggest ROAS lever.</li><li><strong>Audience second</strong> — Once you have a winning creative, test broad vs interest vs lookalike audiences.</li><li><strong>Copy third</strong> — Small headline changes can move CTR by 30–50%.</li><li><strong>Landing page fourth</strong> — If ad ROAS is good but purchase ROAS is low, the landing page is the problem.</li></ul><h2>Indian Market-Specific Considerations</h2><h3>Language and Regional Targeting</h3><p>India has 22 official languages. A single Hindi creative will not resonate in Tamil Nadu. Consider language-specific ad sets for Marathi, Tamil, Telugu, and Kannada audiences — they respond far better to native language content.</p><h3>Festive Season Planning</h3><p>CPMs spike 3–5x during Diwali, Holi, and Eid. Build warm audiences 4–6 weeks ahead and set budgets to capture the seasonal surge without overpaying for last-minute inventory.</p><h3>Payment and Trust Signals</h3><p>Cash-on-delivery (COD) is still dominant in Tier 2/3 cities. Prominently display UPI, EMI, and COD options on your landing page — missing these loses huge segments of Indian buyers.</p><h2>Scaling from ₹50K to ₹5L/Month</h2><ul><li><strong>Horizontal scaling</strong> — Duplicate winning ad sets to new audiences rather than increasing budget on one. Avoids audience saturation.</li><li><strong>Creative refresh cycle</strong> — Introduce 2–3 new creatives every 2 weeks. Ad fatigue is real; frequency above 3 kills CTR.</li><li><strong>Campaign Budget Optimisation</strong> — At scale, let Meta distribute budget intelligently across ad sets in real time.</li><li><strong>Broad Advantage+ Audiences</strong> — At ₹2L/month or more, trust Meta AI targeting over manual interest stacking.</li></ul><h2>Measuring What Matters</h2><p>Set up custom columns in Ads Manager: Purchase ROAS, Cost per Lead, Frequency (alert when above 4), and 7-day click attribution as your standard measurement window.</p>",
    "category": "Meta Ads",
    "tags": [
      "Meta Ads",
      "Facebook Ads",
      "ROAS",
      "Scaling",
      "India",
      "Digital Marketing"
    ],
    "author": "Aetherank Team",
    "date": "March 26, 2026",
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "7 min read",
    "seo": {
      "title": "How to Scale Meta Ads from ₹50K to ₹5L/Month: An Indian Marketer Playbook | Aetherank",
      "keywords": "scale meta ads india, facebook ads roas, instagram ads scaling 2026",
      "description": "The exact playbook Indian growth marketers use to scale Facebook and Instagram ad spend 10x while maintaining or improving ROAS — from learning phase to full scale."
    },
    "createdAt": "2026-04-05T15:50:37.350Z",
    "updatedAt": "2026-04-05T15:50:37.350Z"
  },
  {
    "id": "ea0e4d04ee1e",
    "title": "Meta Ads Strategy for Indian Businesses: A Complete 2026 Guide",
    "slug": "meta-ads-strategy-indian-businesses-2026-guide",
    "excerpt": "Master Facebook and Instagram advertising with a proven Meta Ads strategy built for Indian businesses — audience targeting, creative best practices, and full-funnel campaigns that drive real ROAS.",
    "content": "<h2>Why Meta Ads Work Differently From Search Ads</h2><p>If you have run Google Ads before, Meta Ads will feel like a different world — because they are. Google targets intent. Meta targets identity. Understanding this distinction is the foundation of profitable Facebook and Instagram advertising.</p><h2>The 5 Campaign Objectives You Need to Know</h2><ul><li><strong>Awareness</strong> — Reach people who have never heard of you.</li><li><strong>Traffic</strong> — Drive clicks to your website or app.</li><li><strong>Engagement</strong> — Get likes, shares, and comments to warm up cold audiences.</li><li><strong>Leads</strong> — Native lead forms that pre-fill from user profiles.</li><li><strong>Sales / Conversions</strong> — Your primary objective once the Meta Pixel is installed and trained.</li></ul><h2>Audience Targeting: The Real Superpower</h2><h3>1. Core Audiences</h3><p>Built from demographics, location, interests, and behaviours. Start broad (1–5M) and let the algorithm optimise. Overly narrow audiences starve Meta machine learning.</p><h3>2. Custom Audiences</h3><p>Upload your customer list, target website visitors, or reach people who have engaged with your Instagram profile. These are your warmest, highest-converting audiences.</p><h3>3. Lookalike Audiences</h3><p>Give Meta 500+ of your best customers and it will find millions of people who behave similarly. Start with 1% lookalikes for highest precision.</p><h2>Creative Strategy: What Actually Stops the Scroll</h2><ul><li><strong>Video Reels (0–15 sec)</strong> — Hook in the first 2 seconds. Show the outcome, not the product.</li><li><strong>UGC-style content</strong> — Authentic-looking videos consistently outperform polished brand videos.</li><li><strong>Carousel ads</strong> — Tell a story across slides. Works beautifully for e-commerce.</li><li><strong>Static images with bold text</strong> — Often cheaper and faster to test.</li></ul><h2>The Meta Pixel + Conversion API: Non-Negotiable</h2><p>Install both the Meta Pixel and the Conversions API to maximise signal quality. In a post-iOS 14 world, server-side events are essential for accurate attribution.</p><h2>Common Mistakes Indian Brands Make</h2><p><strong>Targeting too narrow</strong> — Restricting audience to under 500K kills the algorithm. Trust Meta AI with broader parameters.</p><p><strong>Pausing ads too early</strong> — Give campaigns 14 days before making any judgement calls.</p><p><strong>One creative for all placements</strong> — Design assets for each placement: Feed, Reels, Stories.</p>",
    "category": "Meta Ads",
    "tags": [
      "Meta Ads",
      "Facebook Ads",
      "Instagram Ads",
      "Social Media Marketing",
      "India"
    ],
    "author": "Aetherank Team",
    "date": "April 02, 2026",
    "image": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "9 min read",
    "seo": {
      "title": "Meta Ads Strategy for Indian Businesses: A Complete 2026 Guide | Aetherank",
      "keywords": "meta ads strategy india, facebook ads guide 2026, instagram advertising india",
      "description": "Learn how to build a profitable Meta Ads strategy for Indian businesses — audience targeting, creative best practices, and full-funnel campaigns."
    },
    "createdAt": "2026-04-05T15:50:00.651Z",
    "updatedAt": "2026-04-05T15:50:00.651Z"
  },
  {
    "id": "8fb1b2c5-bb21-42fd-95ad-c00126b29d1b",
    "title": "Why Your Google Rating is the Most Powerful Sales Tool You Are Ignoring",
    "slug": "google-rating-most-powerful-sales-tool",
    "excerpt": "Studies show 93% of consumers check Google reviews before buying. Learn how to strategically build, manage, and leverage your Google rating as a revenue asset.",
    "content": "<p>Your Google Business Profile rating is often the very first thing a prospect sees about your company. And 93% of consumers make a judgement call based on it before visiting your website or calling you.</p><h2>The Business Case for Investing in Reviews</h2><p>Businesses with 4.5+ star ratings consistently outperform competitors in local search rankings, click-through rates, and conversion rates.</p><h2>How to Build Your Rating Systematically</h2><p>Send a review request by WhatsApp or email within 24 hours of a successful delivery or project completion. Make it one tap for the customer to leave a review. Do this consistently and your rating will improve within 60-90 days.</p>",
    "category": "ORM",
    "tags": [
      "google rating",
      "online reviews",
      "reputation management",
      "local seo",
      "google business profile"
    ],
    "author": "Aetherank Team",
    "date": "Oct 12, 2025",
    "image": "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "5 min read",
    "seo": {
      "title": "Why Your Google Rating is Your Best Sales Tool | Aetherank",
      "schema": "",
      "keywords": "Google rating, Google reviews strategy, online reputation India, ORM business",
      "description": "Learn how to build, manage, and leverage your Google Business Profile rating to win more customers in India."
    },
    "createdAt": "2026-04-05T15:02:57.831Z",
    "updatedAt": "2026-04-05T15:02:57.831Z"
  },
  {
    "id": "3da82cc9-00e7-4f1e-8638-a28cfdffed6f",
    "title": "How to Handle Negative Google Reviews: A Step-by-Step Guide for Business Owners",
    "slug": "how-to-handle-negative-google-reviews-guide",
    "excerpt": "Negative reviews hurt your brand and cost you customers. Learn the exact process for responding to, resolving, and minimising the impact of bad reviews on Google.",
    "content": "<p>A single bad Google review is seen by hundreds of potential customers before they ever contact you. How you respond shapes their first impression of your business.</p><h2>Step 1: Respond Publicly Within 24 Hours</h2><p>Every negative review should receive a calm, professional public response within one business day. Acknowledge the customer experience and offer to resolve it offline.</p><h2>Step 2: Take It Offline</h2><p>Invite the reviewer to contact you directly to resolve the issue. Resolving complaints often converts unhappy reviewers into loyal customers who update or remove their review.</p><h2>Step 3: Generate More Positive Reviews</h2><p>The most effective long-term strategy is volume. 50 five-star reviews make a single negative one statistically insignificant.</p>",
    "category": "ORM",
    "tags": [
      "online reputation management",
      "google reviews",
      "negative reviews",
      "orm strategy"
    ],
    "author": "Aetherank Team",
    "date": "Oct 25, 2025",
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "6 min read",
    "seo": {
      "title": "How to Handle Negative Google Reviews | Aetherank",
      "schema": "",
      "keywords": "negative Google reviews, online reputation management, ORM India, handle bad reviews",
      "description": "Step-by-step guide for business owners on responding to, resolving, and minimising the impact of negative Google reviews."
    },
    "createdAt": "2026-04-05T15:02:57.826Z",
    "updatedAt": "2026-04-05T15:02:57.826Z"
  },
  {
    "id": "e4eb570a-4a27-4b35-a634-385a8c706669",
    "title": "Content Marketing for B2B: How to Generate Leads with Every Article You Publish",
    "slug": "content-marketing-b2b-lead-generation",
    "excerpt": "B2B content marketing done right converts readers into sales pipeline. Covers topic selection, lead magnets, and distribution strategies for Indian B2B brands.",
    "content": "<p>B2B content marketing in India is still massively underutilised, which means massive opportunity for brands willing to invest in it.</p><h2>Choose Topics That Attract Buyers, Not Browsers</h2><p>Map your content to the questions your prospects ask at each stage: awareness, consideration, and decision.</p><h2>Use Lead Magnets to Capture Emails</h2><p>Every comprehensive article should offer a related download — a checklist, template, or guide — in exchange for an email address. This converts your traffic into a nurture-able audience you own.</p>",
    "category": "Content Marketing",
    "tags": [
      "b2b content marketing",
      "lead generation",
      "content strategy",
      "india b2b"
    ],
    "author": "Aetherank Team",
    "date": "Nov 08, 2025",
    "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "8 min read",
    "seo": {
      "title": "B2B Content Marketing: Generate Leads with Every Article | Aetherank",
      "schema": "",
      "keywords": "B2B content marketing India, content marketing lead generation, B2B blog strategy",
      "description": "Learn how to build a B2B content marketing strategy that generates consistent inbound leads for Indian businesses."
    },
    "createdAt": "2026-04-05T15:02:57.822Z",
    "updatedAt": "2026-04-05T15:02:57.822Z"
  },
  {
    "id": "fd36157f-0175-4d54-98d8-aa99e21b6389",
    "title": "How Long-Form Content Drives 3x More Organic Traffic: A Proven Strategy",
    "slug": "long-form-content-drives-more-organic-traffic",
    "excerpt": "Data-backed proof that long-form articles consistently outperform short posts — plus a step-by-step strategy for creating content that ranks and converts.",
    "content": "<p>Content marketing is one of the highest-ROI strategies available to Indian businesses, but most brands make the same mistake: publishing too many short, shallow posts that Google has no reason to rank.</p><h2>Why Long-Form Content Wins</h2><p>Comprehensive articles signal authority to Google. They earn more backlinks naturally, rank for more keyword variations, and keep readers on your site longer.</p><h2>The Ideal Content Formula for 2026</h2><p>A well-performing piece combines: a keyword-targeted headline, a thorough answer to the searcher intent, structured subheadings, internal links to related content, FAQ schema at the bottom, and a clear call to action.</p>",
    "category": "Content Marketing",
    "tags": [
      "content marketing",
      "long-form content",
      "organic traffic",
      "seo content",
      "blog strategy"
    ],
    "author": "Aetherank Team",
    "date": "Nov 20, 2025",
    "image": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "7 min read",
    "seo": {
      "title": "How Long-Form Content Drives 3x More Traffic | Aetherank",
      "schema": "",
      "keywords": "long-form content, content marketing strategy, organic traffic India, blog SEO",
      "description": "Learn why long-form content outperforms short posts and how to create articles that rank on Google and convert readers into leads."
    },
    "createdAt": "2026-04-05T15:02:57.817Z",
    "updatedAt": "2026-04-05T15:02:57.817Z"
  },
  {
    "id": "833b93de-a051-44a7-a316-83b3b1077126",
    "title": "Why Your Website Speed is Killing Your Conversions (and How to Fix It)",
    "slug": "website-speed-kills-conversions-how-to-fix",
    "excerpt": "A 1-second delay in page load time reduces conversions by up to 7%. Learn exactly why site speed matters and the specific fixes that deliver the biggest improvements.",
    "content": "<p>Website speed is one of the highest-ROI improvements any business can make. Studies show a 1-second delay in page load time reduces conversions by 7% and increases bounce rates by 32%.</p><h2>Why Slow Websites Lose Customers</h2><p>Indian mobile users are increasingly impatient. With fast 4G and 5G connections widely available, a slow website feels broken. Users leave within 3 seconds if a page has not loaded.</p><h2>Top Fixes for Page Speed</h2><p>The biggest wins usually come from: compressing images to WebP format, enabling browser caching, using a CDN, minifying CSS and JavaScript, and upgrading to better hosting.</p>",
    "category": "Web Design",
    "tags": [
      "website speed",
      "page speed",
      "core web vitals",
      "conversion optimisation"
    ],
    "author": "Aetherank Team",
    "date": "Dec 05, 2025",
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "5 min read",
    "seo": {
      "title": "Why Website Speed Kills Conversions and How to Fix It | Aetherank",
      "schema": "",
      "keywords": "website speed optimisation, page speed conversions, improve website performance India",
      "description": "Slow websites cost you leads and sales. Learn the most impactful website speed optimisations for Indian businesses."
    },
    "createdAt": "2026-04-05T15:02:57.812Z",
    "updatedAt": "2026-04-05T15:02:57.812Z"
  },
  {
    "id": "4d1bec05-8df9-4ff9-8fa9-4cdcb12e5057",
    "title": "10 Web Design Trends Dominating 2026 Every Indian Business Must Know",
    "slug": "web-design-trends-2026-india",
    "excerpt": "From AI-personalised interfaces to ultra-fast Core Web Vitals, discover the web design trends that separate high-converting websites from outdated digital brochures.",
    "content": "<p>Web design in 2026 is no longer just about aesthetics — it is a growth lever. Businesses with modern, fast, and conversion-optimised websites consistently outperform competitors with outdated designs.</p><h2>1. Core Web Vitals as a Baseline</h2><p>Google PageSpeed scores of 90+ are no longer impressive — they are expected. Websites that do not meet Core Web Vitals thresholds are penalised in search rankings.</p><h2>2. Mobile-First Everything</h2><p>Over 70% of Indian web traffic is mobile. Websites designed for desktop first and then squeezed into mobile view are losing customers at every step of the funnel.</p>",
    "category": "Web Design",
    "tags": [
      "web design",
      "website",
      "core web vitals",
      "ux",
      "conversion"
    ],
    "author": "Aetherank Team",
    "date": "Dec 18, 2025",
    "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "6 min read",
    "seo": {
      "title": "Web Design Trends 2026 for Indian Businesses | Aetherank",
      "schema": "",
      "keywords": "web design trends 2026, website design India, Core Web Vitals, conversion design",
      "description": "Discover the top web design trends in 2026 that drive more leads and conversions for Indian businesses."
    },
    "createdAt": "2026-04-05T15:02:57.807Z",
    "updatedAt": "2026-04-05T15:02:57.807Z"
  },
  {
    "id": "09dfcd13-8fc1-4539-a164-7ff6a4e82e55",
    "title": "How to Build a Social Media Content Calendar That Actually Drives Sales",
    "slug": "social-media-content-calendar-drives-sales",
    "excerpt": "Stop posting randomly and start generating leads. This step-by-step guide shows you how to plan, create, and schedule content that converts followers into customers.",
    "content": "<p>Most brands post on social media reactively — whatever feels right that day. The brands that generate consistent leads have a system: a content calendar tied to a clear strategy.</p><h2>Step 1: Define Your Content Pillars</h2><p>Pick 3-5 recurring themes that your brand will own. For a digital marketing agency, pillars might be: industry tips, case studies, behind-the-scenes, client results, and trending news.</p><h2>Step 2: Plan by Platform</h2><p>Instagram favours visual and Reels content. LinkedIn rewards long-form text posts and document carousels. Plan platform-specific formats rather than repurposing the same post everywhere.</p><h2>Step 3: Batch Create and Schedule in Advance</h2><p>Block one day per month to create and schedule content 4 weeks ahead. This removes daily stress and ensures consistent posting frequency.</p>",
    "category": "Social Media",
    "tags": [
      "social media",
      "content calendar",
      "content strategy",
      "instagram"
    ],
    "author": "Aetherank Team",
    "date": "Jan 15, 2026",
    "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "7 min read",
    "seo": {
      "title": "How to Build a Social Media Content Calendar | Aetherank",
      "schema": "",
      "keywords": "social media content calendar, content strategy, social media planning India",
      "description": "Plan and execute a social media content calendar that drives consistent engagement and sales."
    },
    "createdAt": "2026-04-05T15:02:57.802Z",
    "updatedAt": "2026-04-05T15:02:57.802Z"
  },
  {
    "id": "01e1abc4-7680-4045-a61a-b83079b0caab",
    "title": "Instagram vs LinkedIn Marketing: Where Should Your Brand Focus in 2026?",
    "slug": "instagram-vs-linkedin-marketing-strategy-2026",
    "excerpt": "A platform-by-platform breakdown of Instagram vs LinkedIn for Indian brands — covering audiences, content formats, organic reach, and paid advertising.",
    "content": "<p>Every Indian business faces the same social media dilemma: Instagram or LinkedIn? The answer depends entirely on who your customers are and what you want to achieve.</p><h2>Instagram: Visual Brands and B2C</h2><p>Instagram remains dominant for consumer brands, fashion, food, hospitality, and lifestyle. The algorithm rewards Reels heavily, giving organic reach to brands that invest in short-form video.</p><h2>LinkedIn: B2B and Professional Services</h2><p>If your customers are business owners, managers, or professionals, LinkedIn is unmatched. Organic reach on LinkedIn is still remarkably high compared to other platforms.</p>",
    "category": "Social Media",
    "tags": [
      "instagram",
      "linkedin",
      "social media marketing",
      "content strategy"
    ],
    "author": "Aetherank Team",
    "date": "Jan 28, 2026",
    "image": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "6 min read",
    "seo": {
      "title": "Instagram vs LinkedIn Marketing 2026: Best Platform for Your Brand | Aetherank",
      "schema": "",
      "keywords": "Instagram marketing India, LinkedIn marketing, social media strategy 2026",
      "description": "Compare Instagram and LinkedIn marketing for Indian brands. Find the right social media platform strategy."
    },
    "createdAt": "2026-04-05T15:02:57.796Z",
    "updatedAt": "2026-04-05T15:02:57.796Z"
  },
  {
    "id": "6b853e36-4b56-49b4-bd4c-46607f7e37ba",
    "title": "How to Cut Your Cost Per Click by 40%: Advanced Google Ads Optimisation",
    "slug": "cut-cost-per-click-google-ads-optimisation-tips",
    "excerpt": "Practical, data-backed strategies to dramatically reduce your CPC on Google Ads without sacrificing lead quality — applicable to any industry.",
    "content": "<p>High cost per click is the single biggest complaint from businesses running Google Ads. The good news is that most wasted spend is preventable.</p><h2>1. Build a Tight Negative Keyword List</h2><p>Review your search terms report every week and add irrelevant terms to your negative keyword list. Most accounts waste 20-30% of their budget on unrelated searches.</p><h2>2. Improve Your Quality Score</h2><p>If your ad copy, keywords, and landing page all tightly match the searcher intent, your Quality Score rises — and higher Quality Scores mean lower CPCs.</p><h2>3. Use Ad Scheduling</h2><p>Run your ads only during hours when your customers are most likely to convert. Paying for clicks at 3am when your business is closed rarely makes sense.</p>",
    "category": "PPC",
    "tags": [
      "google ads",
      "cost per click",
      "ppc optimisation",
      "quality score"
    ],
    "author": "Aetherank Team",
    "date": "Feb 10, 2026",
    "image": "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "5 min read",
    "seo": {
      "title": "Cut Your Google Ads Cost Per Click by 40% | Aetherank",
      "schema": "",
      "keywords": "reduce CPC Google Ads, PPC optimisation, lower cost per click",
      "description": "Reduce CPC on Google Ads with these proven optimisation strategies: negative keywords, Quality Score improvement, and ad scheduling."
    },
    "createdAt": "2026-04-05T15:02:57.791Z",
    "updatedAt": "2026-04-05T15:02:57.791Z"
  },
  {
    "id": "58bef250-8d6a-4071-93ef-b123d5a43168",
    "title": "Google Ads vs Meta Ads in 2026: Which Delivers Better ROI for Indian Brands?",
    "slug": "google-ads-vs-meta-ads-roi-india-2026",
    "excerpt": "An in-depth comparison of Google Ads and Meta Ads for Indian businesses — covering cost, intent, reach, and when to use each platform for maximum ROI.",
    "content": "<p>Indian businesses frequently ask: should we run Google Ads or Meta Ads? The honest answer is that both platforms serve different purposes.</p><h2>Google Ads: High Intent, Higher CPCs</h2><p>Google Ads targets users actively searching for what you sell. The intent is explicit, which means conversion rates are typically higher.</p><h2>Meta Ads: Broad Reach, Lower Entry Cost</h2><p>Meta Ads excel at reach, brand awareness, and driving discovery for products people were not actively searching for.</p><h2>The Best Strategy: Use Both Together</h2><p>Run Meta Ads for top-of-funnel awareness, then retarget those warm audiences with Google Search Ads when they are ready to buy.</p>",
    "category": "PPC",
    "tags": [
      "google ads",
      "meta ads",
      "ppc",
      "paid advertising",
      "roi"
    ],
    "author": "Aetherank Team",
    "date": "Feb 22, 2026",
    "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "7 min read",
    "seo": {
      "title": "Google Ads vs Meta Ads 2026: Best ROI for Indian Businesses | Aetherank",
      "schema": "",
      "keywords": "Google Ads vs Meta Ads, PPC India, digital advertising ROI",
      "description": "Compare Google Ads vs Meta Ads for Indian brands. Find out which platform delivers better ROI for your industry."
    },
    "createdAt": "2026-04-05T15:02:57.787Z",
    "updatedAt": "2026-04-05T15:02:57.787Z"
  },
  {
    "id": "bbfab7e8-3e3f-44b0-8b71-3c047da3e84e",
    "title": "What is GEO? How to Get Your Brand Featured in AI-Generated Answers",
    "slug": "what-is-geo-generative-engine-optimisation-ai-answers",
    "excerpt": "GEO (Generative Engine Optimisation) is the newest frontier in search. Discover how to optimise your content to appear in ChatGPT, Google AI Overviews, and Perplexity.",
    "content": "<p>Generative Engine Optimisation (GEO) is the practice of ensuring your brand, products, and content appear in AI-generated search answers. With tools like ChatGPT, Perplexity, and Google AI Overviews answering billions of queries, traditional SEO alone is no longer enough.</p><h2>Why GEO Matters in 2026</h2><p>AI-generated answers are eating into traditional click-through traffic. Brands that appear in these answers see dramatically higher awareness and trust.</p><h2>How to Optimise for GEO</h2><p>Write comprehensive articles that directly answer common questions in your industry. Add FAQ schema and HowTo schema. Build brand mentions across authoritative publications. Ensure your website loads fast and is easily crawlable by AI models.</p>",
    "category": "SEO",
    "tags": [
      "geo",
      "ai search",
      "seo",
      "chatgpt",
      "google ai overview"
    ],
    "author": "Aetherank Team",
    "date": "Mar 05, 2026",
    "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "6 min read",
    "seo": {
      "title": "What is GEO? Generative Engine Optimisation Explained | Aetherank",
      "schema": "",
      "keywords": "GEO, generative engine optimisation, AI search, ChatGPT SEO",
      "description": "Learn how GEO works and how to get your brand featured in ChatGPT, Google AI Overviews, and Perplexity answers."
    },
    "createdAt": "2026-04-05T15:02:57.782Z",
    "updatedAt": "2026-04-05T15:02:57.782Z"
  },
  {
    "id": "14e76278-a200-4042-b323-618bf41cd4b1",
    "title": "How to Rank #1 on Google in 2026: A Complete SEO Guide for Indian Businesses",
    "slug": "how-to-rank-1-on-google-2026-seo-guide-india",
    "excerpt": "Learn the exact SEO strategies that drive first-page rankings for Indian businesses in 2026 — from technical audits to link building and GEO optimisation.",
    "content": "<p>Search engine optimisation has evolved dramatically. In 2026, ranking on Google requires a combination of technical excellence, high-quality content, and GEO (Generative Engine Optimisation) to appear in AI-generated answers.</p><h2>1. Start with a Technical Audit</h2><p>Before any content or link strategy, ensure your website has no technical blockers: fast load times, mobile responsiveness, clean crawlability, and valid schema markup.</p><h2>2. Target Keywords with Intent</h2><p>Focus on keywords where the searcher is ready to make a decision. Long-tail keywords like \"best digital marketing agency in Mumbai\" convert far better than broad terms.</p><h2>3. Optimise for GEO</h2><p>AI Overviews on Google, ChatGPT, and Perplexity now answer millions of queries daily. Structure your content with clear questions and answers, add FAQ schema, and ensure your brand has authoritative citations across the web.</p>",
    "category": "SEO",
    "tags": [
      "seo",
      "geo",
      "google",
      "rankings",
      "india"
    ],
    "author": "Aetherank Team",
    "date": "Mar 15, 2026",
    "image": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=75&auto=format&fit=crop",
    "status": "published",
    "readTime": "8 min read",
    "seo": {
      "title": "How to Rank #1 on Google in 2026 | Aetherank",
      "schema": "",
      "keywords": "SEO India 2026, rank on Google, GEO optimisation, digital marketing India",
      "description": "Complete SEO guide for Indian businesses in 2026. Technical SEO, GEO, link building, and content strategies that work."
    },
    "createdAt": "2026-04-05T15:02:57.724Z",
    "updatedAt": "2026-04-05T15:02:57.724Z"
  }
];

const SEED_SETTINGS = {
  "seo": {
    "/": {
      "title": "Aetherank | Digital Marketing Agency in Mumbai",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@graph\": [\n    {\n      \"@type\": \"Organization\",\n      \"name\": \"Aetherank\",\n      \"url\": \"https://aetherank.in\",\n      \"logo\": {\n        \"@type\": \"ImageObject\",\n        \"url\": \"https://aetherank.in/favicon.svg\"\n      },\n      \"contactPoint\": {\n        \"@type\": \"ContactPoint\",\n        \"telephone\": \"+91-80109-60269\",\n        \"contactType\": \"customer service\"\n      },\n      \"address\": {\n        \"@type\": \"PostalAddress\",\n        \"streetAddress\": \"Rustomjee Global City, J-27 163, Near ClubOne, Virar West\",\n        \"addressLocality\": \"Mumbai\",\n        \"addressRegion\": \"Maharashtra\",\n        \"postalCode\": \"401303\",\n        \"addressCountry\": \"IN\"\n      },\n      \"sameAs\": [\n        \"https://www.instagram.com/aetherank\",\n        \"https://www.linkedin.com/company/aetherank\"\n      ]\n    },\n    {\n      \"@type\": \"WebSite\",\n      \"name\": \"Aetherank\",\n      \"url\": \"https://aetherank.in\"\n    },\n    {\n      \"@type\": \"LocalBusiness\",\n      \"name\": \"Aetherank Digital Marketing Agency\",\n      \"@id\": \"https://aetherank.in/#localbusiness\",\n      \"url\": \"https://aetherank.in\",\n      \"telephone\": \"+91-80109-60269\",\n      \"address\": {\n        \"@type\": \"PostalAddress\",\n        \"streetAddress\": \"Rustomjee Global City, J-27 163, Near ClubOne, Virar West\",\n        \"addressLocality\": \"Mumbai\",\n        \"addressRegion\": \"Maharashtra\",\n        \"postalCode\": \"401303\",\n        \"addressCountry\": \"IN\"\n      },\n      \"priceRange\": \"₹₹\",\n      \"openingHours\": \"Mo-Fr 09:00-18:00\"\n    }\n  ]\n}",
      "keywords": "digital marketing agency mumbai, seo agency india, ppc management, social media marketing agency",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Aetherank is a results-driven digital marketing agency in Mumbai. We specialise in SEO, GEO, PPC, Social Media, Web Design & Content Marketing."
    },
    "/blog": {
      "title": "Digital Marketing Blog | Expert SEO & Growth Insights | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Blog\",\n  \"name\": \"Aetherank Digital Marketing Blog\",\n  \"url\": \"https://aetherank.com/blog\",\n  \"description\": \"Expert insights on SEO, GEO, PPC, social media, and digital marketing trends.\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\",\n    \"logo\": {\n      \"@type\": \"ImageObject\",\n      \"url\": \"https://aetherank.com/logo.svg\"\n    }\n  }\n}",
      "keywords": "digital marketing blog india, seo tips, marketing insights, geo optimization blog",
      "description": "Stay ahead with expert insights on SEO, GEO, PPC, social media, and digital marketing trends from the Aetherank team."
    },
    "/contact": {
      "title": "Contact Us | Aetherank Digital Marketing Agency",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"ContactPage\",\n  \"name\": \"Contact Aetherank\",\n  \"url\": \"https://aetherank.com/contact\",\n  \"description\": \"Reach out to Aetherank's team in Mumbai for digital marketing consultations.\",\n  \"contactOption\": {\n    \"@type\": \"ContactPoint\",\n    \"telephone\": \"+91-80109-60269\",\n    \"email\": \"help@aetherank.com\",\n    \"contactType\": \"customer support\"\n  }\n}",
      "keywords": "contact aetherank, digital marketing agency contact mumbai, marketing consultation",
      "description": "Get in touch with Aetherank. Our team in Mumbai is ready to help you grow your business online. Call, email, or visit us."
    },
    "/about-us": {
      "title": "About Us | Aetherank Digital Marketing Agency",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"AboutPage\",\n  \"name\": \"About Aetherank Digital Marketing Agency\",\n  \"url\": \"https://aetherank.com/about-us\",\n  \"description\": \"Aetherank is an AI-powered digital marketing agency headquartered in India, scaling ambitious brands with data-driven strategies.\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  }\n}",
      "keywords": "about aetherank, digital marketing company mumbai, marketing team india",
      "description": "Learn about Aetherank — a Mumbai-based digital marketing agency with 5+ years experience scaling 100+ brands across India."
    },
    "/services": {
      "title": "Digital Marketing Services in Mumbai, India | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"CollectionPage\",\n  \"name\": \"Digital Marketing Services | Aetherank\",\n  \"url\": \"https://aetherank.com/services\",\n  \"description\": \"End-to-end digital marketing services to elevate your brand, drive qualified traffic, and multiply revenue.\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  }\n}",
      "keywords": "digital marketing services, seo services india, ppc agency, social media management",
      "description": "Explore Aetherank's full suite of digital marketing services: SEO, GEO, PPC, Social Media, Web Design, Content Marketing & ORM."
    },
    "/free-audit": {
      "title": "Free Digital Marketing Audit | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Free Digital Marketing Audit\",\n  \"serviceType\": \"Digital Marketing Audit\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"description\": \"Free comprehensive audit of your website's SEO, social media, and digital presence.\",\n  \"url\": \"https://aetherank.com/free-audit\",\n  \"offers\": {\n    \"@type\": \"Offer\",\n    \"price\": \"0\",\n    \"priceCurrency\": \"INR\",\n    \"availability\": \"https://schema.org/InStock\"\n  }\n}",
      "keywords": "free seo audit india, website audit, digital marketing audit mumbai",
      "description": "Get a free comprehensive audit of your website's SEO, social media, and digital presence. No commitment required."
    },
    "/case-studies": {
      "title": "Case Studies | Aetherank Digital Marketing",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"CollectionPage\",\n  \"name\": \"Aetherank Case Studies\",\n  \"url\": \"https://aetherank.com/case-studies\",\n  \"description\": \"Real results from real brands — measurable growth in traffic, leads, and revenue.\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  }\n}",
      "keywords": "digital marketing case studies india, seo results, marketing success stories",
      "description": "See real results from real brands. Explore Aetherank's case studies showing measurable growth in traffic, leads, and revenue."
    },
    "/services/orm": {
      "title": "Online Reputation Management | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Online Reputation Management\",\n  \"serviceType\": \"Reputation Management\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"India\"\n  },\n  \"description\": \"Protect your brand image, suppress negative search results, and build a 5-star reputation online.\",\n  \"url\": \"https://aetherank.com/services/orm\"\n}",
      "keywords": "online reputation management india, orm services mumbai, brand reputation management",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Protect and build your brand reputation online with Aetherank's ORM services. Monitor, manage, and improve how you appear online."
    },
    "/services/ppc": {
      "title": "PPC & Google Ads Management Services India | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"PPC & Google Ads Management\",\n  \"serviceType\": \"Pay-Per-Click Advertising\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"India\"\n  },\n  \"description\": \"Hyper-targeted PPC campaigns that maximise ROAS and generate high-quality leads instantly.\",\n  \"url\": \"https://aetherank.com/services/ppc\",\n  \"offers\": {\n    \"@type\": \"Offer\",\n    \"priceCurrency\": \"INR\",\n    \"availability\": \"https://schema.org/InStock\"\n  }\n}",
      "keywords": "ppc agency mumbai, google ads management, meta ads india, paid advertising",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Maximise your ROI with Aetherank's PPC and paid advertising services. Google Ads, Meta Ads, and performance-driven campaigns."
    },
    "/services/seo": {
      "title": "SEO & GEO Optimization Services in Mumbai | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"SEO & GEO Services\",\n  \"serviceType\": \"Search Engine Optimisation\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"India\"\n  },\n  \"description\": \"Rank higher on Google and AI search engines. Data-driven SEO and GEO strategies for sustainable organic growth.\",\n  \"url\": \"https://aetherank.com/services/seo\",\n  \"offers\": {\n    \"@type\": \"Offer\",\n    \"priceCurrency\": \"INR\",\n    \"availability\": \"https://schema.org/InStock\"\n  }\n}",
      "keywords": "seo services mumbai, geo optimization, search engine optimization india, organic growth",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Rank higher on Google and AI search engines with Aetherank's SEO and GEO services. Data-driven strategies for sustainable organic growth."
    },
    "/privacy-policy": {
      "title": "Privacy Policy | Aetherank Digital Marketing Agency",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebPage\",\n  \"name\": \"Privacy Policy | Aetherank\",\n  \"url\": \"https://aetherank.com/privacy-policy\",\n  \"description\": \"How Aetherank collects, uses, and protects your personal data.\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  }\n}",
      "keywords": "aetherank privacy policy, data protection, personal data",
      "description": "Read Aetherank's privacy policy to understand how we collect, use, and protect your personal data in compliance with applicable laws."
    },
    "/request-proposal": {
      "title": "Request a Custom Digital Marketing Proposal | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebPage\",\n  \"name\": \"Request a Proposal | Aetherank\",\n  \"url\": \"https://aetherank.com/request-proposal\",\n  \"description\": \"Request a custom digital marketing proposal tailored to your business goals and budget.\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  }\n}",
      "keywords": "digital marketing proposal india, marketing quote mumbai, hire digital marketing agency",
      "description": "Ready to grow? Request a custom digital marketing proposal from Aetherank tailored to your business goals and budget."
    },
    "/terms-of-service": {
      "title": "Terms of Service | Aetherank Digital Marketing Agency",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebPage\",\n  \"name\": \"Terms of Service | Aetherank\",\n  \"url\": \"https://aetherank.com/terms-of-service\",\n  \"description\": \"Terms governing use of Aetherank's website and digital marketing services.\",\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  }\n}",
      "keywords": "aetherank terms of service, terms and conditions, service agreement",
      "description": "Review Aetherank's terms of service governing use of our website and digital marketing services."
    },
    "/services/meta-ads": {
      "title": "Meta Ads Management (Facebook & Instagram) | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Meta Ads Management\",\n  \"serviceType\": \"Social Media Advertising\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"India\"\n  },\n  \"description\": \"Expert Meta Ads management for Facebook & Instagram — precision targeting, high-converting creatives, and relentless optimisation.\",\n  \"url\": \"https://aetherank.com/services/meta-ads\"\n}",
      "keywords": "meta ads agency india, facebook ads management, instagram ads agency, meta advertising mumbai, facebook marketing india",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Expert Meta Ads management for Facebook & Instagram. Drive targeted traffic, generate quality leads, and scale your sales with ROI-focused ad campaigns."
    },
    "/services/social-media": {
      "title": "Social Media Marketing Services in India | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Social Media Marketing\",\n  \"serviceType\": \"Social Media Management\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"India\"\n  },\n  \"description\": \"Build a loyal community and turn followers into customers across Instagram, LinkedIn, Facebook, and YouTube.\",\n  \"url\": \"https://aetherank.com/services/social-media\"\n}",
      "keywords": "social media marketing mumbai, instagram marketing, facebook ads, linkedin marketing india",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Build your brand on Instagram, Facebook, LinkedIn, and YouTube with Aetherank's social media marketing services."
    },
    "/services/content-marketing": {
      "title": "Content Marketing Services | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Content Marketing\",\n  \"serviceType\": \"Content Marketing\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"India\"\n  },\n  \"description\": \"Strategic content that drives organic traffic, builds authority, and supports SEO and GEO efforts.\",\n  \"url\": \"https://aetherank.com/services/content-marketing\"\n}",
      "keywords": "content marketing agency india, blog writing service, content strategy mumbai",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Drive organic traffic and build authority with Aetherank's content marketing services. Blogs, videos, infographics & more."
    },
    "/services/web-design-development": {
      "title": "Web Design & Development Services Mumbai | Aetherank",
      "schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Web Design & Development\",\n  \"serviceType\": \"Web Development\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Aetherank\",\n    \"url\": \"https://aetherank.in\"\n  },\n  \"areaServed\": {\n    \"@type\": \"Country\",\n    \"name\": \"India\"\n  },\n  \"description\": \"Stunning, fast, and conversion-optimised websites that turn visitors into customers.\",\n  \"url\": \"https://aetherank.com/services/web-design-development\",\n  \"offers\": [\n    {\n      \"@type\": \"Offer\",\n      \"name\": \"Landing Page\",\n      \"price\": \"10000\",\n      \"priceCurrency\": \"INR\"\n    },\n    {\n      \"@type\": \"Offer\",\n      \"name\": \"Corporate Website\",\n      \"price\": \"25000\",\n      \"priceCurrency\": \"INR\"\n    },\n    {\n      \"@type\": \"Offer\",\n      \"name\": \"E-Commerce Store\",\n      \"price\": \"45000\",\n      \"priceCurrency\": \"INR\"\n    }\n  ]\n}",
      "keywords": "web design mumbai, website development india, landing page design, e-commerce website",
      "faq_schema": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"FAQPage\",\n  \"mainEntity\": [\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What services does Aetherank offer?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How is GEO different from traditional SEO?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How long before I see results?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"Do you work with small and mid-sized businesses?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"What does a free audit include?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.\"\n      }\n    },\n    {\n      \"@type\": \"Question\",\n      \"name\": \"How do I get started?\",\n      \"acceptedAnswer\": {\n        \"@type\": \"Answer\",\n        \"text\": \"Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.\"\n      }\n    }\n  ]\n}",
      "description": "Get a stunning, high-converting website designed and developed by Aetherank. Landing pages, corporate sites, and e-commerce stores."
    }
  },
  "content": {
    "faqs": [
      {
        "a": "We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses.",
        "q": "What services does Aetherank offer?"
      },
      {
        "a": "Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic.",
        "q": "How is GEO different from traditional SEO?"
      },
      {
        "a": "PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand.",
        "q": "How long before I see results?"
      },
      {
        "a": "Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow.",
        "q": "Do you work with small and mid-sized businesses?"
      },
      {
        "a": "Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached.",
        "q": "What does a free audit include?"
      },
      {
        "a": "Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals.",
        "q": "How do I get started?"
      }
    ],
    "hero": {
      "headline": "We Drive Real Growth for Ambitious Brands",
      "cta_primary": "Get Free Audit",
      "subheadline": "We help Indian businesses get more leads from Google, Instagram, YouTube & ChatGPT — with zero guesswork and full transparency.",
      "cta_secondary": "View Our Work"
    },
    "about": {
      "points": [
        "We treat your budget like our own — zero waste, maximum ROI.",
        "Real-time dashboards so you always know exactly what's happening.",
        "AI-driven strategies built for the Indian market, not copy-pasted templates.",
        "Dedicated account manager. One point of contact. Full accountability."
      ],
      "headline": "India's Most Trusted AI Marketing Agency",
      "subheadline": "Founded on a simple promise — digital marketing should be measurable, transparent, and tied directly to your revenue."
    },
    "pages": {
      "/blog": {
        "headline": "Digital Marketing",
        "subheadline": "Expert articles, case studies, and strategies from the Aetherank team to help you stay ahead in the digital landscape.",
        "headline_highlight": "Insights"
      },
      "/contact": {
        "cta_text": "Send Message",
        "headline": "Let's Grow",
        "subheadline": "Our team in Mumbai is ready to help you dominate your market. Reach out and let's start a conversation.",
        "headline_highlight": "Together"
      },
      "/about-us": {
        "cta_text": "Work With Us",
        "headline": "Engineering Growth for",
        "subheadline": "An AI-powered digital marketing agency headquartered in India — blending data science with creative brilliance to deliver measurable ROI.",
        "headline_highlight": "Ambitious Brands"
      },
      "/services": {
        "cta_text": "Get Free Audit",
        "headline": "Comprehensive Digital",
        "subheadline": "End-to-end solutions to elevate your brand, drive qualified traffic, and multiply your revenue.",
        "headline_highlight": "Marketing Services"
      },
      "/free-audit": {
        "cta_text": "Claim Free Audit Now",
        "headline": "Get Your FREE Comprehensive Website &",
        "subheadline": "Discover hidden issues costing you leads & traffic. Receive a detailed 15+ page audit report in 48 hours, plus a personalized strategy call.",
        "headline_highlight": "SEO, GEO Audit"
      },
      "/case-studies": {
        "headline": "Our",
        "subheadline": "Discover how we've helped ambitious brands scale their revenue, dominate search, and build lasting digital authority.",
        "headline_highlight": "Success Stories"
      },
      "/services/orm": {
        "cta_text": "Get Free Brand Audit",
        "headline": "Online Reputation",
        "subheadline": "Control the narrative. We protect your brand image, suppress negative search results, and build a 5-star reputation online.",
        "headline_highlight": "Management"
      },
      "/services/ppc": {
        "cta_text": "Get Free Ads Audit",
        "headline": "PPC &",
        "subheadline": "Stop wasting ad spend. We create hyper-targeted campaigns that maximize your Return on Ad Spend (ROAS) and generate high-quality leads instantly.",
        "headline_highlight": "Google Ads"
      },
      "/services/seo": {
        "cta_text": "Get Free SEO, GEO Audit",
        "headline": "Search Engine",
        "subheadline": "Dominate the first page of Google. We use data-driven strategies to increase your organic visibility and drive high-intent traffic to your website.",
        "headline_highlight": "Optimization"
      },
      "/request-proposal": {
        "cta_text": "Submit Proposal Request",
        "headline": "Request Your",
        "subheadline": "Tell us about your goals and we'll craft a bespoke digital marketing strategy tailored to your business.",
        "headline_highlight": "Custom Proposal"
      },
      "/services/meta-ads": {
        "cta_text": "Get Free Meta Ads Audit",
        "headline": "Meta Ads That",
        "subheadline": "Facebook & Instagram advertising built for ROI — precise audience targeting, scroll-stopping creatives, and relentless optimisation to scale your business.",
        "headline_highlight": "Drive Revenue"
      },
      "/services/social-media": {
        "cta_text": "Get Free Social Audit",
        "headline": "Social Media",
        "subheadline": "Build a loyal community, enhance brand awareness, and turn followers into paying customers across Instagram, LinkedIn, Facebook, and Twitter.",
        "headline_highlight": "Management"
      },
      "/services/content-marketing": {
        "cta_text": "Get Content Audit",
        "headline": "Content",
        "subheadline": "Words that sell. Engage your audience, build unquestionable authority, and support your SEO, GEO efforts with high-quality, strategic content.",
        "headline_highlight": "Marketing"
      },
      "/services/web-design-development": {
        "cta_text": "Request a Proposal",
        "headline": "Web Design &",
        "subheadline": "Your website is your 24/7 salesperson. We build stunning, fast, and conversion-optimized websites that turn visitors into customers.",
        "headline_highlight": "Development"
      }
    },
    "stats": [
      {
        "label": "Years of Excellence",
        "value": "5+"
      },
      {
        "label": "Brands Scaled",
        "value": "100+"
      },
      {
        "label": "Global Offices",
        "value": "3+"
      },
      {
        "label": "Client Retention",
        "value": "98%"
      }
    ],
    "contact": {
      "email": "contact@aetherank.com",
      "phone": "+91 80109 60269",
      "twitter": "#",
      "facebook": "#",
      "linkedin": "#",
      "logo_url": "",
      "address_1": "Tardeo AC Market, 239, Near Mumbai Central, Tardeo, Mumbai, Maharashtra, India - 400034",
      "address_2": "Rustomjee Global City, J/27 163, near ClubOne, Virar West, Maharashtra, India - 401303",
      "address_3": "2906 Bull Run Ct, Missouri City, TX, USA 77459",
      "instagram": "#",
      "whatsapp": "+91 80109 60269",
      "favicon_url": "",
      "footer_tagline": "India's premier AI-powered digital marketing agency. We turn clicks into clients."
    },
    "about_page": {
      "stats": [
        {
          "label": "Global Offices",
          "value": "3+"
        },
        {
          "label": "Years Combined Experience",
          "value": "14+"
        },
        {
          "label": "Successful Projects",
          "value": "100+"
        },
        {
          "label": "Client Retention Rate",
          "value": "98%"
        }
      ],
      "team_roles": [
        {
          "count": "5+",
          "label": "Growth Marketers"
        },
        {
          "count": "3+",
          "label": "Creative Designers"
        },
        {
          "count": "4+",
          "label": "Web Developers"
        },
        {
          "count": "3+",
          "label": "SEO, GEO Specialists"
        }
      ],
      "team_total": "15+",
      "core_values": [
        {
          "desc": "We don't care about vanity metrics. We care about leads, sales, and ROI.",
          "title": "Results Obsessed"
        },
        {
          "desc": "You'll always know exactly what we're doing and why we're doing it.",
          "title": "Radical Transparency"
        },
        {
          "desc": "In the digital world, speed wins. We move fast and iterate faster.",
          "title": "Speed of Execution"
        },
        {
          "desc": "We treat your business and your budget as if it were our own.",
          "title": "Client Empathy"
        }
      ],
      "india_stats": [
        {
          "sub": "Same enterprise quality",
          "label": "Lower Cost vs Metro Agencies",
          "value": "60%"
        },
        {
          "sub": "Tier-1, 2 & 3 cities",
          "label": "Addressable Market",
          "value": "500M+"
        },
        {
          "sub": "Across all disciplines",
          "label": "Years Combined Experience",
          "value": "14+"
        },
        {
          "sub": "Always in your timezone",
          "label": "Client Support",
          "value": "24/7"
        }
      ],
      "story_quote": "Every rupee you spend on marketing should be accountable — that's the standard we hold ourselves to.",
      "india_points": [
        "Deep understanding of Tier-2 and Tier-3 market dynamics",
        "Enterprise-quality work without metro-city overhead costs",
        "Agile, hungry, and dedicated team culture",
        "Central location to serve clients Pan-India efficiently"
      ],
      "story_points": [
        "100+ brands grown",
        "3+ Global Offices",
        "SEO, GEO, PPC & Social",
        "AI-first approach"
      ],
      "story_paragraphs": [
        "Founded in India, Aetherank started with a simple observation: most businesses were guessing with their marketing budgets.",
        "We saw agencies reporting on 'vanity metrics' like likes and impressions, while founders were left wondering where the revenue was. We decided to change that.",
        "Today, we leverage advanced AI tools and strict analytical rigor to ensure every rupee spent translates into business growth — for local startups and pan-India enterprises alike."
      ]
    },
    "terms_html": "",
    "ai_advantage": {
      "cards": [
        {
          "desc": "Rank on Google and AI search engines — get found by the right customers every day, on autopilot.",
          "stat": "+340%",
          "title": "SEO, GEO & Content",
          "statLabel": "avg. traffic growth"
        },
        {
          "desc": "Viral-worthy content on Instagram & YouTube that converts followers into buyers.",
          "stat": "3×",
          "title": "Social Media & Reels",
          "statLabel": "engagement increase"
        },
        {
          "desc": "Data-backed PPC campaigns with a clear ROI — not a single rupee wasted.",
          "stat": "₹4.2",
          "title": "Google & Meta Ads",
          "statLabel": "avg. return per ₹1 spent"
        },
        {
          "desc": "High-converting sites that turn visitors into paying customers within seconds.",
          "stat": "58%",
          "title": "Website & Landing Pages",
          "statLabel": "higher conversion rate"
        }
      ],
      "section_headline": "Every Service Engineered to Drive Revenue",
      "section_subheadline": "We don't offer cookie-cutter packages. Every strategy is custom-built for your business, your city, your goals."
    },
    "case_studies": [
      {
        "id": 1,
        "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=70&auto=format",
        "client": "Mansi Jewelry",
        "label1": "Organic Traffic",
        "label2": "Revenue",
        "metric1": "+340%",
        "metric2": "+220%",
        "industry": "E-Commerce",
        "solution": "Full-funnel SEO & CRO program: technical audit with schema markup, 40+ buying guides targeting commercial keywords, product page optimisation, and high-DA link building across fashion and lifestyle publications.",
        "timeline": "8 Months",
        "challenge": "Low organic rankings for high-intent jewelry keywords, heavy reliance on paid ads, under-optimized product pages, and mobile conversion bottlenecks."
      },
      {
        "id": 2,
        "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=70&auto=format",
        "client": "HealthPlus Clinics",
        "label1": "Google Ads ROAS",
        "label2": "Cost Per Lead",
        "metric1": "6.2x",
        "metric2": "-45%",
        "industry": "Healthcare",
        "solution": "Restructured PPC campaigns, hyper-local targeting, and optimized landing pages for appointments.",
        "timeline": "3 Months",
        "challenge": "High cost-per-acquisition on Google Ads, struggling to compete with local hospitals."
      },
      {
        "id": 3,
        "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=70&auto=format",
        "client": "BuildRight Realty",
        "label1": "Social Reach",
        "label2": "Qualified Inquiries",
        "metric1": "+500%",
        "metric2": "+95%",
        "industry": "Real Estate",
        "solution": "Aggressive Meta ads strategy with video tours and lead generation forms.",
        "timeline": "6 Months",
        "challenge": "Zero social media presence and relying heavily on expensive offline brokers."
      },
      {
        "id": 4,
        "image": "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=70&auto=format",
        "client": "Arsha Vidya Ananda",
        "label1": "Course Signups",
        "label2": "Page Load Time",
        "metric1": "+180%",
        "metric2": "0.8s",
        "industry": "Online Education",
        "solution": "4-month technical + CRO sprint: Core Web Vitals overhaul reducing load time to 0.8s, redesigned course landing pages with trust signals, SEO targeting high-intent keywords, and full mobile responsiveness upgrades.",
        "timeline": "4 Months",
        "challenge": "Slow page load times (~3.2s), low organic visibility for course searches, high bounce rates on course pages, and poor mobile experience limiting global student conversions."
      },
      {
        "id": 5,
        "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70&auto=format",
        "client": "SpiceRoute Dining",
        "label1": "Google Rating",
        "label2": "Table Bookings",
        "metric1": "4.8★",
        "metric2": "+40%",
        "industry": "Restaurant",
        "solution": "Proactive ORM strategy, review generation campaigns, and local SEO, GEO push.",
        "timeline": "5 Months",
        "challenge": "Negative online reviews affecting footfall and brand perception."
      },
      {
        "id": 6,
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=70&auto=format",
        "client": "CloudSync Solutions",
        "label1": "Email Subs",
        "label2": "Demo Requests",
        "metric1": "15k+",
        "metric2": "+3x",
        "industry": "SaaS",
        "solution": "Content marketing engine featuring in-depth whitepapers, webinars, and SEO, GEO blogs.",
        "timeline": "12 Months",
        "challenge": "Struggling to educate enterprise clients and generate inbound leads."
      }
    ],
    "privacy_html": "",
    "testimonials": [
      {
        "name": "Rahul Sharma",
        "text": "Aetherank completely overhauled our SEO, GEO strategy. We saw a 3x increase in inbound leads within just 4 months. Their team is transparent and highly skilled.",
        "company": "TechNova India"
      },
      {
        "name": "Priya Patel",
        "text": "The ROAS on our Google Ads campaigns went through the roof after Aetherank took over. They understand the Indian market dynamics perfectly.",
        "company": "Luxe Boutiques"
      },
      {
        "name": "Amit Kumar",
        "text": "Our social media presence was non-existent. Aetherank built a community around our brand that directly translates into site visits and sales.",
        "company": "BuildRight Realty"
      },
      {
        "name": "Sneha Reddy",
        "text": "Professional, data-driven, and incredibly responsive. The new website they developed for us has a conversion rate we didn't think was possible.",
        "company": "HealthPlus Clinics"
      }
    ],
    "service_pages": {
      "/services/orm": {
        "pricing": [
          {
            "desc": "24/7 web & social monitoring with monthly reporting.",
            "name": "Monitoring",
            "price": "₹15,000/mo",
            "features": [
              "24/7 brand mention monitoring",
              "Google & social review tracking",
              "Monthly reputation audit report",
              "Alert notifications for new mentions"
            ]
          },
          {
            "desc": "Review generation + Google My Business management.",
            "name": "Proactive ORM",
            "price": "₹40,000/mo",
            "popular": true,
            "features": [
              "Review generation campaigns",
              "Google Business Profile management",
              "Negative review response strategy",
              "Reputation content creation",
              "Directory citation building",
              "Fortnightly ORM reports"
            ]
          },
          {
            "desc": "Aggressive link suppression and PR recovery campaigns.",
            "name": "Crisis & Suppression",
            "price": "Custom",
            "features": [
              "Emergency response strategy",
              "Negative SERP suppression",
              "PR crisis content campaign",
              "High-DA positive asset creation",
              "Social media narrative management",
              "Dedicated ORM crisis manager"
            ]
          }
        ],
        "benefits": [
          {
            "desc": "Proactively collect positive reviews from happy customers.",
            "title": "Review Generation"
          },
          {
            "desc": "Push down harmful links in Google search results.",
            "title": "Negative Suppression"
          },
          {
            "desc": "24/7 tracking of mentions across the web and social media.",
            "title": "Brand Monitoring"
          },
          {
            "desc": "Ensure your brand looks flawless to prospects.",
            "title": "Trust & Credibility"
          },
          {
            "desc": "Rapid response strategies for PR issues.",
            "title": "Crisis Management"
          },
          {
            "desc": "Enhance Google My Business and other directories.",
            "title": "Profile Optimization"
          }
        ],
        "process_steps": [
          {
            "desc": "Deep dive into search results, reviews, and social mentions.",
            "step": "01",
            "title": "Assessment"
          },
          {
            "desc": "Creating powerful, optimized positive assets to push down negatives.",
            "step": "02",
            "title": "Suppression & Defense"
          },
          {
            "desc": "Implementing automated systems to gather genuine 5-star reviews.",
            "step": "03",
            "title": "Review Campaigns"
          },
          {
            "desc": "Continuous monitoring to alert and respond to new mentions instantly.",
            "step": "04",
            "title": "Ongoing Shielding"
          }
        ]
      },
      "/services/ppc": {
        "pricing": [
          {
            "desc": "Up to ₹1L Ad Spend. Google Search Only.",
            "name": "Starter",
            "price": "₹20,000/mo",
            "features": [
              "Google Search campaigns",
              "Up to 3 ad groups",
              "Keyword research & negative list",
              "Monthly performance report"
            ]
          },
          {
            "desc": "₹1L - ₹5L Ad Spend. Search + Display.",
            "name": "Standard",
            "price": "15% of Spend",
            "popular": true,
            "features": [
              "Google Search + Display + YouTube",
              "Conversion tracking setup",
              "A/B ad copy testing",
              "Landing page optimisation",
              "Fortnightly reporting calls",
              "Audience retargeting"
            ]
          },
          {
            "desc": "₹5L+ Ad Spend. Full Google Suite.",
            "name": "Premium",
            "price": "10% of Spend",
            "features": [
              "Full Google Suite (Search, Display, YouTube, Shopping)",
              "Meta & LinkedIn Ads management",
              "Dedicated PPC strategist",
              "Daily bid management",
              "Custom dashboard & reporting",
              "CRO consulting included"
            ]
          }
        ],
        "benefits": [
          {
            "desc": "Appear at the top of search results immediately.",
            "title": "Instant Visibility"
          },
          {
            "desc": "Reach users based on exact intent, location, and behavior.",
            "title": "Hyper-Targeting"
          },
          {
            "desc": "Pay only when someone clicks on your ad.",
            "title": "Cost Control"
          },
          {
            "desc": "Track exactly how much revenue each ad generates.",
            "title": "Measurable ROI"
          },
          {
            "desc": "Easily scale up profitable campaigns.",
            "title": "Scalability"
          },
          {
            "desc": "Continuous optimization of ad copy and landing pages.",
            "title": "A/B Testing"
          }
        ],
        "process_steps": [
          {
            "desc": "Reviewing existing campaigns or building a structured foundation from scratch.",
            "step": "01",
            "title": "Account Audit & Setup"
          },
          {
            "desc": "Identifying the most profitable search terms and demographic segments.",
            "step": "02",
            "title": "Keyword & Audience Research"
          },
          {
            "desc": "Crafting compelling ad copy and designing high-converting landing pages.",
            "step": "03",
            "title": "Ad Creation & Landing Pages"
          },
          {
            "desc": "Daily bid adjustments, negative keywords, and budget reallocation.",
            "step": "04",
            "title": "Optimization & Scaling"
          }
        ]
      },
      "/services/seo": {
        "pricing": [
          {
            "desc": "Perfect for local businesses starting out.",
            "name": "Starter",
            "price": "₹15,000/mo",
            "features": [
              "Up to 20 target keywords",
              "On-page optimisation",
              "Google My Business setup",
              "Monthly ranking report"
            ]
          },
          {
            "desc": "For growing brands needing aggressive growth.",
            "name": "Standard",
            "price": "₹35,000/mo",
            "popular": true,
            "features": [
              "Up to 60 keywords",
              "Technical SEO + Core Web Vitals",
              "6 SEO-optimised blog posts/mo",
              "Link building (DA 30+)",
              "GEO / AI visibility optimisation",
              "Fortnightly strategy calls"
            ]
          },
          {
            "desc": "Enterprise-grade national campaigns.",
            "name": "Premium",
            "price": "₹75,000+/mo",
            "features": [
              "Unlimited keywords",
              "Full technical + international SEO",
              "12+ blog posts & content assets/mo",
              "Premium link building (DA 50+)",
              "GEO + AI Overview optimisation",
              "Dedicated account manager"
            ]
          }
        ],
        "benefits": [
          {
            "desc": "Attract visitors actively searching for your products or services.",
            "title": "Targeted Traffic"
          },
          {
            "desc": "Build an organic growth engine that compounds over time.",
            "title": "Long-term ROI"
          },
          {
            "desc": "Capture customers in your immediate geographic area.",
            "title": "Local Dominance"
          },
          {
            "desc": "Fast, mobile-friendly websites that Google loves.",
            "title": "Technical Excellence"
          },
          {
            "desc": "Every decision backed by comprehensive analytics.",
            "title": "Data-Driven"
          },
          {
            "desc": "Establish your brand as the industry leader.",
            "title": "Brand Authority"
          }
        ],
        "process_steps": [
          {
            "desc": "We analyze your site's current standing, technical health, and competitor landscape.",
            "step": "01",
            "title": "Comprehensive Audit"
          },
          {
            "desc": "Identifying high-value, low-competition keywords to target.",
            "step": "02",
            "title": "Keyword Strategy"
          },
          {
            "desc": "Optimizing structure, content, speed, and mobile usability.",
            "step": "03",
            "title": "On-Page & Technical Fixes"
          },
          {
            "desc": "Creating valuable content and earning authoritative backlinks.",
            "step": "04",
            "title": "Content & Link Building"
          }
        ]
      },
      "/services/meta-ads": {
        "pricing": [
          {
            "desc": "Ideal for new advertisers or small ad budgets up to ₹50k/month.",
            "name": "Starter",
            "price": "₹15,000/mo",
            "features": [
              "Up to ₹50k monthly ad spend",
              "2 active campaigns",
              "Facebook + Instagram placements",
              "Monthly performance report",
              "Pixel setup & verification"
            ]
          },
          {
            "desc": "For scaling brands with ad budgets up to ₹2L/month.",
            "name": "Growth",
            "price": "₹28,000/mo",
            "popular": true,
            "features": [
              "Up to ₹2L monthly ad spend",
              "5 active campaigns",
              "Full creative production",
              "Retargeting & lookalike audiences",
              "Bi-weekly strategy calls",
              "Weekly performance snapshots",
              "A/B creative testing"
            ]
          },
          {
            "desc": "Aggressive scaling for high-budget performance advertisers.",
            "name": "Scale",
            "price": "₹55,000/mo",
            "features": [
              "Unlimited ad spend",
              "Unlimited campaigns",
              "Full creative studio support",
              "Conversion API setup",
              "CRM integration & lead sync",
              "Daily optimisation",
              "Dedicated account manager"
            ]
          }
        ],
        "benefits": [
          {
            "desc": "Reach the exact demographics, interests, and behaviours of your ideal customer across 2B+ Meta users.",
            "title": "Precision Audience Targeting"
          },
          {
            "desc": "Awareness to conversion campaigns that nurture prospects at every stage of the buying journey.",
            "title": "Full-Funnel Strategy"
          },
          {
            "desc": "Scroll-stopping ad creatives and compelling copy crafted to drive clicks, leads, and purchases.",
            "title": "Creative That Converts"
          },
          {
            "desc": "Re-engage warm audiences and website visitors with personalised ads that close more sales.",
            "title": "Retargeting Mastery"
          },
          {
            "desc": "Crystal-clear metrics on every rupee spent, every lead generated, and every sale attributed.",
            "title": "Transparent ROAS Reporting"
          },
          {
            "desc": "Non-stop creative and audience testing to find winning combinations and scale them aggressively.",
            "title": "Continuous A/B Testing"
          }
        ],
        "process_steps": [
          {
            "desc": "Audit your existing accounts, competitors, and target audience to build a winning strategy from day one.",
            "step": "01",
            "title": "Discovery & Audit"
          },
          {
            "desc": "Install Meta Pixel, Conversion API, and custom events to ensure every conversion is tracked accurately.",
            "step": "02",
            "title": "Pixel & Tracking Setup"
          },
          {
            "desc": "Design high-converting ad creatives and write compelling copy tailored to each audience segment.",
            "step": "03",
            "title": "Creative & Copy Production"
          },
          {
            "desc": "Launch structured campaigns and allow the Meta algorithm to gather performance data in its learning phase.",
            "step": "04",
            "title": "Campaign Launch & Learning"
          },
          {
            "desc": "Analyse results daily, eliminate underperformers, and scale winning ad sets to maximise your ROAS.",
            "step": "05",
            "title": "Optimise & Scale"
          }
        ]
      },
      "/services/social-media": {
        "pricing": [
          {
            "desc": "12 posts/month. 2 platforms. Basic community management.",
            "name": "Starter",
            "price": "₹25,000/mo",
            "features": [
              "12 posts/month",
              "2 platforms (Instagram + Facebook)",
              "Custom graphics & captions",
              "Basic community management",
              "Monthly analytics report"
            ]
          },
          {
            "desc": "20 posts + 4 Reels/mo. 3 platforms. Advanced engagement.",
            "name": "Standard",
            "price": "₹45,000/mo",
            "popular": true,
            "features": [
              "20 posts + 4 Reels/month",
              "3 platforms of your choice",
              "Advanced community management",
              "Story content included",
              "Meta Ads management (add spend)",
              "Fortnightly performance reports"
            ]
          },
          {
            "desc": "Daily posting. Omni-channel. Influencer outreach.",
            "name": "Premium",
            "price": "₹80,000/mo",
            "features": [
              "Daily posting across all platforms",
              "Full omni-channel management",
              "Short-form video production",
              "Influencer outreach & coordination",
              "Paid social ads management",
              "Dedicated social media manager"
            ]
          }
        ],
        "benefits": [
          {
            "desc": "Foster deep relationships with your audience.",
            "title": "Community Building"
          },
          {
            "desc": "Establish a consistent, recognizable voice.",
            "title": "Brand Identity"
          },
          {
            "desc": "Communicate directly with prospects and customers.",
            "title": "Direct Engagement"
          },
          {
            "desc": "High-quality graphics and video content.",
            "title": "Visual Storytelling"
          },
          {
            "desc": "Turn casual buyers into brand advocates.",
            "title": "Customer Loyalty"
          },
          {
            "desc": "Showcase testimonials and user-generated content.",
            "title": "Social Proof"
          }
        ],
        "process_steps": [
          {
            "desc": "Analyzing current performance and defining platform-specific strategies.",
            "step": "01",
            "title": "Strategy & Audit"
          },
          {
            "desc": "Designing stunning graphics, writing captions, and producing reels/shorts.",
            "step": "02",
            "title": "Content Creation"
          },
          {
            "desc": "Optimal posting times and active response to comments/messages.",
            "step": "03",
            "title": "Publishing & Community Management"
          },
          {
            "desc": "Monthly deep-dives into engagement rates, reach, and follower growth.",
            "step": "04",
            "title": "Analytics & Reporting"
          }
        ]
      },
      "/services/content-marketing": {
        "pricing": [
          {
            "desc": "4 SEO, GEO blog posts (1000 words each) + basic distribution.",
            "name": "Starter",
            "price": "₹20,000/mo",
            "features": [
              "4 SEO-optimised blog posts/mo",
              "Keyword research included",
              "Basic social media distribution",
              "Monthly performance report"
            ]
          },
          {
            "desc": "8 blog posts, 1 long-form guide/ebook per quarter.",
            "name": "Standard",
            "price": "₹45,000/mo",
            "popular": true,
            "features": [
              "8 blog posts/mo (1,500–2,500 words)",
              "1 long-form guide or e-book per quarter",
              "Email newsletter content (2/mo)",
              "Social media repurposing",
              "GEO / AI-answer optimisation",
              "Content performance analytics"
            ]
          },
          {
            "desc": "Complete thought-leadership engine. PR & outreach.",
            "name": "Premium",
            "price": "₹90,000/mo",
            "features": [
              "12+ blog posts & content assets/mo",
              "Pillar pages + topic cluster strategy",
              "PR outreach & guest posting",
              "Video script writing",
              "Influencer collaboration content",
              "Dedicated content strategist"
            ]
          }
        ],
        "benefits": [
          {
            "desc": "Position your brand as the expert in your industry.",
            "title": "Thought Leadership"
          },
          {
            "desc": "Content designed specifically to rank on Google and AI answer engines.",
            "title": "SEO, GEO Synergy"
          },
          {
            "desc": "Communicate consistently across all touchpoints.",
            "title": "Brand Voice"
          },
          {
            "desc": "E-books and whitepapers that capture emails.",
            "title": "Lead Magnets"
          },
          {
            "desc": "Viral potential across social networks.",
            "title": "Shareability"
          },
          {
            "desc": "Educate prospects so they are ready to buy.",
            "title": "Trust Building"
          }
        ],
        "process_steps": [
          {
            "desc": "Discovering what your audience actually wants to read and know.",
            "step": "01",
            "title": "Topic Research"
          },
          {
            "desc": "Planning topics, formats, and publishing dates months in advance.",
            "step": "02",
            "title": "Content Calendar"
          },
          {
            "desc": "Expert writers crafting compelling copy, reviewed for quality and SEO, GEO.",
            "step": "03",
            "title": "Creation & Editing"
          },
          {
            "desc": "Promoting the content across email, social, and other channels.",
            "step": "04",
            "title": "Distribution"
          }
        ]
      },
      "/services/web-design-development": {
        "pricing": [
          {
            "desc": "High-converting single page for campaigns.",
            "name": "Landing Page",
            "price": "Starts ₹10,000",
            "features": [
              "1-page custom design",
              "Mobile-responsive layout",
              "On-page SEO setup",
              "Contact / lead capture form",
              "2 rounds of revisions",
              "Delivered in 7–10 days"
            ]
          },
          {
            "desc": "Full 5-10 page custom website with CMS.",
            "name": "Corporate Website",
            "price": "Starts ₹25,000",
            "popular": true,
            "features": [
              "5–10 fully custom pages",
              "CMS integration (edit content yourself)",
              "Mobile-first & fast loading",
              "On-page SEO + schema markup",
              "Blog setup included",
              "4 weeks delivery"
            ]
          },
          {
            "desc": "Full store setup, payment gateways, complex catalogs.",
            "name": "E-Commerce",
            "price": "Starts ₹45,000",
            "features": [
              "Unlimited product catalog",
              "Payment gateway integration",
              "Inventory management",
              "Mobile-optimised checkout",
              "Product SEO optimisation",
              "Post-launch support (30 days)"
            ]
          }
        ],
        "benefits": [
          {
            "desc": "Bespoke UI/UX that aligns perfectly with your brand.",
            "title": "Custom Design"
          },
          {
            "desc": "Flawless experience across all devices and screen sizes.",
            "title": "Mobile-First"
          },
          {
            "desc": "Optimized performance to keep users engaged and please Google.",
            "title": "Lightning Fast"
          },
          {
            "desc": "Strategic layouts designed to drive leads and sales.",
            "title": "Conversion Focused"
          },
          {
            "desc": "Scalable, secure, and maintainable development architectures.",
            "title": "Clean Code"
          },
          {
            "desc": "Easy-to-use backends so you can manage your content.",
            "title": "CMS Integration"
          }
        ],
        "process_steps": [
          {
            "desc": "Understanding your goals and mapping out the user journey.",
            "step": "01",
            "title": "Discovery & Wireframing"
          },
          {
            "desc": "Creating high-fidelity mockups of exactly how the site will look.",
            "step": "02",
            "title": "UI/UX Design"
          },
          {
            "desc": "Writing clean, efficient code to bring the designs to life.",
            "step": "03",
            "title": "Development"
          },
          {
            "desc": "Rigorous QA testing across devices before going live.",
            "step": "04",
            "title": "Testing & Launch"
          }
        ]
      }
    },
    "why_choose_us": {
      "stat2": "98%",
      "stat3": "14+",
      "big_stat": "500%",
      "features": [
        {
          "desc": "Leveraging predictive analytics to stay ahead of market trends.",
          "title": "AI-Powered Strategies"
        },
        {
          "desc": "Deep understanding of regional markets and consumer behavior.",
          "title": "Pan-India Reach"
        },
        {
          "desc": "We tie our success directly to your bottom-line growth.",
          "title": "Results-First Approach"
        },
        {
          "desc": "One point of contact for transparent, daily communication.",
          "title": "Dedicated Account Managers"
        }
      ],
      "headline": "Why Top Indian Brands Choose Aetherank",
      "big_label": "Average Client ROI",
      "stat2_label": "Client Retention",
      "stat3_label": "Years Experience",
      "subheadline": "We replace guesswork with data. Our AI-driven approach ensures every rupee you spend is optimized for maximum return."
    },
    "growth_partner": {
      "pillars": [
        {
          "desc": "Every decision is backed by real analytics — no guesswork, no vanity metrics.",
          "title": "Data-First Approach"
        },
        {
          "desc": "We use cutting-edge AI tools to stay 3 steps ahead of your competition.",
          "title": "AI-Powered Execution"
        },
        {
          "desc": "Weekly reports & live dashboards. You always know exactly where your money goes.",
          "title": "Radical Transparency"
        }
      ],
      "headline": "We Don't Just Run Campaigns. We Build Brands.",
      "subheadline": "Aetherank isn't a vendor — we're embedded partners in your growth story. We learn your business inside-out, craft strategies that fit your goals, and obsess over results that actually move the needle."
    },
    "services_section": {
      "cards": [
        {
          "desc": "Dominate search rankings and AI answer engines with data-driven on-page, off-page, and technical SEO, GEO.",
          "link": "/services/seo",
          "title": "SEO, GEO Optimization"
        },
        {
          "desc": "Maximize your ROI with precision-targeted paid campaigns and smart bidding.",
          "link": "/services/ppc",
          "title": "PPC & Google Ads"
        },
        {
          "desc": "Build brand authority and engaged communities across all major platforms.",
          "link": "/services/social-media",
          "title": "Social Media"
        },
        {
          "desc": "Convert visitors into customers with high-performance, conversion-optimized websites.",
          "link": "/services/web-design-development",
          "title": "Web Design & Development"
        },
        {
          "desc": "Engage your audience and build trust with compelling, high-quality content.",
          "link": "/services/content-marketing",
          "title": "Content Marketing"
        },
        {
          "desc": "Protect and enhance your brand image with proactive review and sentiment management.",
          "link": "/services/orm",
          "title": "Reputation Mgmt"
        }
      ],
      "headline": "Full-Funnel Services to Scale Your Brand",
      "subheadline": "We don't just drive traffic; we drive revenue. Our comprehensive digital marketing services are tailored to dominate your specific market."
    },
    "blog_newsletter_cta": {
      "heading": "Stay Ahead of the Curve",
      "subheading": "Get our latest marketing insights delivered to your inbox. No spam — just actionable tips.",
      "button_text": "Subscribe Free",
      "placeholder": "your@email.com"
    }
  }
};

export async function runSeed(): Promise<void> {
  try {
    for (const post of SEED_POSTS) {
      const existing = await db
        .select({ id: blogPostsTable.id })
        .from(blogPostsTable)
        .where(eq(blogPostsTable.slug, post.slug))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(blogPostsTable).values({
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt ?? null,
          category: post.category ?? null,
          tags: post.tags ?? [],
          author: post.author ?? "Aetherank Team",
          date: post.date ?? null,
          image: post.image ?? null,
          status: post.status ?? "published",
          readTime: post.readTime ?? null,
          seo: post.seo ?? {},
        });
        console.log("[seed] Inserted blog post:", post.slug);
      }
    }

    await db
      .insert(settingsTable)
      .values({ key: "main", value: SEED_SETTINGS, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settingsTable.key,
        // Merge strategy: SEED_SETTINGS provides defaults for any missing top-level keys,
        // but existing DB value wins for keys already present (e.g. navigation, content).
        // This preserves all admin-edited data (footer menus, header links, etc.)
        // across server restarts and redeploys.
        set: {
          value: sql`${JSON.stringify(SEED_SETTINGS)}::jsonb || ${settingsTable.value}`,
          updatedAt: new Date(),
        },
      });
    console.log("[seed] Synced CMS settings");

    console.log("[seed] Seed complete");
  } catch (err) {
    console.error("[seed] Seed error:", err);
  }
}
