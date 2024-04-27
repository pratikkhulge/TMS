const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authorizeUser } = require('../services/AuthUser');
const { authorizeAdmin } = require('../services/AuthAdmin');

const createTicket = async (req, res) => {
  try {
    // Authorize user
    const { authorized, organisation:organisationName, email: reporterEmail } = await authorizeUser(req, res);
    if (!authorized) {
      return res.status(403).json({ message: 'Unauthorized: Only authenticated users can create tickets' });
    }

    const { type, summary, description, assigneeEmail, dueDate, files } = req.body;

    // Check if assigneeEmail belongs to the same organization as reporterEmail
    const assigneeUser = await User.findOne({ email: assigneeEmail, organisationName });
    if (!assigneeUser) {
      return res.status(400).json({ message: 'Assignee not found in your organization' });
    }

    // Generate the key using organisation_name and incremental number
    const ticketCount = await Ticket.countDocuments({ organisationName });
    const key = `${organisationName}-${ticketCount + 1}`;

    // Create the ticket
    const ticket = await Ticket.create({
      type,
      key,
      summary,
      description,
      assignee: assigneeEmail, // Assuming assigneeEmail is provided in the request body
      reporter: reporterEmail,
      dueDate,
      files,
      organisationName
    });

    // Update reporter's ticket count and status
    await User.findOneAndUpdate(
      { email: reporterEmail },
      {
        $inc: { ticketCount: 1 }, // Increment ticket count
        $set: { ticketStatus: 'TOBEPICKED' } // Set ticket status to TOBEPICKED
      }
    );

    // Assign ticket ID, status, and assignee in user schema
    await User.findOneAndUpdate(
      { email: assigneeEmail },
      {
        $push: { 
          tickets: { 
            ticketId: ticket._id,
            status: 'TOBEPICKED',
            assignee: assigneeEmail
          }
        } // Add ticket object to tickets array
      }
    );

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create ticket', error: error.message });
  }
};

// Endpoint to show all tickets
const showAllTickets = async (req, res) => {
  try {
    // Authorize admin
    const { authorized } = await authorizeAdmin(req, res);
    if (!authorized) {
      return res.status(403).json({ message: 'Unauthorized: Only admin users can view all tickets' });
    }

    const tickets = await Ticket.find();
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
};

const showTicketsInOrganization = async (req, res) => {
    try {
      // Authorize user
      const { authorized, organisationName ,email} = await authorizeUser(req, res);
      if (!authorized) {
        return res.status(403).json({ message: 'Unauthorized: Only authenticated users can view tickets' });
      }
  
      const tickets = await Ticket.find({ organisationName, assignee:email });
      res.status(200).json({ tickets });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
  };
  
  // const updateTicket = async (req, res) => {
  //   try {
  //     // Authorize user
  //     const { authorized, organisationName, email } = await authorizeUser(req, res);
  //     if (!authorized) {
  //       return res.status(403).json({ message: 'Unauthorized: Only authenticated users can edit tickets' });
  //     }
  
  //     const { key } = req.params;
  //     const { type, summary, description, assigneeEmail, dueDate, files } = req.body;
  
  //     // Check if the ticket exists and belongs to the same organization
  //     const ticket = await Ticket.findOne({ key, organisationName });
  //     if (!ticket) {
  //       return res.status(404).json({ message: 'Ticket not found or does not belong to your organization' });
  //     }
  
  //     // Check if the user is authorized to edit the ticket
  //     if (ticket.reporter !== email && ticket.assignee !== email) {
  //       return res.status(403).json({ message: 'Unauthorized: You are not allowed to edit this ticket' });
  //     }
  
  //     // Check if the provided assignee email exists in the organization
  //     const assigneeUser = await User.findOne({ email: assigneeEmail, organisationName });
  //     if (!assigneeUser) {
  //       return res.status(400).json({ message: 'Assignee not found in your organization' });
  //     }
  
  //     // Update ticket fields except for 'Key', 'Created date', and 'Updated date'
  //     ticket.type = type;
  //     ticket.summary = summary;
  //     ticket.description = description;
  //     ticket.assignee = assigneeEmail;
  //     ticket.dueDate = dueDate;
  //     ticket.files = files;
  //     ticket.updatedDate = new Date(); // Update the 'Updated date'
  
  //     // Save the updated ticket
  //     await ticket.save();
  
  //     res.status(200).json({ message: 'Ticket updated successfully', ticket });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Failed to update ticket', error: error.message });
  //   }
  // };
  const updateTicket = async (req, res) => {
    try {
      // Authorize user
      const { authorized, organisationName, email } = await authorizeUser(req, res);
      if (!authorized) {
        return res.status(403).json({ message: 'Unauthorized: Only authenticated users can edit tickets' });
      }
  
      const { key } = req.params;
      const { type, summary, description, assigneeEmail, dueDate, status, files } = req.body;
  
      // Check if the ticket exists and belongs to the same organization
      const ticket = await Ticket.findOne({ key, organisationName });
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found or does not belong to your organization' });
      }
  
      // Check if the user is authorized to edit the ticket
      if (ticket.reporter !== email && ticket.assignee !== email) {
        return res.status(403).json({ message: 'Unauthorized: You are not allowed to edit this ticket' });
      }
  
      // Check if the provided assignee email exists in the organization
      const assigneeUser = await User.findOne({ email: assigneeEmail, organisationName });
      if (!assigneeUser) {
        return res.status(400).json({ message: 'Assignee not found in your organization' });
      }
  
      // Create a history log for each updated field
      const historyLogs = [];
      if (ticket.type !== type) {
        historyLogs.push({ userName: email, fieldName: 'Type', oldValue: ticket.type, newValue: type });
        ticket.type = type;
      }
      if (ticket.summary !== summary) {
        historyLogs.push({ userName: email, fieldName: 'Summary', oldValue: ticket.summary, newValue: summary });
        ticket.summary = summary;
      }
      if (ticket.description !== description) {
        historyLogs.push({ userName: email, fieldName: 'Description', oldValue: ticket.description, newValue: description });
        ticket.description = description;
      }
      if (ticket.assignee !== assigneeEmail) {
        historyLogs.push({ userName: email, fieldName: 'Assignee', oldValue: ticket.assignee, newValue: assigneeEmail });
        ticket.assignee = assigneeEmail;
      }
      if (ticket.dueDate !== dueDate) {
        historyLogs.push({ userName: email, fieldName: 'Due Date', oldValue: ticket.dueDate, newValue: dueDate });
        ticket.dueDate = dueDate;
      }
      if (ticket.status !== status) {
        historyLogs.push({ userName: email, fieldName: 'Status', oldValue: ticket.status, newValue: status });
        ticket.status = status;
      }
  
      // Save the updated ticket
      await ticket.save();
  
      res.status(200).json({ message: 'Ticket updated successfully', ticket, history: historyLogs });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update ticket', error: error.message });
    }
  };
  
  

module.exports = { createTicket ,showAllTickets, showTicketsInOrganization ,updateTicket};

// module.exports = { createTicket };
