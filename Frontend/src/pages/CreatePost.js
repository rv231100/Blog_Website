import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiRequest from "../api/api";

function CreatePost() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "draft",
  });

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load an existing post when the URL contains ?edit=POST_ID
  useEffect(() => {
    if (!editId) return;

    let cancelled = false;

    async function loadPost() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          `/posts/my-posts/${encodeURIComponent(editId)}`,
        );

        if (cancelled) return;

        setForm({
          title: data.post.title || "",
          content: data.post.content || "",
          status: data.post.status || "draft",
        });

        setExistingImage(data.post.coverImage?.url || "");
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [editId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    setImage(file || null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Please enter both a title and article content.");
      return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
      setError("The cover image must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("content", form.content.trim());
    formData.append("status", form.status);

    if (image) {
      formData.append("coverImage", image);
    }

    setSaving(true);

    try {
      const path = editId ? `/posts/${encodeURIComponent(editId)}` : "/posts";

      const data = await apiRequest(path, {
        method: editId ? "PATCH" : "POST",
        body: formData,
      });

      setSuccess(data.message || "Post saved successfully.");

      // Go back after a successful save.
      navigate("/my-posts", {
        state: { message: data.message || "Post saved successfully." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="editor-page">
        <p>Loading post...</p>
      </main>
    );
  }

  return (
    <main className="editor-page">
      <Link to="/my-posts" className="back-link">
        ← Back to My Posts
      </Link>

      <section className="editor-card">
        <h1>{editId ? "Edit Post" : "Create Post"}</h1>
        <p className="editor-description">
          Write your article and choose whether to save it as a draft or publish
          it for readers.
        </p>

        {error && (
          <div className="form-message error-message" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="form-message success-message" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Post Title</label>
          <input
            id="title"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter a clear article title"
            maxLength={120}
            required
          />

          <label htmlFor="content">Article Content</label>
          <textarea
            id="content"
            name="content"
            className="form-control editor-textarea"
            value={form.content}
            onChange={handleChange}
            placeholder="Start writing your article..."
            maxLength={50000}
            required
          />

          <label htmlFor="coverImage">Cover Image</label>
          <input
            id="coverImage"
            className="form-control file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
          />

          <p className="field-hint">
            JPEG, PNG or WebP. Maximum file size: 5 MB.
          </p>

          {image && (
            <div className="image-preview">
              <p>New image preview</p>
              <img
                src={URL.createObjectURL(image)}
                alt="Selected cover preview"
              />
            </div>
          )}

          {!image && existingImage && (
            <div className="image-preview">
              <p>Current cover image</p>
              <img src={existingImage} alt="Current post cover" />
            </div>
          )}

          <label htmlFor="status">Post Status</label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}>
            <option value="draft">Save as Draft</option>
            <option value="published">Publish Post</option>
          </select>

          <div className="editor-actions">
            <Link to="/my-posts" className="button button-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="button button-primary"
              disabled={saving}>
              {saving ? "Saving..." : editId ? "Save Changes" : "Create Post"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreatePost;
