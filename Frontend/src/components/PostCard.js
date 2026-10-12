import { Link } from "react-router-dom";

function formatDate(date) {
  if (!date) return "Recently published";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostCard({ post }) {
  const imageUrl = post.coverImage?.url;

  return (
    <article className="post-card">
      <Link to={`/posts/${post.slug}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="post-image"
            loading="lazy"
          />
        ) : (
          <div className="post-image image-placeholder">MyBlog</div>
        )}
      </Link>

      <div className="post-card-body">
        <Link to={`/posts/${post.slug}`} className="post-title">
          {post.title}
        </Link>

        <p className="post-excerpt">
          {post.excerpt || "Open this article to read more."}
        </p>

        <div className="post-card-footer">
          <span>▦ &nbsp;{formatDate(post.createdAt)}</span>
          <Link
            to={`/posts/${post.slug}`}
            className="arrow-link"
            aria-label={`Read ${post.title}`}>
            →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;

// =====================================
// import { Link } from "react-router-dom";

// function PostCard({ post }) {
//   return (
//     <article className="post-card">
//       <Link to={`/posts/${post.slug}`}>
//         <img
//           src={post.image || post.coverImage?.url}
//           alt={post.title}
//           className="post-image"
//         />
//       </Link>

//       <div className="post-card-body">
//         <Link to={`/posts/${post.slug}`} className="post-title">
//           {post.title}
//         </Link>

//         <p className="post-excerpt">{post.excerpt}</p>

//         <div className="post-card-footer">
//           <span>▦ &nbsp;{post.date || "Recently published"}</span>
//           <Link
//             to={`/posts/${post.slug}`}
//             className="arrow-link"
//             aria-label={`Read ${post.title}`}>
//             →
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

// export default PostCard;
