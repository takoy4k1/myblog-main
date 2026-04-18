import { useNavigate, useLocation, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  formCard,
  formTitle,
  submitBtn,
  articlePageWrapper,
} from "../Commonstyles";

function DeleteArticle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { articleId } = useParams();

  const article = location.state;

  const handleDelete = async () => {
    try {
      let res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/author-api/articles/${article._id}`,
        { withCredentials: true }
      );

      toast.success("Article deleted successfully");

      navigate("/author-profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Delete Article</h2>

      <p className="text-gray-600 mb-6 text-center">
        Are you sure you want to delete <b>{article?.title}</b>?
      </p>

      <div className="flex justify-center gap-4">
        <button
          className={`${submitBtn} bg-red-500 hover:bg-red-600`}
          onClick={handleDelete}
        >
          Delete
        </button>

        <button
          className={`${submitBtn} bg-gray-400 hover:bg-gray-500`}
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteArticle;