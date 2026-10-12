import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const user = await register({ name, email, password });

      navigate(user.role === "admin" ? "/admin" : "/my-posts", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
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
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </header>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <p>Join our community and start writing today.</p>

        {error && (
          <div className="form-message error-message" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          className="form-control"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          maxLength={50}
          autoComplete="name"
          required
        />

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
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          required
        />

        <button
          className="button button-primary auth-submit"
          type="submit"
          disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
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

export default Register;

// ==========================================
// import { Link } from "react-router-dom";

// function Register() {
//   return (
//     <div className="auth-page">
//       <header className="auth-header">
//         <Link to="/" className="brand">
//           <span>My</span>Blog
//         </Link>
//         <span>
//           Already have an account? <Link to="/login">Login</Link>
//         </span>
//       </header>

//       <form className="auth-card" onSubmit={(e) => e.preventDefault()}>
//         <h2>Register</h2>
//         <p>Join our community and start writing today.</p>

//         <label htmlFor="name">Full Name</label>
//         <input
//           id="name"
//           className="form-control"
//           type="text"
//           placeholder="Your name"
//           minLength={2}
//           maxLength={50}
//           required
//         />

//         <label htmlFor="email">Email Address</label>
//         <input
//           id="email"
//           className="form-control"
//           type="email"
//           placeholder="you@example.com"
//           required
//         />

//         <label htmlFor="password">Password</label>
//         <input
//           id="password"
//           className="form-control"
//           type="password"
//           placeholder="Create a password"
//           minLength={8}
//           required
//         />

//         <button className="button button-primary auth-submit" type="submit">
//           Register
//         </button>

//         <div className="auth-divider">OR</div>
//         <button
//           className="button button-outline auth-submit"
//           type="button"
//           disabled
//           title="Google sign-in is not configured">
//           Continue with Google
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Register;
