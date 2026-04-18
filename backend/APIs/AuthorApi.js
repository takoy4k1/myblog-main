import exp from 'express'
import { authenticate } from '../services/authService.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkAuthor } from '../middlewares/checkAuthor.js'; 
import { ArticleModel } from '../models/Articlemodel.js';
import { UserTypeModel } from '../models/UserTypeModel.js';
import { register } from '../services/authService.js';
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryupload.js";
export const authorRoute = exp.Router()

//Register author(public)
authorRoute.post(
    '/users',
    upload.single("profilePic"),
    async (req ,res, next )=> {
    let cloudinaryResult;
    try {
        let userObj=req.body;
        
        if (req.file) {
            cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        }

        const newUserObj=await register({
            ...userObj,
            role:"AUTHOR",
            profileImageUrl: cloudinaryResult?.secure_url,
        });
        res.status(201).json({message:"author created ",payload:newUserObj})
    } catch (err) {
        next(err);
    }
});
//authenticate (public)
/*authorRoute.post("/login",async(req,res)=>{
   
})*/
//create article(protected)
authorRoute.post('/articles',async(req,res)=>{
    //get article from rewq
    let article=req.body;
    //check author
    let author=await UserTypeModel.findById(article.author)
    if(!author){
        return res.status(401).json({"message":"invalid author"})
    }
    //create article doc
    const ArticleDoc=new ArticleModel(article)
    //save
    let newArticle=await ArticleDoc.save();
    //send res
    res.json({"message":"articles",payload:newArticle})
})
//read articles of author (he can read only his articles)(protected)

authorRoute.get("/articles", verifyToken("AUTHOR"), async (req, res) => {
    //read article
    let newAuthorId = req.user.userId;
    //check the author
    let author = await UserTypeModel.findById(newAuthorId);
    if (!author || author.role != "AUTHOR") {
        return res.status(401).json({ message: "invalid author" });
    }
    //read articles
    let newArticles = await ArticleModel.find({ author: newAuthorId });
    //send res 
    res.status(200).json({ message: "articles read by the author", payload: newArticles });
});
//editarticle(protected)
//edit article(protected route)
authorRoute.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
  //get modified article from req
  let { articleId, title, category, content } = req.body;
  //find article
  let articleOfDB = await ArticleModel.findOne({_id: articleId, author: req.user.userId});
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found or you are not authorized" });
  }
  
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});

//delete article(protected)
authorRoute.delete("/articles/:id", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid article ID format" });
  }

  const article = await ArticleModel.findOne({ _id: id, author: req.user.userId });
  if (!article) {
    return res.status(404).json({ message: "Article not found or you are not authorized" });
  }

  // If already deleted, just return success (idempotent operation)
  if (!article.isArticleActive) {
    return res.status(200).json({ message: "Article is already deleted" });
  }

  article.isArticleActive = false;
  await article.save();

  res.status(200).json({ message: "Article deleted successfully" });
});

//soft delete article(protected)
//delete(soft delete) article(Protected route)
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await ArticleModel.findById(id); //.populate("author");
  //console.log(article)
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  //console.log(req.user.userId,article.author.toString())
  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    article,
  });
});