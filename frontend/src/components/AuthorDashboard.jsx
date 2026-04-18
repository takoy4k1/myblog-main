import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";



function AuthorDashboard() {
  const [articles, setArticles] = useState([]);
  const logout = useAuth((state) => state.logout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getArticles = async () => {
    setLoading(true);
    try {
      // Fetches only THIS author's articles (protected route, identity from cookie/session)
      const res = await axios.get("http://localhost:4000/author-api/articles", {
        withCredentials: true,
      });
      setArticles(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  const handleArticleClick = (article) => {
    navigate(`/article/${article._id}`, { state: { article } });
  };

  const gridStyle = {
    display: "grid",
    gap: "24px",
  };
  
  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    cursor: "pointer",
  };

  return (
    <>
      <style>{`
        .author-grid { grid-template-columns: 1fr; }
        @media (min-width: 480px) {
          .author-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 768px) {
          .author-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .author-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .author-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
          transform: translateY(-3px);
        }
      `}</style>

      <div style={{ padding: "32px 24px", minHeight: "100vh", background: "#f9fafb" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827" }}>
            My Articles
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "6px" }}>
            {articles.length > 0
              ? `${articles.length} article${articles.length !== 1 ? "s" : ""}`
              : ""}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ textAlign: "center", color: "#9ca3af" }}>Loading your articles...</p>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#ef4444", marginBottom: "12px" }}>{error}</p>
            <button
              onClick={getArticles}
              style={{
                padding: "8px 20px",
                background: "#f59e0b",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && articles.length === 0 && (
          <p style={{ textAlign: "center", color: "#9ca3af" }}>
            You haven't published any articles yet.
          </p>
        )}
        <button
      onClick={()=>navigate("/addarticle")}
      className="bg-stone-700 hover:bg-stone-800 cursor-pointer text-white px-4 py-2 rounded"
    >
      + Add Article
    </button>
      <div className="text-end">
        
        <p className="text-2xl"> Welcome,</p>
        
      </div>
      <div className="flex justify-end mb-6 mt-3">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onLogout}>
          Logout
        </button>
      </div>

        {/* Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="author-grid" style={gridStyle}>
            {articles.map((article) => (
              <div
                key={article._id}
                className="author-card"
                style={cardStyle}
                onClick={() => handleArticleClick(article)} 
              >
                {/* Category badge (if available) */}
                {article.category && (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#059669",
                      background: "#d1fae5",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      alignSelf: "flex-start",
                    }}
                  >
                    {article.category}
                  </span>
                )}

                {/* Title */}
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#111827",
                    lineHeight: "1.4",
                  }}
                >
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    lineHeight: "1.6",
                    flex: 1,
                  }}
                >
                  {article.content?.slice(0, 100)}...
                </p>
                <span
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/delete/${article._id}`, { state: article });
  }}
  style={{
    fontSize: "11px",
    color: "#ef4444",
    fontWeight: "500",
    cursor: "pointer",
  }}
>
  Delete
</span>
                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                    By {article.author?.firstName || "You"}
                  </span>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editarticle/${article._id}`, { state: article });
                      }}
                      style={{ fontSize: "11px", color: "#2563eb", fontWeight: "500", cursor: "pointer" }}
                    >
                      Edit ✏️
                    </span>
                    <span style={{ fontSize: "11px", color: "#d97706", fontWeight: "500" }}>
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AuthorDashboard;