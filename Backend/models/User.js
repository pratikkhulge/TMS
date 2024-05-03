const mongoose = require("mongoose");

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
    unique: true 
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  organisationNames: [{
    type: String 
  }],
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
  },
  ticketCount: {
    type: Number,
    default: 0
  },
  tickets: [{
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    },
    status: {
      type: String,
      enum: ['TOBEPICKED', 'INPROGRESS', 'INTESTING', 'COMPLETED'],
      default: 'TOBEPICKED'
    },
    assignee: {
      type: String,
      default: null
    }
  }]
});

module.exports  = mongoose.model("User", userSchema);


