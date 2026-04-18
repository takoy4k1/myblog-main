import exp from 'express'
import { UserTypeModel } from '../models/UserTypeModel.js';

export const adminRoute = exp.Router()

////authenticate
//read all articles
adminRoute.get('/articles/:authorId',async(req,res)=>{
    const articles=await ArticleModel.find();
        res.status(201).json({ message:"articles",payload:articles});
})
//Block users
adminRoute.put('/block/:userId',async(req,res)=>{
    let uid=req.params.userId;
    let { email,password,role,isActive }=req.body;
    let blockedUser= await UserTypeModel.findByIdAndUpdate(
        uid,
        {
            $set:{ isActive:false }
        },
        {new:true},
    );
    res.json({message:"user are blocked",payload:blockedUser})
})
// unblock Any user
adminRoute.put('/unblock/:userId',async(req,res)=>{
    let uid=req.params.userId;
    let { email,password,role,isActive }=req.body;
    let unblockedUser= await UserTypeModel.findByIdAndUpdate(
        uid,
        {
            $set:{ isActive:true }
        },
        {new:true},
    );
    res.json({message:"user are unblocked",payload:unblockedUser})
})