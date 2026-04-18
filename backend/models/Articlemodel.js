import { Schema ,model } from "mongoose";

//user comment schema 
const UserCommentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    comments:{
        type : String
    }
})

const ArticleSchema = new Schema ({
    author:{
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : [true,"author id is needed"]
    } ,
    title :{
        type:String ,
        required :[true , "title is required"]
    },
    category:{
        type:String ,
        required :[true , "category is required"]
    },
    content :{
        type:String ,
        required :[true , "content is required"]
    },
    comments: [UserCommentSchema],
    isArticleActive :{
        type : Boolean,
        default : true
    }
},
{
    timestamps: true,
    strict : "throw",
    versionKey : false
})

export const ArticleModel = model('Article',ArticleSchema);