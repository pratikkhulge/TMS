const { encrypt, compare } = require("../services/crypto");
const { generateOTP } = require("../services/OTP");
const { sendMail } = require("../services/MAIL");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Department = require("../models/Department");

module.exports.signUpAdmin = async (req, res) => {
  const { email, password } = req.body;
  const isExisting = await findAdminByEmail(email);

  if (isExisting) {
    return res.send("Admin already exists");
  }
  // Create a new admin
  const newAdmin = await createAdmin(email, password);
  if (!newAdmin[0]) {
    return res.status(400).send({
      message: "Unable to create new admin",
    });
  }
  res.send(newAdmin);
};

module.exports.signUpUser = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, organisation_name } = req.body;
  
  // Find the department by name or create a new one if it doesn't exist
  let department = await Department.findOne({ organisation_name: organisation_name });

  if (!department) {
    return res.status(404).send({
      message: "No such department exists",
    });
  }

  // Create the user and associate it with the department
  const newUser = await createUser(email, password, firstName, lastName, dateOfBirth, department._id, organisation_name);

  if (!newUser[0]) {
    return res.status(400).send({
      message: "Unable to create new user"
    });
  }
  
  // Send success response
  res.send(newUser);
};

module.exports.verifyAdminEmail = async (req, res) => {
  const { email, otp } = req.body;
  const admin = await validateAdminSignUp(email, otp);
  res.send(admin);
};

module.exports.verifyUserEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp);
  res.send(user);
};

// Function to find admin by email
const findAdminByEmail = async (email) => {
  const admin = await Admin.findOne({ email });
  return admin;
};

// Function to create a new admin
const createAdmin = async (email, password) => {
  const hashedPassword = await encrypt(password);
  const otpGenerated = generateOTP();
  const newAdmin = await Admin.create({
    email,
    password: hashedPassword,
    otp: {
      code: otpGenerated,
      createdAt: new Date(),
    },
  });
  if (!newAdmin) {
    return [false, "Unable to sign up admin"];
  }
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newAdmin];
  } catch (error) {
    return [false, "Unable to sign up admin, Please try again later", error];
  }
};

// Function to validate admin signup with OTP
const validateAdminSignUp = async (email, otp) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return [false, "Admin not found"];
  }
  const { code, createdAt } = admin.otp;
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(createdAt);
  if (code !== otp || timeDifference > 60000) { // Check if OTP is expired (1 minute)
    return [false, "Invalid or expired OTP"];
  }
  // If OTP is valid, update admin's record
  const updatedAdmin = await Admin.findByIdAndUpdate(admin._id, {
    $set: { active: true },
    $unset: { otp: 1 }, // Remove OTP from admin's record
  });
  return [true, updatedAdmin];
};

// Function to create a new user
const createUser = async (email, password, firstName, lastName, dateOfBirth, departmentId , organisation_name) => {
  const hashedPassword = await encrypt(password);
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dateOfBirth,
    department: departmentId,
    otp: {
      code: otpGenerated,
      createdAt: new Date(),
    },
  });
  if (!newUser) {
    return [false, "Unable to sign up user"];
  }

  await Department.findOneAndUpdate(
    { organisation_name: organisation_name },
    { $push: { users: { userId: newUser._id, name: `${firstName} ${lastName}`, active: false } } }
  );
  
  console.log(`User added to department: ${organisation_name}`);
  

  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newUser];
  } catch (error) {
    return [false, "Unable to sign up user, Please try again later", error];
  }
};

// Function to validate user signup with OTP
const validateUserSignUp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    return [false, "User not found"];
  }
  const { code, createdAt } = user.otp;
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(createdAt);
  if (code !== otp || timeDifference > 60000) { // Check if OTP is expired (1 minute)
    return [false, "Invalid or expired OTP"];
  }
  // If OTP is valid, update user's record
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    $set: { active: true },
    $unset: { otp: 1 }, // Remove OTP from user's record
  });

  await Department.updateOne(
    { _id: user.department },
    { $set: { "users.$[elem].active": true } },
    { arrayFilters: [{ "elem.userId": user._id }] }
  );

  return [true, updatedUser];
};

module.exports.generateNewAdminOTP = async (req, res) => {
  const { email } = req.body;
  const admin = await findAdminByEmail(email);
  if (!admin) {
    return res.status(404).send("Admin not found");
  }

  if (admin.active) {
    return res.send({message:"User is already verified"});
  }
  const newOTP = generateOTP();
  await Admin.findByIdAndUpdate(admin._id, {
    $set: { "otp.code": newOTP, "otp.createdAt": new Date() },
  });
  try {
    await sendMail({
      to: email,
      OTP: newOTP,
    });
    res.send("New OTP generated and sent to admin's email.");
  } catch (error) {
    res.status(500).send("Failed to send OTP. Please try again later.");
  }
};

const findUserByEmail = async (email) => {
  const admin = await User.findOne({ email });
  return admin;
};

module.exports.generateNewUserOTP = async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).send("User not found");
  }

  if (user.active) {
    return res.send("User is already verified");
  }

  const newOTP = generateOTP();
  await User.findByIdAndUpdate(user._id, {
    $set: { "otp.code": newOTP, "otp.createdAt": new Date() },
  });
  try {
    await sendMail({
      to: email,
      OTP: newOTP,
    });
    res.send("New OTP generated and sent to user's email.");
  } catch (error) {
    res.status(500).send("Failed to send OTP. Please try again later.");
  }
};