import blogPosts from "../../../data/blogPosts";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return { title: "Article Not Found | Real Data IQ" };
  return {
    title: `${post.title} | Real Data IQ`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: [post.image] },
  };
}
export default function BlogLayout({ children }) { return children; }
