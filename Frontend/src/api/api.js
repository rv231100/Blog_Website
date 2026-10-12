const API_BASE_URL = "/api";
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");

    error.status = response.status;
    throw error;
  }

  return data;
}

export default apiRequest;

// ===============================

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// async function apiRequest(path, options = {}) {
//   const response = await fetch(`${API_BASE_URL}${path}`, {
//     ...options,
//     credentials: "include",
//     headers: {
//       ...options.headers,
//     },
//   });

//   const data = await response.json().catch(() => ({}));

//   if (!response.ok) {
//     const error = new Error(data.message || "Something went wrong");

//     error.status = response.status;
//     throw error;
//   }

//   return data;
// }

// export default apiRequest;
