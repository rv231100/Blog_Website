import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import apiRequest from "../api/api";

function Home() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        const data = await apiRequest("/posts");
        if (active) setPosts(data.posts || []);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return posts.filter((post) => post.title.toLowerCase().includes(term));
  }, [posts, search]);

  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          <h1>Welcome to MyBlog</h1>
          <p>
            Read simple and useful articles on technology, lifestyle and more.
          </p>

          <form
            className="search-form"
            onSubmit={(event) => event.preventDefault()}>
            <input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search articles"
            />
            <button
              className="button button-primary search-button"
              type="submit"
              aria-label="Search">
              ⌕
            </button>
          </form>
        </section>

        <section className="posts-section">
          <h2>Latest Posts</h2>

          {loading && <p>Loading articles...</p>}

          {!loading && error && (
            <div className="form-message error-message" role="alert">
              {error}
              <button
                className="button button-outline"
                onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredPosts.length > 0 && (
            <div className="posts-grid">
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {!loading && !error && filteredPosts.length === 0 && (
            <p className="empty-state">
              {search
                ? "No articles match your search."
                : "No published articles yet. Check back soon!"}
            </p>
          )}
        </section>
      </main>
    </>
  );
}

export default Home;

// ======================================
// import { useMemo, useState } from "react";
// import Navbar from "../components/Navbar";
// import PostCard from "../components/PostCard";
// import { samplePosts } from "../data/posts";

// function Home() {
//   const [search, setSearch] = useState("");

//   const filteredPosts = useMemo(() => {
//     const term = search.trim().toLowerCase();

//     return samplePosts.filter((post) =>
//       post.title.toLowerCase().includes(term),
//     );
//   }, [search]);

//   return (
//     <>
//       <Navbar />

//       <main>
//         <section className="hero">
//           <h1>Welcome to MyBlog</h1>
//           <p>
//             Read simple and useful articles on technology, lifestyle and more.
//           </p>

//           <form
//             className="search-form"
//             onSubmit={(event) => event.preventDefault()}>
//             <input
//               type="search"
//               placeholder="Search articles..."
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               aria-label="Search articles"
//             />
//             <button
//               className="button button-primary search-button"
//               type="submit"
//               aria-label="Search">
//               ⌕
//             </button>
//           </form>
//         </section>

//         <section className="posts-section" id="latest-posts">
//           <h2>Latest Posts</h2>

//           {filteredPosts.length ? (
//             <div className="posts-grid">
//               {filteredPosts.map((post) => (
//                 <PostCard key={post._id} post={post} />
//               ))}
//             </div>
//           ) : (
//             <p className="empty-state">
//               No articles found. Try another search.
//             </p>
//           )}
//         </section>
//       </main>
//     </>
//   );
// }

// export default Home;
