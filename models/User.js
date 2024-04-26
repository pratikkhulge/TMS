const mongoose = require("mongoose");

// Schema for Department
// const departmentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true 
//   },
//   users: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User' 
//   }]
// });


// Schema for User
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure email addresses are unique
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  organisationJoiningDate: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: null
  },
  otp: {
    code: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: null
    }
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }
});

module.exports  = mongoose.model("User", userSchema);

