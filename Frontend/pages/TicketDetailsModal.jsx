// // import React, { useState } from 'react';
// // import { FiEdit } from 'react-icons/fi';

// // export default function TicketDetailsModal({ ticket, onSave }) {
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [editedTicket, setEditedTicket] = useState({ ...ticket });

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setEditedTicket({ ...editedTicket, [name]: value });
// //   };

// //   const handleSave = () => {
// //     onSave(editedTicket);
// //     setIsEditMode(false);
// //   };

// //   return (
// //     <div className="bg-white p-8 rounded-md w-97">
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-xl font-semibold">Ticket Details</h2>
// //         <button onClick={() => setIsEditMode(!isEditMode)}>
// //           <FiEdit className="text-gray-600 cursor-pointer" />
// //         </button>
// //       </div>
// //       <div>
// //         <p>Type: {isEditMode ? <input type="text" name="type" value={editedTicket.type} onChange={handleInputChange} /> : ticket.type}</p>
// //         <p>Summary: {isEditMode ? <input type="text" name="summary" value={editedTicket.summary} onChange={handleInputChange} /> : ticket.summary}</p>
// //         <p>Description: {isEditMode ? <input type="text" name="description" value={editedTicket.description} onChange={handleInputChange} /> : ticket.description}</p>
// //         <p>Assignee Email: {isEditMode ? <input type="text" name="assigneeEmail" value={editedTicket.assigneeEmail} onChange={handleInputChange} /> : ticket.assigneeEmail}</p>
// //         <p>Due Date: {isEditMode ? <input type="date" name="dueDate" value={editedTicket.dueDate} onChange={handleInputChange} /> : ticket.dueDate}</p>
// //         <p>Status: {isEditMode ? <input type="text" name="status" value={editedTicket.status} onChange={handleInputChange} /> : ticket.status}</p>
// //       </div>
// //       {isEditMode && (
// //         <button onClick={handleSave} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Save Changes</button>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState } from 'react';
// import { FiEdit } from 'react-icons/fi';

// export default function TicketDetailsModal({ ticket, onSave }) {
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editedTicket, setEditedTicket] = useState({ ...ticket });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedTicket({ ...editedTicket, [name]: value });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
//     return formattedDate;
//   };

//   const handleSave = async () => {
//     await onSave(editedTicket);
//     setIsEditMode(false);
//   };

//   return (
//     <div className="bg-white p-8 rounded-md w-97">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Ticket Details</h2>
//         {!isEditMode && (
//           <button onClick={() => setIsEditMode(true)}>
//             <FiEdit className="text-gray-600 cursor-pointer" />
//           </button>
//         )}
//       </div>
//       <div>
//         <p>Type: {isEditMode ? <input type="text" name="type" value={editedTicket.type} onChange={handleInputChange} /> : ticket.type}</p>
//         <p>Summary: {isEditMode ? <input type="text" name="summary" value={editedTicket.summary} onChange={handleInputChange} /> : ticket.summary}</p>
//         <p>Description: {isEditMode ? <input type="text" name="description" value={editedTicket.description} onChange={handleInputChange} /> : ticket.description}</p>
//         <p>Assignee: {ticket.assignee}</p>
//         <p>Reporter: {ticket.reporter}</p>
//         <p>Status: {isEditMode ? <input type="text" name="status" value={editedTicket.status} onChange={handleInputChange} /> : ticket.status}</p>
//         <p>Due Date: {isEditMode ? <input type="date" name="dueDate" value={editedTicket.dueDate} onChange={handleInputChange} /> : formatDate(ticket.dueDate)}</p>
//         <p>Created Date: {formatDate(ticket.createdDate)}</p>
//         <p>Updated Date: {formatDate(ticket.updatedDate)}</p>
//         <p>History: {ticket.history}</p>
//         <p>Comments: {ticket.comments}</p>
//         {/* Render other fields here */}
//       </div>
//       {isEditMode && (
//         <button onClick={handleSave} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Save Changes</button>
//       )}
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import { FiEdit } from 'react-icons/fi';

// export default function TicketDetailsModal({ ticket, onSave, onClose }) {
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editedTicket, setEditedTicket] = useState({ ...ticket });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditedTicket({ ...editedTicket, [name]: value });
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
//         return formattedDate;
//     };

//     const handleSave = async () => {
//         await onSave(editedTicket);
//         setIsEditMode(false);
//     };

//     const isFieldEditable = (fieldName) => {
//         return !['assignee', 'reporter', 'createdDate', 'updatedDate', 'history', 'comments'].includes(fieldName);
//     };

//     const isDueDateValid = () => {
//         const today = new Date();
//         const dueDate = new Date(editedTicket.dueDate);
//         return dueDate > today;
//     };

