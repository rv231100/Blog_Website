import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ dashboard = false, admin = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span>My</span>Blog
      </Link>

      {!dashboard && (
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <a href="/#about">About</a>
        </nav>
      )}

      {dashboard ? (
        <div className="user-menu">
          <span className="avatar">●</span>
          <span>{user?.name || (admin ? "Admin" : "User")}</span>
          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="nav-actions">
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin" : "/my-posts"}
              className="button button-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="button button-outline">
                Login
              </Link>
              <Link to="/register" className="button button-primary">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;

// =============================================
// import { Link, NavLink } from "react-router-dom";

// function Navbar({ dashboard = false, admin = false }) {
//   return (
//     <header className="navbar">
//       <Link to="/" className="brand">
//         <span>My</span>Blog
//       </Link>

//       {!dashboard && (
//         <nav className="nav-links">
//           <NavLink to="/" end>
//             Home
//           </NavLink>
//           <a href="#about">About</a>
//         </nav>
//       )}

//       {dashboard ? (
//         <div className="user-menu">
//           <span className="avatar">●</span>
//           {admin ? "Admin" : "John Doe"}
//           <span>⌄</span>
//         </div>
//       ) : (
//         <div className="nav-actions">
//           <Link to="/login" className="button button-outline">
//             Login
//           </Link>
//           <Link to="/register" className="button button-primary">
//             Register
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Navbar;
