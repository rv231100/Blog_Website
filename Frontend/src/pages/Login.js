import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login({ email, password });

      const requestedPath = location.state?.from;
      const destination =
        requestedPath || (user.role === "admin" ? "/admin" : "/my-posts");

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="brand">
          <span>My</span>Blog
        </Link>
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </header>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Welcome back! Please login to your account.</p>

        {error && (
          <div className="form-message error-message" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          className="form-control"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="form-control"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          className="button button-primary auth-submit"
          type="submit"
          disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <div className="auth-divider">OR</div>
        <button
          className="button button-outline auth-submit"
          type="button"
          disabled
          title="Google sign-in is not configured">
          Continue with Google
        </button>
      </form>
    </div>
  );
}

export default Login;

// ================================================
// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError("");
//     setSubmitting(true);

//     try {
//       const user = await login({ email, password });

//       const requestedPath = location.state?.from;
//       const destination =
//         requestedPath ||
//         (user.role === "admin" ? "/admin" : "/my-posts");

//       navigate(destination, { replace: true });
//     } catch (err) {
//       setError(err.message || "Unable to log in.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="auth-page">
//       <header className="auth-header">
//         <Link to="/" className="brand"><span>My</span>Blog</Link>
//         <span>
//           Don't have an account? <Link to="/register">Register</Link>
//         </span>
//       </header>

//       <form className="auth-card" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         <p>Welcome back! Please login to your account.</p>

//         {error && (
//           <div className="form-message error-message" role="alert">
//             {error}
//           </div>
//         )}

//         <label htmlFor="email">Email Address</label>
//         <input
//           id="email"
//           className="form-control"
//           type="email"
//           value={email}
//           onChange={(event) => setEmail(event.target.value)}
//           autoComplete="email"
//           required
//         />

//         <label htmlFor="password">Password</label>
//         <input
//           id="password"
//           className="form-control"
//           type="password"
//           value={password}
//           onChange={(event) => setPassword(event.target.value)}
//           autoComplete="current-password"
//           required
//         />

//         <button
//           className="button button-primary auth-submit"
//           type="submit"
//           disabled={submitting}
//         >
//           {submitting ? "Logging in..." : "Login"}
//         </button>

//         <div className="auth-divider">OR</div>
//         <button
//           className="button button-outline auth-submit"
//           type="button"
//           disabled
//           title="Google sign-in is not configured"
//         >
//           Continue with Google
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Login;
