import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import apiRequest from "../api/api";

function formatDate(date) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MyPosts() {
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [deleteError, setDeleteError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/posts/my-posts?page=${page}&limit=10`);

      setPosts(data.posts || []);
      setPagination(
        data.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        },
      );
    } catch (err) {
      setError(err.message || "Unable to load your posts.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handleDelete(postId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(postId);
      setDeleteError("");

      await apiRequest(`/posts/${encodeURIComponent(postId)}`, {
        method: "DELETE",
      });

      // Refresh the current list after a successful deletion.
      await loadPosts();
    } catch (error) {
      setDeleteError(error.message || "Unable to delete this post.");
    } finally {
      setDeletingId(null);
    }
  }

  //   async function handleDelete(post) {
  //     const confirmed = window.confirm(
  //       `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
  //     );

  //     if (!confirmed) return;

  //     setDeletingId(post._id);
  //     setError("");
  //     setMessage("");

  //     try {
  //       const data = await apiRequest(`/posts/${post._id}`, {
  //         method: "DELETE",
  //       });

  //       setMessage(data.message || "Post deleted successfully.");

  //       // If this was the last post on the page, go to the previous page.
  //       if (posts.length === 1 && page > 1) {
  //         setPage((current) => current - 1);
  //       } else {
  //         await loadPosts();
  //       }
  //     } catch (err) {
  //       setError(err.message || "Unable to delete the post.");
  //     } finally {
  //       setDeletingId(null);
  //     }
  //   }

  return (
    <>
      {deleteError && (
        <p className="form-error" role="alert">
          {deleteError}
        </p>
      )}
      <div className="dashboard-heading">
        <div>
          <h2>My Posts</h2>
          <p className="dashboard-subtitle">
            {pagination.total} post(s) in total
          </p>
        </div>

        <Link to="/create-post" className="button button-primary">
          + Create Post
        </Link>
      </div>

      {message && (
        <div className="form-message success-message" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="form-message error-message" role="alert">
          {error}
          <button className="button button-outline" onClick={loadPosts}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading your posts...</p>
      ) : !error && posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Create your first blog post to get started.</p>
          <Link to="/create-post" className="button button-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <>
          <div className="dashboard-list">
            {posts.map((post) => (
              <div className="dashboard-post" key={post._id}>
                <div className="dashboard-post-info">
                  <strong>{post.title}</strong>
                  <p>{formatDate(post.createdAt)}</p>

                  <span className={`status status-${post.status}`}>
                    {post.status}
                  </span>
                </div>

                <div className="row-actions">
                  <Link
                    to={`/create-post?edit=${post._id}`}
                    className="button button-primary">
                    Edit
                  </Link>

                  {/* <button
                    type="button"
                    className="button button-danger"
                    disabled={deletingId === post._id}
                    onClick={() => handleDelete(post)}>
                    {deletingId === post._id ? "Deleting..." : "Delete"}
                  </button> */}
                  <button
                    type="button"
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}>
                    {deletingId === post._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              className="button button-outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>

            <span>
              Page {pagination.page} of {Math.max(1, pagination.totalPages)}
            </span>

            <button
              className="button button-outline"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default MyPosts;

// ==============================
// import { Link } from "react-router-dom";
// import { samplePosts } from "../data/posts";

// function MyPosts() {
//   return (
//     <>
//       <div className="dashboard-heading">
//         <h2>My Posts</h2>
//         <Link to="/create-post" className="button button-primary">
//           + Create Post
//         </Link>
//       </div>

//       <div className="dashboard-list">
//         {samplePosts.map((post) => (
//           <div className="dashboard-post" key={post._id}>
//             <div>
//               <strong>{post.title}</strong>
//               <p>{post.date}</p>
//               <span className={`status status-${post.status}`}>
//                 {post.status}
//               </span>
//             </div>

//             <div className="row-actions">
//               <Link
//                 to={`/create-post?edit=${post._id}`}
//                 className="button button-primary">
//                 Edit
//               </Link>
//               <button
//                 type="button"
//                 className="button button-danger"
//                 onClick={() => alert("Delete API will be connected next.")}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default MyPosts;
