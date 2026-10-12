import { Link } from "react-router-dom";
import { samplePosts } from "../data/posts";
import { useEffect, useState } from "react";
import apiRequest from "../api/api";

function AdminDashboard() {
  //   const [stats, setStats] = useState({
  //     totalPosts: 0,
  //     publishedPosts: 0,
  //     draftPosts: 0,
  //   });

  //   const [recentPosts, setRecentPosts] = useState([]);
  //   const [statsLoading, setStatsLoading] = useState(true);
  //   const [statsError, setStatsError] = useState("");

  //   useEffect(() => {
  //     fetchStats();
  //   }, []);

  //   const fetchStats = async () => {
  //     try {
  //       setStatsLoading(true);
  //       setStatsError("");

  //       const data = await apiRequest("/posts/admin/stats");

  //       setStats(data.stats);
  //       setRecentPosts(data.recentPosts);
  //     } catch (error) {
  //       setStatsError(error.message || "Failed to load dashboard statistics.");
  //     } finally {
  //       setStatsLoading(false);
  //     }
  //   };

  return (
    <>
      <div className="dashboard-heading">
        <h2>All Blog Posts</h2>
        <Link to="/create-post" className="button button-primary">
          + Create Post
        </Link>
      </div>

      <div className="table-wrap">
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {samplePosts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>
                  <span className={`status status-${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <Link
                      to={`/create-post?edit=${post._id}`}
                      className="button button-primary">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() =>
                        alert("Delete API will be connected next.")
                      }>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ====================================== */}
        {/* <section className="admin-stat-grid">
          <div className="admin-stat-card">
            <h3>Total Posts</h3>
            <p>{statsLoading ? "..." : stats.totalPosts}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Published Posts</h3>
            <p>{statsLoading ? "..." : stats.publishedPosts}</p>
          </div>

          <div className="admin-stat-card">
            <h3>Draft Posts</h3>
            <p>{statsLoading ? "..." : stats.draftPosts}</p>
          </div>
        </section>

        {statsError && (
          <p className="error-message" role="alert">
            {statsError}
            <button type="button" onClick={fetchStats}>
              Retry
            </button>
          </p>
        )}
        {/* ========================= *

        <section className="admin-table-card recent-posts-section">
          <div className="admin-section-heading">
            <h2>Recent Posts</h2>
            <p>Latest five posts across all authors</p>
          </div>

          {statsLoading ? (
            <p>Loading recent posts...</p>
          ) : recentPosts.length === 0 ? (
            <p>No posts have been created yet.</p>
          ) : (
            <div className="recent-posts-list">
              {recentPosts.map((post) => (
                <div className="recent-post-item" key={post._id}>
                  <div className="recent-post-info">
                    <h3>{post.title}</h3>
                    <p>By {post.author?.name || "Unknown author"}</p>
                    <small>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <span className={`status status-${post.status}`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section> */}
      </div>
    </>
  );
}

export default AdminDashboard;
