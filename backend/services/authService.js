import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserTypeModel } from "../models/UserTypeModel.js";
import dotenv from "dotenv";
dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
//register function
export const register=async (userObj)=>{
    //create doc
    const userDoc =new UserTypeModel(userObj);
    //validate for empmty passwords
    await userDoc.validate();
    //hash and replace plain password
    userDoc.password= await bcrypt.hash(userDoc.password,10);
    //save
    const created=await userDoc.save();
    //convert doc to obj to remove password
    const newUserObj=created.toObject();
    //remove password 
    delete newUserObj.password;
    //return user obj without password;
    return newUserObj;
};

//authenticate function
export const authenticate = async ({ email, password}) => {
    //check user with email & role
  const user = await UserTypeModel.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }
 

  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }
 //if user valid ,but blocked by admin
  if(user.isActive===false){
    const err=new Error("user blocked.contact admin");
    err.status=403;
    throw err;
  }
  //generate token
  const token = jwt.sign({ userId: user._id, 
    role: user.role, email: user.email }, 
    process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};