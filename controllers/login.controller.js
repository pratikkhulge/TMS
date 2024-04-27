// const bcrypt = require("bcrypt");
// const jwtService = require("../services/JWT");
// const Admin = require("../models/Admin");
// const User = require("../models/User");

// // Admin login
// module.exports.adminLogin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Find admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(404).send({ message: "No such admin found. Please sign up first." });
//     }

//     // Check if admin is verified
//     if (!admin.active) {
//       return res.status(401).send({ message: "Admin not verified. Please verify your email first." });
//     }

//     // Verify password
//     const passwordMatch = await bcrypt.compare(password, admin.password);
//     if (!passwordMatch) {
//       return res.status(401).send({ message: "Incorrect email or password." });
//     }

//     // Generate JWT token
//     const token = jwtService.signToken({ email: admin.email, role: "admin" });
//     res.status(200).send({ message: "Login successful.", token });
//   } catch (error) {
//     console.error("Admin login error:", error);
//     res.status(500).send({ message: "Internal server error." });
//   }
// };

// // User login
// module.exports.userLogin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ message: "No such user found. Please sign up first." });
//     }

//     // Check if user is verified
//     if (!user.active) {
//       return res.status(401).send({ message: "User not verified. Please verify your email first." });
//     }

//     // Verify password
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).send({ message: "Incorrect email or password." });
//     }
//     // Generate JWT token
//     const token = jwtService.signToken({ email: user.email, role: "user" });
//     res.status(200).send({ message: "Login successful.", token });
//   } catch (error) {
//     console.error("User login error:", error);
//     res.status(500).send({ message: "Internal server error." });
//   }
// };


// // Logout functionality
// module.exports.logout = async (req, res) => {
//   try {
//     localStorage.removeItem("token");

//     res.status(200).send({ message: "Logout successful." });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).send({ message: "Internal server error." });
//   }
// };

const bcrypt = require("bcrypt");
const jwtService = require("../services/JWT");
const Admin = require("../models/Admin");
const User = require("../models/User");

// Admin login
module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send({ message: "No such admin found. Please sign up first." });
    }

    // Check if admin is verified
    if (!admin.active) {
      return res.status(401).send({ message: "Admin not verified. Please verify your email first." });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Incorrect email or password." });
    }

    // Generate JWT token
    const token = jwtService.signToken({ email: admin.email, role: "admin" });
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).send({ message: "Login successful." ,token});
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

// User login
module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "No such user found. Please sign up first." });
    }

    // Check if user is verified
    if (!user.active) {
      return res.status(401).send({ message: "User not verified. Please verify your email first." });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Incorrect email or password." });
    }

    const organisations = user.organisationNames;
    // Generate JWT token
    const token = jwtService.signToken({ email: user.email, role: "user" , organisation: organisations});
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).send({ message: "Login successful." ,token});
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

