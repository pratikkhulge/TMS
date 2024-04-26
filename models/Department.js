const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  organisation_name: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  users: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  }]
});

module.exports = mongoose.model("Department", departmentSchema);


