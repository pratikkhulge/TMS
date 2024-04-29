import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Router from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import DepartmentDetailsModal from './DepartmentDetailModal';
import TicketDetailsModal from './TicketDetailsModal';

import { FiFilter, FiTrash2 } from 'react-icons/fi';

export default function Home() {
    const [departments, setDepartments] = useState([]);
    const [showDepartmentDetailsModal, setShowDepartmentDetailsModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        users: []
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
            fetchDepartments(token);
            fetchTickets(token);
        }
    }, []);

    const fetchTickets = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/admin/tickets/all', {
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

    const toggleTicketDetailsModal = (ticket) => {
        // console.log('Selected Ticket:', ticket);
        setSelectedTicket(ticket);
        setShowTicketDetailsModal(!showTicketDetailsModal);
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


    const toggleCreateDepartmentModal = () => {
        setShowCreateDepartmentModal(!showCreateDepartmentModal);
    };

    const fetchDepartments = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/admin/department', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDepartments(data.departments);
            } else {
                throw new Error('Failed to fetch departments');
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            // Handle error
        }
    };

    const handleSaveDepartment = async (editedDepartment) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                Router.push('/');
                return;
            }

            // Extract the necessary properties for the PUT request
            const { organisation_name, name } = editedDepartment;

            const response = await fetch(`http://localhost:5000/admin/department/${organisation_name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ organisation_name, departmentname: name }) // Adjusted body object
            });

            if (response.ok) {
                toast.success('Department updated successfully');
                fetchDepartments(token);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
                console.error('Error updating department:', errorData.message);
            }
        } catch (error) {
            console.error('Error updating department:', error);
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

            const response = await fetch('http://localhost:5000/admin/department', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    departmentname: formData.departmentname,
                    organisation_name: formData.organisation_name
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                toast.success(responseData.message || 'Department created successfully');
                console.log('Department created successfully');
                setShowDepartmentDetailsModal(false);
                fetchDepartments(token);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
                console.error('Error creating department:', errorData.message);
            }
        } catch (error) {
            console.error('Error creating department:', error);
        }
    };

    const logout = () => {
        Cookies.remove('token');
        Router.push('/');
    };

    const toggleDepartmentDetailsModal = (department) => {
        setSelectedDepartment(department);
        setShowDepartmentDetailsModal(!showDepartmentDetailsModal);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCloseDepartmentDetailsModal = () => {
        setShowDepartmentDetailsModal(false);
    };

    const handleDeleteDepartment = async (organisationName) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    Router.push('/');
                    return;
                }
                const response = await fetch(`http://localhost:5000/admin/department/${organisationName}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    toast.success('Department deleted successfully');
                    fetchDepartments(token);
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message);
                    console.error('Error deleting department:', errorData.message);
                }
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    return (
        <>
            <div className='w-full h-screen flex flex-col bg-gray-100'>
                <div className="bg-indigo-700 text-white text-center p-4">
                    <p className='text-4xl font-extrabold'>Welcome to Home Page</p>
                    <button onClick={logout} className='bg-white border-2 border-white hover:bg-transparent transition-all text-indigo-700 hover:text-white font-semibold text-lg px-4 py-2 rounded duration-700 absolute top-4 right-4'>Logout</button>
                </div>
                <p className='text-4xl font-extrabold text-center'>Departments</p>
                <div className="grid grid-cols-4 gap-4 p-11">
                    {departments.map(department => (
                        <div key={department._id} className="bg-white shadow-md p-6 rounded-md cursor-pointer relative" onClick={() => toggleDepartmentDetailsModal(department)}>
                            <div className="bg-gray-200 px-4 py-2 rounded-md text-center mb-4">
                                <p className="text-lg font-semibold">{department.organisation_name}</p>
                            </div>
                            <div className="mb-4">
                                <p><strong>Department Name:</strong> {department.name}</p>
                                <p><strong>Users:</strong> {department.users.length}</p>
                            </div>
                            <button onClick={() => handleDeleteDepartment(department.organisation_name)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2">
                                <FiTrash2 /> {/* Display FiTrash2 icon */}
                            </button>
                            {/* <FiTrash2 onClick={() => handleDeleteDepartment(department.organisation_name)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 cursor-pointer" /> */}
                        </div>
                    ))}
                    {showDepartmentDetailsModal && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 " style={{ zIndex: 999 }}>
                            <DepartmentDetailsModal department={selectedDepartment} onSave={handleSaveDepartment} onClose={handleCloseDepartmentDetailsModal} />
                        </div>
                    )}
                </div>
                <p className='text-4xl font-extrabold text-center'>Tickets</p>
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


            </div>
            {showTicketDetailsModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <TicketDetailsModal ticket={selectedTicket} onClose={handleCloseTicketDetailsModal} />
                </div>
            )}

            {showCreateDepartmentModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-8 rounded-md w-96">
                        <h2 className="text-xl font-semibold mb-4 text-center">Create Department</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Organisation Name</label>
                                <input type="text" name="organisation_name" id="name" value={formData.organisation_name} onChange={handleInputChange} className="border-gray-300 rounded-md w-full" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Department Name</label>
                                <input type="text" name="departmentname" id="name" value={formData.departmentname} onChange={handleInputChange} className="border-gray-300 rounded-md w-full" required />
                            </div>
                            <button type="submit" className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md">Submit</button>
                        </form>
                        <button onClick={toggleCreateDepartmentModal} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Close</button>
                    </div>
                </div>
            )}
            <button onClick={toggleCreateDepartmentModal} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full fixed bottom-8 right-8">Create Department</button>
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
