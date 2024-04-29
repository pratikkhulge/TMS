const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authorizeUser } = require('../services/AuthUser');
const { authorizeAdmin } = require('../services/AuthAdmin');

const createTicket = async (req, res) => {
  try {
    // Authorize user
    const { authorized, organisation, email: reporterEmail } = await authorizeUser(req, res);
    if (!authorized) {
      return res.status(403).json({ success:false ,  message: 'Unauthorized: Only authenticated users can create tickets' });
    }

    const { type, summary, description, assignee, dueDate, files } = req.body;

    // Check if assignee belongs to the same organization as reporterEmail
    const assigneeUser = await User.findOne({ email: assignee, organisationNames:organisation });
    if (!assigneeUser) {
      return res.status(400).json({ success:false , message: 'Assignee not found in your organization' });
    }

    // Fetch the latest ticket key for the organization
    const latestTicket = await Ticket.findOne({ key: { $regex: `^${organisation}-` } }).sort({ _id: -1 });

    // Generate the new ticket key using the fetched key and increment
    let ticketCount = 1;
    if (latestTicket) {
      const [latestCount] = latestTicket.key.split('-')[1];
      ticketCount = parseInt(latestCount) + 1;
    }
    const key = `${organisation}-${ticketCount}`;

    // Create the ticket
    const ticket = await Ticket.create({
      type,
      key,
      summary,
      description,
      assignee: assignee, 
      reporter: reporterEmail,
      dueDate,
      files,
      organisation
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
      { email: assignee },
      {
        $push: {
          tickets: {
            ticketId: ticket._id,
            status: 'TOBEPICKED',
            assignee: assignee
          }
        }
      }
    );

    res.status(201).json({  success:true ,message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ success:false , error: 'Failed to create ticket', message: error.message });
  }
};

const showAllTickets = async (req, res) => {
  try {
    // Authorize admin
    const { authorized } = await authorizeAdmin(req, res);
    if (!authorized) {
      return res.status(403).json({ success:false ,message: 'Unauthorized: Only admin users can view all tickets' });
    }

    const tickets = await Ticket.find();
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({success:false, message: 'Failed to fetch tickets', error: error.message });
  }
};


const showTicketsInOrganization = async (req, res) => {
  try {
    // Authorize user
    const { authorized, organisation, email } = await authorizeUser(req, res);
    if (!authorized) {
      return res.status(403).json({ success:false , message: 'Unauthorized: Only authenticated users can view tickets' });
    }

    const tickets = await Ticket.find({ organisation, assignee: email });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { authorized, organisation, email } = await authorizeUser(req, res);
    if (!authorized) {
      return res.status(403).json({ success:false , message: 'Unauthorized: Only authenticated users can edit tickets' });
    }

    const { key } = req.params;
    const { type, summary, description, assignee, dueDate, status, files } = req.body;

    // Check if the ticket exists and belongs to the same organization
    const ticket = await Ticket.findOne({ key, organisation });
    // !console.log(key , organisation);
    if (!ticket) {
      return res.status(404).json({ success:false , message: 'Ticket not found or does not belong to your organization' });
    }

    // Check if the user is authorized to edit the ticket
    if (ticket.reporter !== email && ticket.assignee !== email) {
      return res.status(403).json({ success:false , message: 'Unauthorized: You are not allowed to edit this ticket' });
    }

    // Check if the provided assignee email exists in the organization
    const assigneeUser = await User.findOne({ email: assignee, organisation });
    if (!assigneeUser) {
      return res.status(400).json({ success:false , message: 'Assignee not found in your organization' });
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
    if (ticket.assignee !== assignee) {
      historyLogs.push({ userName: email, fieldName: 'Assignee', oldValue: ticket.assignee, newValue: assignee });
      ticket.assignee = assignee;
    }
    if (ticket.dueDate !== dueDate) {
      historyLogs.push({ userName: email, fieldName: 'Due Date', oldValue: ticket.dueDate, newValue: dueDate });
      ticket.dueDate = dueDate;
    }
    if (ticket.status !== status) {
      historyLogs.push({ userName: email, fieldName: 'Status', oldValue: ticket.status, newValue: status });
      ticket.status = status;
    }

    ticket.updatedDate = new Date();
if (historyLogs.length > 0) {
  ticket.history.push(...historyLogs);
  await ticket.save();
}


    // Save the updated ticket
    // await ticket.save();

    res.status(200).json({ success:true , message: 'Ticket updated successfully', ticket, history: historyLogs });
  } catch (error) {
    res.status(500).json({success:false ,  message: 'Failed to update ticket', error: error.message });
  }
};


module.exports = { createTicket, showAllTickets, showTicketsInOrganization, updateTicket };

// module.exports = { createTicket };
