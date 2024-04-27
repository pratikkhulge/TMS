

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const historyLogSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  oldValue: {
    type: String,
    required: true
  },
  newValue: {
    type: String,
    required: true
  }
});

const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Story', 'Task', 'Bug'],
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignee: {
    type: String, // Changed type to String to store email addresses
    required: true
  },
  reporter: {
    type: String, // Changed type to String to store email addresses
    required: true
  },
  status: {
    type: String,
    enum: ['TOBEPICKED', 'INPROGRESS', 'INTESTING', 'COMPLETED'],
    required: true,
    default: 'TOBEPICKED'
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  files: [
    {
      name: { type: String },
      url: { type: String }
    }
  ], // Array of file paths
  history: [historyLogSchema] ,// Array of history logs
  comments: [commentSchema] // Array of comment objects
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
