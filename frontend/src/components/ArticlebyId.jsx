import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const centered = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "24px", textAlign: "center" };
const backBtnStyle = { marginBottom: "20px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "500", color: "#4b5563", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: "6px", transition: "all 0.2s" };

function ArticleById() {
  const { state } = useLocation();
  const { articleId } = useParams();
  const navigate = useNavigate();

  // Use article passed via navigation state; fallback-fetch if opened via direct URL
  const [article, setArticle] = useState(state?.article || null);
  const [loading, setLoading] = useState(!state?.article);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If article was already passed through navigate state, skip fetch
    if (state?.article) return;

    const fetchArticle = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user-api/articles/${articleId}`,
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, state?.article]);

  /**
   * Formats a UTC date string to IST (Asia/Kolkata, UTC+5:30).
   * e.g. "15 July 2025, 08:30 PM IST"
   */
  const toIST = (dateStr) => {
    if (!dateStr) return "—";
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateStr));
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={centered}>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading article...</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !article) {
    return (
      <div style={centered}>
        <p style={{ color: "#ef4444", marginBottom: "12px" }}>
          {error || "Article not found."}
        </p>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>
          ← Go Back
        </button>
      </div>
    );
  }

  /* ── Article ── */
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "32px 24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={backBtnStyle}>
          ← Back
        </button>

        {/* Category badge */}
        {article.category && (
          <span
            style={{
              display: "inline-block",
              marginTop: "20px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#d97706",
              background: "#fef3c7",
              padding: "3px 10px",
              borderRadius: "999px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {article.category}
          </span>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: "700",
            color: "#111827",
            lineHeight: "1.3",
            marginTop: "12px",
            marginBottom: "20px",
          }}
        >
          {article.title}
        </h1>

        {/* Meta: author + timestamps */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            padding: "14px 18px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            marginBottom: "32px",
          }}
        >
          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#111827",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              {(article.author || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
                Written by
              </p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                {article.author?.firstName || "You"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{ width: "1px", height: "36px", background: "#e5e7eb", flexShrink: 0 }}
          />

          {/* Published timestamp */}
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>Published</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: "500" }}>
              {toIST(article.createdAt)} IST
            </p>
          </div>

          {/* Updated timestamp — only show if different from createdAt */}
          {article.updatedAt && article.updatedAt !== article.createdAt && (
            <>
              <div
                style={{
                  width: "1px",
                  height: "36px",
                  background: "#e5e7eb",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>Updated</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  {toIST(article.updatedAt)} IST
                </p>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "28px 32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {article.content?.split("\n").map((para, i) =>
            para.trim() ? (
              <p
                key={i}
                style={{
                  fontSize: "15px",
                  lineHeight: "1.85",
                  color: "#374151",
                  marginBottom: "16px",
                }}
              >
                {para}
              </p>
            ) : (
              <br key={i} />
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default ArticleById;

