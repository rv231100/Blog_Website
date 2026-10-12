import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPosts from "./pages/MyPosts";
import CreatePost from "./pages/CreatePost";
import AdminDashboard from "./pages/AdminDashboard";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:slug" element={<PostDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<DashboardLayout admin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

// =============================
// import { Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import PostDetails from "./pages/PostDetails";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import MyPosts from "./pages/MyPosts";
// import CreatePost from "./pages/CreatePost";
// import AdminDashboard from "./pages/AdminDashboard";
// import DashboardLayout from "./components/DashboardLayout";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/posts/:slug" element={<PostDetails />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route element={<DashboardLayout />}>
//         <Route path="/my-posts" element={<MyPosts />} />
//         <Route path="/create-post" element={<CreatePost />} />
//       </Route>

//       <Route element={<DashboardLayout admin />}>
//         <Route path="/admin" element={<AdminDashboard />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;
