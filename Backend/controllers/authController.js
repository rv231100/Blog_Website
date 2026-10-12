// import { validationResult } from "express-validator";
import { userModel } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    next(err);
    // res.status(500).json({
    //     success: false,
    //     message: "Error fetching user data",
    // });
  }
};

const cookieOptions = () => ({
  httpOnly: true,
  secure: false,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

//create jwt cookie and store it in cookie
const sendToken = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, cookieOptions());
};

//register user
const register = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     success: false,
    //     errors: errors.array(),
    //   });
    // }

    const { name, email, password } = req.body;

    console.log(name, email, password);

    const existingUser = await userModel.findOne({ email });

    console.log("Existing user:", existingUser); // Debugging line
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    sendToken(res, user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    // next(err);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
};

//login user
const login = async (req, res, next) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     success: false,
    //     errors: errors.array(),
    //   });
    // }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    sendToken(res, user);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // next(err);
    return res.status(500).json({
      success: false,
      message: "Error logging in user",
    });
  }
};
//logout user
const logout = (req, res) => {
  res.clearCookie("token", cookieOptions());
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export { getMe, logout, register, login };
