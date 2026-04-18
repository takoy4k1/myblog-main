import "./App.css";

import RootLayout from "./components/RootLayout";
import Register from "./components/Register";
import AddArticle from "./components/AddArticle";
import Login from "./components/Login";
import Home from "./components/Home";
import AuthorDashboard from "./components/AuthorDashboard";
import UserDashboard from "./components/UserDashboard";
import ArticleById from "./components/ArticlebyId"; 
import EditArticle from "./components/EditArticle";
import DeleteArticle from "./components/DeleteArticle";

import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


function App() {

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/user-profile",
          element: <UserDashboard />
        },
        {
          path: "/author-profile",
          element: <AuthorDashboard />
        },
        {
          path: "/author-profile/articles",
          element: <AuthorDashboard />
        },
        {
          path: "/addarticle",
          element: <AddArticle />
        },
        {
          path:"/delete/:articleId",
          element: <DeleteArticle />
        },
        {
          path: "/article/:articleId", 
          element: <ArticleById />
        },
        {
          path: "/editarticle/:id",
          element: <EditArticle />
        },
      ]
    }
  ]);

  return (
    <div>
      <Toaster position="top-right" />
      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;