//     return (
//         <div className="bg-white p-8 rounded-md w-97 shadow-md overflow-y-auto max-h-97">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Ticket Details</h2>
//                 {!isEditMode && (
//                     <button onClick={() => setIsEditMode(true)}>
//                         <FiEdit className="text-gray-600 cursor-pointer" />
//                     </button>
//                 )}
//             </div>
//             <div>
//                 <p><span className="font-semibold">Type:</span> {isEditMode ?
//                     <select name="type" value={editedTicket.type} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1">
//                         <option value="Story">Story</option>
//                         <option value="Task">Task</option>
//                         <option value="Bug">Bug</option>
//                     </select>
//                     : ticket.type}</p>
//                 <p><span className="font-semibold">Summary:</span> {isEditMode ? <input type="text" name="summary" value={editedTicket.summary} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1" /> : ticket.summary}</p>
//                 <p><span className="font-semibold">Description:</span> {isEditMode ? <input type="text" name="description" value={editedTicket.description} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1" /> : ticket.description}</p>
//                 <p><span className="font-semibold">Assignee:</span> <span className={!isFieldEditable('assignee') ? 'text-gray-400' : ''}>{ticket.assignee}</span></p>
//                 <p><span className="font-semibold">Reporter:</span> <span className={!isFieldEditable('reporter') ? 'text-gray-400' : ''}>{ticket.reporter}</span></p>
//                 <p><span className="font-semibold">Status:</span> {isEditMode ?
//                     <select name="status" value={editedTicket.status} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1">
//                         <option value="TOBEPICKED">To be picked</option>
//                         <option value="INPROGRESS">In Progress</option>
//                         <option value="INTESTING">In Testing</option>
//                         <option value="COMPLETED">Completed</option>
//                     </select>
//                     : ticket.status}</p>
//                 <p><span className="font-semibold">Due Date:</span> {isEditMode ? <input type="date" name="dueDate" value={editedTicket.dueDate} onChange={handleInputChange} className={`border-gray-300 rounded-md w-full p-1 ${!isDueDateValid() ? 'border-red-500' : ''}`} /> : formatDate(ticket.dueDate)}</p>
//                 <p><span className="font-semibold">Created Date:</span> {formatDate(ticket.createdDate)}</p>
//                 <p><span className="font-semibold">Updated Date:</span> {formatDate(ticket.updatedDate)}</p>
//                 <div>
//                     <div className="mt-4">
//                         <h3 className="font-semibold">History:</h3>
//                         <ul className="list-disc pl-4 mt-2">
//                             {ticket.history.map((log, index) => (
//                                 <li key={index}>
//                                     <p>
//                                         <strong>{log.userName}</strong> updated the field <strong>{log.fieldName}</strong> - from <strong>{log.oldValue}</strong> to <strong>{log.newValue}</strong>
//                                     </p>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>

//                 <p><span className="font-semibold">Comments:</span> {ticket.comments}</p>
//                 {/* Render other fields here */}
//             </div>

//             {isEditMode && (
//                 <button onClick={handleSave} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Save Changes</button>
//             )}

//             <button onClick={onClose}
//                 className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full" > Close
//             </button>
//         </div>
//     );
// }


import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';

export default function TicketDetailsModal({ ticket, onSave, onClose }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedTicket, setEditedTicket] = useState({ ...ticket });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTicket({ ...editedTicket, [name]: value });
    };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

    const handleSave = async () => {
        await onSave(editedTicket);
        setIsEditMode(false);
    };

    const isFieldEditable = (fieldName) => {
        return !['assignee', 'reporter', 'createdDate', 'updatedDate', 'history', 'comments'].includes(fieldName);
    };

    const isDueDateValid = () => {
        const today = new Date();
        const dueDate = new Date(editedTicket.dueDate);
        return dueDate > today;
    };

    return (
        <div className="bg-white p-8 rounded-md w-100 shadow-md overflow-y-auto max-h-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ticket Details</h2>
                {!isEditMode && (
                    <button onClick={() => setIsEditMode(true)}>
                        <FiEdit className="text-gray-600 cursor-pointer" />
                    </button>
                )}
            </div>
            <div>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Type:</span>
                        {isEditMode ?
                            <select name="type" value={editedTicket.type} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1">
                                <option value="Story">Story</option>
                                <option value="Task">Task</option>
                                <option value="Bug">Bug</option>
                            </select>
                            : <span>{ticket.type}</span>}
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Summary:</span>
                        {isEditMode ? <input type="text" name="summary" value={editedTicket.summary} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1" /> : <span>{ticket.summary}</span>}
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Description:</span>
                        {isEditMode ? <input type="text" name="description" value={editedTicket.description} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1" /> : <span>{ticket.description}</span>}
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Assignee:</span>
                        <span className={!isFieldEditable('assignee') ? 'text-gray-400' : ''}>{ticket.assignee}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Reporter:</span>
                        <span className={!isFieldEditable('reporter') ? 'text-gray-400' : ''}>{ticket.reporter}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Status:</span>
                        {isEditMode ?
                            <select name="status" value={editedTicket.status} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1">
                                <option value="TOBEPICKED">To be picked</option>
                                <option value="INPROGRESS">In Progress</option>
                                <option value="INTESTING">In Testing</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                            : <span>{ticket.status}</span>}
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Due Date:</span>
                        {isEditMode ? <input type="date" name="dueDate" value={editedTicket.dueDate} onChange={handleInputChange} className={`border-gray-300 rounded-md w-full p-1 ${!isDueDateValid() ? 'border-red-500' : ''}`} /> : formatDate(ticket.dueDate)}
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Created Date:</span>
                        <span>{formatDate(ticket.createdDate)}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Updated Date:</span>
                        <span>{formatDate(ticket.updatedDate)}</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="font-semibold">History:</h3>
                        <ul className="list-disc pl-4 mt-2">
                            {ticket.history.map((log, index) => (
                                <li key={index}>
                                    <p>
                                        <strong>{log.userName}</strong> updated the field <strong>{log.fieldName}</strong> - from <strong>{log.oldValue}</strong> to <strong>{log.newValue}</strong>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-32">Comments:</span>
                        <span>{ticket.comments}</span>
                    </div>
                    {/* Render other fields here */}
                </div>
            </div>

            {isEditMode && (
                <button onClick={handleSave} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Save Changes</button>
            )}

            <button onClick={onClose} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Close</button>
        </div>
    );
}
