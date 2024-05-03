import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Router from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import TicketDetailsModal from './TicketDetailsModal';
import { FiFilter } from 'react-icons/fi';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    summary: '',
    description: '',
    assignee: '',
    dueDate: '',
    files: []
  });
  const [filterOptions, setFilterOptions] = useState({
    type: '',
    status: '',
    dueDate: ''
  });
  const [showFilterModal, setShowFilterModal] = useState(false);


  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      Router.push('/');
    } else {
      fetchTickets(token);
    }
  }, []);



  const fetchTickets = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/user/tickets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      } else {
        throw new Error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Handle error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        Router.push('/');
        return;
      }

      let filesArray = [];
      if (Array.isArray(formData.files)) {
        // If formData.files is already an array, use it directly
        filesArray = formData.files.map(file => ({ name: file.name, url: file.url }));
      } else {
        // If formData.files is not an array, create an array with the single file
        filesArray.push({ name: formData.files.name, url: formData.files.url });
      }

      const response = await fetch('http://localhost:5000/user/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: formData.type,
          summary: formData.summary,
          description: formData.description,
          assignee: formData.assignee,
          dueDate: formData.dueDate,
          files: filesArray
        })
      });


      if (response.ok) {
        const responseData = await response.json();
        // Ticket created successfully
        // You can handle success here, e.g., show a success message, close the modal, or fetch updated tickets list
        toast.success(responseData.message || 'Ticket created successfully');
        console.log('Ticket created successfully');
        setShowCreateTicketModal(false);
        // Optionally, you can fetch updated tickets list
        fetchTickets(token);
      } else {
        // Handle error response
        const errorData = await response.json();
        toast.error(errorData.message);
        console.error('Error creating ticket:', errorData.message);
        // You can handle error here, e.g., show an error message
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      // Handle fetch error
    }
  };

  const handleSaveTicketChanges = async (updatedTicket) => {
    try {
      const token = Cookies.get('token');
      console.log('Updated Ticket:', updatedTicket);
      const response = await fetch(`http://localhost:5000/user/tickets/update/${updatedTicket.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTicket),
      });

      if (response.ok) {
        toast.success('Ticket details updated successfully');
        fetchTickets(token);
        // Close the modal after updating ticket details
        setShowTicketDetailsModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        console.error('Error updating ticket details:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating ticket details:', error);
    }
  };


  const logout = () => {
    Cookies.remove('token');
    Router.push('/');
  };

  const toggleTicketDetailsModal = (ticket) => {
    // console.log('Selected Ticket:', ticket);
    setSelectedTicket(ticket);
    setShowTicketDetailsModal(!showTicketDetailsModal);
  };

  const toggleCreateTicketModal = () => {
    setShowCreateTicketModal(!showCreateTicketModal);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: e.target.files });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const handleCloseTicketDetailsModal = () => {
    setShowTicketDetailsModal(false);
  };

  const handleFilterChange = (e) => {
    setFilterOptions({ ...filterOptions, [e.target.name]: e.target.value });
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const filteredTickets = tickets.filter(ticket => {
    return (
      (!filterOptions.type || ticket.type === filterOptions.type) &&
      (!filterOptions.status || ticket.status === filterOptions.status) &&
      (!filterOptions.dueDate || formatDate(ticket.dueDate) === filterOptions.dueDate)
    );
  });

  return (
    <>
      <div className='w-full h-screen flex flex-col bg-gray-100'>
        <div className="bg-indigo-700 text-white text-center p-4">
          <p className='text-4xl font-extrabold'>Welcome to Home Page</p>
          <button onClick={logout} className='bg-white border-2 border-white hover:bg-transparent transition-all text-indigo-700 hover:text-white font-semibold text-lg px-4 py-2 rounded duration-700 absolute top-4 right-4'>Logout</button>
        </div>
        <FiFilter className="absolute top-20 right-5 text-4xl text-white cursor-pointer bg-indigo-600 font-semibold px-1 py-1 rounded-full" onClick={toggleFilterModal} />
        <div className="grid grid-cols-4 gap-4 p-11">
          {filteredTickets.map(ticket => (
            <div key={ticket._id} className="bg-white shadow-md p-6 rounded-md cursor-pointer relative" onClick={() => toggleTicketDetailsModal(ticket)}>
              <div className="bg-gray-200 px-4 py-2 rounded-md text-center mb-4">
                <p className="text-lg font-semibold">{ticket.key}</p>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Type: {ticket.type}</p>
                <p >Summary: {ticket.summary.slice(0, 20)}</p>
                <p>Description: {ticket.description.slice(0, 20)}</p>
                <p>Due Date: {formatDate(ticket.dueDate)}</p>
              </div>
              <p>
                Status:
                <span className={`${ticket.status === 'TOBEPICKED' ? 'text-blue-500' : ticket.status === 'INPROGRESS' ? 'text-yellow-500' : ticket.status === 'INTESTING' ? 'text-green-500' : 'text-red-500'}`}>{ticket.status}</span>
              </p>
            </div>
          ))}
        </div>
        {showTicketDetailsModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <TicketDetailsModal ticket={selectedTicket} onSave={handleSaveTicketChanges} onClose={handleCloseTicketDetailsModal} />
          </div>
        )}
      </div>
      {showCreateTicketModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Create Ticket</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" id="type" value={formData.type} onChange={handleInputChange} className="border-gray-300 rounded-md w-full" required>
                  <option value="">Select Type</option>
                  <option value="Story">Story</option>
                  <option value="Task">Task</option>
                  <option value="Bug">Bug</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                <input type="text" name="summary" id="summary" value={formData.summary} onChange={handleInputChange} className="border-gray-300 rounded-md w-full" required />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} className="border-gray-300 rounded-md w-full" required />
              </div>
              <div className="mb-4">
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assignee Email</label>
                <input type="email" name="assignee" id="assignee" value={formData.assignee} onChange={handleInputChange} className="border-gray-300 rounded-md w-full" required />
              </div>
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleInputChange} className="border-gray-300 rounded-md w-full" required />
              </div>
              <div className="mb-4">
                <label htmlFor="files" className="block text-sm font-medium text-gray-700">Files</label>
                <input type="file" name="files" id="files" onChange={handleFileChange} multiple className="border-gray-300 rounded-md w-full" />
              </div>
              <button type="submit" className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md">Submit</button>
            </form>
            <button onClick={toggleCreateTicketModal} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Close</button>
          </div>
        </div>
      )}
      <button onClick={toggleCreateTicketModal} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full fixed bottom-8 right-8">Create Ticket</button>
      {showFilterModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Filter Tickets</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" id="type" value={filterOptions.type} onChange={handleFilterChange} className="border-gray-300 rounded-md w-full">
                  <option value="">All Types</option>
                  <option value="Story">Story</option>
                  <option value="Task">Task</option>
                  <option value="Bug">Bug</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" id="status" value={filterOptions.status} onChange={handleFilterChange} className="border-gray-300 rounded-md w-full">
                  <option value="">All Status</option>
                  <option value="TOBEPICKED">To Be Picked</option>
                  <option value="INPROGRESS">In Progress</option>
                  <option value="INTESTING">In Testing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" name="dueDate" id="dueDate" value={filterOptions.dueDate} onChange={handleFilterChange} className="border-gray-300 rounded-md w-full" />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={toggleFilterModal} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mr-2">Apply</button>
                <button type="button" onClick={toggleFilterModal} className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
      
    </>
  );
}

