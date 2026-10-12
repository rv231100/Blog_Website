import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import apiRequest from "../api/api";

function formatDate(date) {
  if (!date) return "Recently published";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PostDetails() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPost() {
      setLoading(true);
      setError("");
      setPost(null);

      try {
        const data = await apiRequest(`/posts/${encodeURIComponent(slug)}`);

        if (active) {
          setPost(data.post);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load this article.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <>
      <Navbar />

      <main className="article-page">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        {loading && (
          <div className="article-state">
            <p>Loading article...</p>
          </div>
        )}

        {!loading && error && (
          <div className="article-state" role="alert">
            <h2>Article unavailable</h2>
            <p>{error}</p>
            <Link to="/" className="button button-primary">
              Browse Articles
            </Link>
          </div>
        )}

        {!loading && !error && post && (
          <article className="article-content">
            <header className="article-header">
              <h1>{post.title}</h1>

              <div className="article-meta">
                <span>▦ {formatDate(post.createdAt)}</span>
                <span>♙ By {post.author?.name || "Unknown author"}</span>
              </div>
            </header>

            {post.coverImage?.url && (
              <img
                className="article-cover"
                src={post.coverImage.url}
                alt={post.title}
                fetchPriority="high"
              />
            )}

            <div className="article-body">{post.content}</div>
          </article>
        )}
      </main>
    </>
  );
}

export default PostDetails;

//============================
// import { Link, useParams } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { samplePosts } from "../data/posts";

// function PostDetails() {
//   const { slug } = useParams();
//   const post = samplePosts.find((item) => item.slug === slug);

//   if (!post) {
//     return (
//       <>
//         <Navbar />
//         <main className="posts-section">
//           <h2>Article not found</h2>
//           <Link to="/" className="button button-primary">
//             Back to Home
//           </Link>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <main className="article-page">
//         <Link to="/" className="back-link">
//           ← Back to Home
//         </Link>

//         <h1>{post.title}</h1>

//         <div className="article-meta">
//           <span>▦ &nbsp;{post.date}</span>
//           <span>♙ &nbsp;By {post.author}</span>
//         </div>

//         <img src={post.image} alt={post.title} className="article-cover" />

//         <div className="article-content">
//           {post.content.split("\n\n").map((paragraph, index) => (
//             <p key={index}>{paragraph}</p>
//           ))}
//         </div>
//       </main>
//     </>
//   );
// }

// export default PostDetails;
