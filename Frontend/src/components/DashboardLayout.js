import { Link, NavLink, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function DashboardLayout({ admin = false }) {
  return (
    <>
      <Navbar dashboard admin={admin} />

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          {admin ? (
            <>
              <NavLink to="/admin">▤ &nbsp; All Posts</NavLink>
              <NavLink to="/my-posts">♙ &nbsp; my-posts</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/my-posts">▤ &nbsp; My Posts</NavLink>
              <NavLink to="/create-post">＋ &nbsp; Create Post</NavLink>
            </>
          )}
          <Link to="/login">⇥ &nbsp; Logout</Link>
        </aside>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
