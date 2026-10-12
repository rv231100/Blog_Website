import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, Please login first",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    req.user = user;
    next();
    // return res.status(200).json({
    //   success: true,
    //   user: {
    //     id: req.user.id,
    //     name: req.user.name,
    //     email: req.user.email,
    //     role: req.user.role,
    //   },
    // });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login session",
      });
    }
    next(err);
  }
};

export { protect };
