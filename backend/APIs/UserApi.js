import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../models/Articlemodel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary

  
 } from "../config/cloudinaryupload.js";
export const userRoute = exp.Router();

//Register user
userRoute.post(
        "/users",
        (req, res, next) => { console.log("Incoming request to /users"); next(); },
        upload.single("profilePic"),
        async (req, res, next) => {
        console.log("Reached /users route");
        let cloudinaryResult;

            try {
                let userObj = req.body;
                console.log("Body:", userObj, "File:", req.file ? "present" : "missing");

                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                console.log("Starting cloudinary upload...");
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                console.log("Cloudinary upload successful");
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
        );

// Get all active articles
userRoute.get("/articles", verifyToken(), async (req, res, next) => {
    try {
        const articles = await ArticleModel.find({ isArticleActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Articles fetched successfully", payload: articles });
    } catch (err) {
        next(err);
    }
});

// Get a single active article by ID
userRoute.get("/articles/:id", verifyToken(), async (req, res, next) => {
    try {
        const article = await ArticleModel.findOne({ _id: req.params.id, isArticleActive: true });
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.status(200).json({ message: "Article fetched successfully", payload: article });
    } catch (err) {
        next(err);
    }
});