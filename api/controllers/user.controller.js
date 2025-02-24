import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "Hello api is working",
  });
};

export const updateUser = async (req, res, next) => {
  console.log("🔍 Checking user permissions...");
  console.log("User ID from Token:", req.user.id);
  console.log("User ID from Request Params:", req.params.id);

  if (req.user.id !== req.params.id) {
    console.log("🚨 Unauthorized: User ID does not match!");
    return next(errorHandler(401, "You can only update your own Account !"));
  }
  try {
    if(req.body.password) {
      req.body.password= bcryptjs.hashSync(req.body.password,10);
    }

    const updatedUser= await User.findByIdAndUpdate(req.params.id,{
      $set:{
        username:req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      }
    },{new: true})

    console.log("✅ User Updated Successfully:", updatedUser._id);
    

    const {password, ...rest} = updatedUser._doc;

    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
};
