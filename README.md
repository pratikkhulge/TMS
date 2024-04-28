
# Ticket Management System (TMS)

Welcome to the Ticket Management System (TMS) repository! This system provides a comprehensive solution for managing tickets within different organizations, enabling users to create, assign, and track tickets efficiently.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Backend Folder Structure](#backend-folder-structure)
5. [Frontend Folder Structure](#frontend-folder-structure)
6. [Setup Instructions](#setup-instructions)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

The Ticket Management System (TMS) facilitates the management of tickets within organizations. It offers authentication for system users and organization users, allowing them to create, edit, and view tickets, as well as perform other administrative tasks. The system ensures security, data integrity, and user-friendly interfaces to enhance productivity.

## Features

- **User Authentication**: System users and organization users can log in securely using email and OTP verification.
- **Organization Management**: System users can create, edit, and delete organizations within the system.
- **Ticket Management**: Organization users can create tickets, assign them to team members, and track their progress.
- **Ticket Filtering**: Users can filter tickets based on various criteria such as status, type, assignee, etc.
- **Ticket Details Page**: Detailed information about each ticket is available, including comments and edit history.
- **Commenting System**: Users can add, edit, and delete comments on tickets, facilitating communication and collaboration.
- **Backend Caching**: Redis is used for caching frequently accessed data points, improving system performance.

## Technology Stack

The Ticket Management System is built using the following technologies:

- **Backend**: Node.js, Express.js, TypeScript, MongoDB (with Mongoose), Redis, JWT, Zod for validations.
- **Frontend**: React, Redux, SASS, HTML5, CSS3, RSuiteJS for CSS styling.
- **Other Tools**: Next.js for frontend application, React Router DOM for routing.

## Backend Folder Structure

The backend codebase follows a structured organization for better maintenance and scalability:

- **config**: Contains configuration files for the application.
- **constants**: Declares all constants used in the application.
- **controllers**: Contains API controllers.
- **models**: Defines model schemas for database access.
- **routes**: Contains API route declarations.
- **services**: Holds business logic functions called by controllers.
- **server.js**: Entry point to the backend application.

## Frontend Folder Structure

The frontend codebase follows a standard Next.js folder structure:

- **pages**: Contains different pages of the application.
- **services**: Contains API declarations.
- **styles**: Contains stylesheets for styling components.
- **components**: Contains reusable UI components.
- **public**: Contains static assets like images, fonts, etc.

## Setup Instructions

To set up the Ticket Management System locally, follow these steps:

1. Clone the repository: `git clone git@github.com:pratikkhulge/TMS.git`
2. Navigate to the backend folder and install dependencies: `cd backend && npm install`
3. Set up MongoDB and Redis databases.
4. Create a `.env` file based on the provided `SERVER_DB_URI`,` JWT_SECRET`,`MAIL_SETTINGS`,`OTP_CONFIG` and configure environment variables.
5. Start the backend server: `npm start` (Backend will start at port 5000)
6. Navigate to the frontend folder and install dependencies: `cd frontend && npm install`
7. Start the frontend server: `npm start` (Frontend will start at port 3000)
8. Access the application in your browser at `http://localhost:3000`

## Usage

Once the application is set up, you can register as a system user or organization user, log in, and start managing tickets within your organization. Explore the various features such as ticket creation, assignment, filtering, commenting, etc.

## Contributing

Contributions to the Ticket Management System are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

---

Thank you for choosing the Ticket Management System. We hope it helps streamline your organization's ticket management process! If you have any questions or need assistance, please don't hesitate to contact us.
