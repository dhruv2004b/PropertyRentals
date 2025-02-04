import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created Successfully" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "User not Found"));
    }
    const validPassword =bcryptjs.compareSync(
      password,
      validUser.password
    );
    if (!validPassword) {
      next(errorHandler(401, "Invalid Credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    const {password:pass, ...rest}= validUser._doc;
    res
      .cookie('access_cookie', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};
