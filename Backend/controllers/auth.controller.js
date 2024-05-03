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
    return res.send({message:"Admin already exists"});
  }
  const newAdmin = await createAdmin(email, password);
  if (!newAdmin) {
    return res.status(400).send({ success: false, message: "Unable to create new admin" });
}
res.send({ success: true, message: "Admin registered", data: newAdmin });

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
    return ({success:false, message:"Unable to sign up admin"});
  }
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return ({success: true, message:"Admin registered" , data: newAdmin});
  } catch (error) {
    return ({success:false, message:"Unable to sign up admin, Please try again later", error:error});
  }
};

module.exports.signUpUser = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, organisation_name } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.organisationNames.includes(organisation_name)) {
        return res.status(404).send({ message: "User already exists in the organization." });
      } else {
        const existingDepartment = await Department.findOne({ organisation_name });

        if (!existingDepartment) {
          return res.status(404).send({ message: "No such department exists." });
        }
        existingUser.organisationNames.push(organisation_name);
        await existingUser.save();

        // Update the department's users array with the new user
        existingDepartment.users.push({ userId: existingUser._id, name: `${firstName} ${lastName}`, email: email, active: false });
        await existingDepartment.save();

        return res.status(200).send({  message: "User added to another organization." });
      }
    }


    // If user doesn't exist, proceed with user creation
    let department = await Department.findOne({ organisation_name });

    if (!department) {
      return res.status(404).send({ message: "No such department exists." });
    }

    // Create the user and associate it with the department
    const newUser = await createUser(email, password, firstName, lastName, dateOfBirth, department._id, organisation_name);

    if (!newUser) {
      return res.status(400).send({ message: "Unable to create new user." });
    }

    // res.send(newUser);
    // res.send({ success: true, message: `Welcome ${firstName} ${lastName}! User Registered Successfully` });
    res.send(newUser);
  } catch (error) {
    console.error("User signup error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};
// Function to create a new user
const createUser = async (email, password, firstName, lastName, dateOfBirth, departmentId, organisation_name) => {
  const hashedPassword = await encrypt(password);
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dateOfBirth,
    department: departmentId,
    organisationNames: [organisation_name], 
    otp: {
      code: otpGenerated,
      createdAt: new Date(),
    },
  });

  if (!newUser) {
    return {success:false, message:"Unable to sign up user"};
  }

  try {
    // Check if the department exists
    const existingDepartment = await Department.findOne({ organisation_name });

    if (existingDepartment) {
      // If the department exists, update it with the new user information
      await Department.findOneAndUpdate(
        { organisation_name: organisation_name },
        { $push: { users: { userId: newUser._id, name: `${firstName} ${lastName}`, email: email, active: false } } }
      );

      // !console.log(`User added to department: ${organisation_name}`);
    } else {
      // If the department doesn't exist, handle the error accordingly
      console.error(`Department ${organisation_name} not found`);
      return {success:false, message:`Department ${organisation_name} not found`};
    }

    // Send success response
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    // return {success:true, newUser};
    return ({ success: true, message: `Welcome ${firstName} ${lastName}! User Registered Successfully` });
  } catch (error) {
    console.error("User signup error:", error);
    return {success:false, message:"Unable to sign up user, Please try again later", error};
  }
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
// Function to find user by email
const findUserByEmail = async (email) => {
  const admin = await User.findOne({ email });
  return admin;
};



// Function to validate admin signup with OTP
const validateAdminSignUp = async (email, otp) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return {success:false, message:"Admin not found"};
  }
  const { code, createdAt } = admin.otp;
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(createdAt);
  if (code !== otp || timeDifference > 60000) { // Check if OTP is expired (1 minute)
    return {success:false, message:"Invalid or expired OTP"};
  }
  // If OTP is valid, update admin's record
  const updatedAdmin = await Admin.findByIdAndUpdate(admin._id, {
    $set: { active: true },
    $unset: { otp: 1 }, // Remove OTP from admin's record
  });
  return {success:true, message: "Email verified successfully" , updatedAdmin};
};

// Function to validate user signup with OTP
const validateUserSignUp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    return {success:false, message:"User not found"};
  }
  const { code, createdAt } = user.otp;
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(createdAt);
  if (code !== otp || timeDifference > 60000) {
    return {success:false, message:"Invalid or expired OTP"};
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

  return { success: true, message: "Email verified successfully" };
};



module.exports.generateNewAdminOTP = async (req, res) => {
  const { email } = req.body;
  const admin = await findAdminByEmail(email);
  if (!admin) {
    return res.status(404).send({success:false , message:"Admin not found"});
  }

  if (admin.active) {
    return res.send({ success:true , message: "User is already verified" });
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
    res.send({success:true , message:"New OTP generated and sent to admin's email."});
  } catch (error) {
    res.status(500).send({success:false, message:"Failed to send OTP. Please try again later."});
  }
};

module.exports.generateNewUserOTP = async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).send({success:false , message:"User not found"});
  }

  if (user.active) {
    return res.send({ message: "User is already verified" });
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
    res.send({success:true , message:"New OTP generated and sent to user's email."});
  } catch (error) {
    return { success: false, message: 'Failed to resend OTP. Please try again later.' };
  }
};

module.exports.loginUserOTP = async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).send({success:false , message:"User not found"});
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
    res.send({success:true , message:"New OTP generated and sent to user's email."});
  } catch (error) {
    return { success: false, message: 'Failed to resend OTP. Please try again later.' };
  }
};

