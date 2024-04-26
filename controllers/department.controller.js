

// const Department = require('../models/Department');
// const Admin = require('../models/Admin');
// const { verifyToken } = require('../services/JWT');

// const addDepartment = async (req, res) => {
//   const BearerToken = req.headers.authorization; // Assuming the token is sent in the 'Authorization' header


//   if (!BearerToken) {
//     return res.status(401).send({ message: 'Unauthorized: Please Login First ( Token is missing ) ' });
//   }

//   const tokenParts = BearerToken.split(' ');
//   const token = tokenParts[1];


//   // Verify the JWT token
//   const [isTokenValid, message, tokenData] = verifyToken(token);
//   console.log("token: " ,token);
//   if (!isTokenValid) {
//     return res.status(401).send({ message: 'Unauthorized: Invalid token' });
//   }

//   const { email, role } = tokenData.data; // Extract the admin email and role from the token payload

//   // Check if the user's role is admin
//   if (role !== 'admin') {
//     return res.status(403).send({ message: 'Only admins can add departments' });
//   }

//   try {

//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(401).send({ message: 'Unauthorized: Admin email not found' });
//     }

//     // Check if the department already exists
//     const existingDepartment = await Department.findOne({ name: req.body.departmentname });
//     if (existingDepartment) {
//       return res.status(400).send({ message: 'Department already exists' });
//     }

//     // Create the department
//     const department = await Department.create({ organisation_name:req.body.organisation_name ,name: req.body.departmentname });
//     res.status(201).send({ message: 'Department created successfully', department });
//   } catch (error) {
//     // Handle any errors
//     res.status(500).send({ message: 'Failed to create department', error: error.message });
//   }
// };

// module.exports = { addDepartment };


const Department = require('../models/Department');
const { authorizeAdmin } = require('../services/AuthAdmin');

const addDepartment = async (req, res) => {
  const { authorized, message } = await authorizeAdmin(req, res);
  if (!authorized) {
    return res.status(403).send({ message });
  }

  try {
    const { departmentname, organisation_name } = req.body;

    // Check if the department already exists
    const existingDepartment = await Department.findOne({ name: departmentname });
    if (existingDepartment) {
      return res.status(400).send({ message: 'Department already exists' });
    }

    // Create the department
    const department = await Department.create({ organisation_name, name: departmentname });
    res.status(201).send({ message: 'Department created successfully', department });
  } catch (error) {
    res.status(500).send({ message: 'Failed to create department', error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  const { authorized, message } = await authorizeAdmin(req, res);
  if (!authorized) {
    return res.status(403).send({ message });
  }

  try {
    const { organizationName } = req.params;
    const { newDepartmentName, newOrganizationName } = req.body;

    // Find the department by organization name
    const department = await Department.findOne({ organisation_name: organizationName });
    if (!department) {
      return res.status(404).send({ message: 'Department not found' });
    }

    // Check if the new organization name is associated with another department
    if (newOrganizationName) {
      const existingDepartment = await Department.findOne({ organisation_name: newOrganizationName });
      if (existingDepartment && existingDepartment._id.toString() !== department._id.toString()) {
        return res.status(400).send({ message: 'Organization name already associated with another department' });
      }
    }

    // Update department details
    department.name = newDepartmentName;
    if (newOrganizationName) {
      department.organisation_name = newOrganizationName;
    }
    await department.save();

    res.send({ message: 'Department updated successfully', department });
  } catch (error) {
    res.status(500).send({ message: 'Failed to update department', error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  const { authorized, message } = await authorizeAdmin(req, res);
  if (!authorized) {
    return res.status(403).send({ message });
  }

  try {
    const { organizationName } = req.params;

    // Find the department by organization name and delete it
    const deletedDepartment = await Department.findOneAndDelete({ organisation_name: organizationName });
    if (!deletedDepartment) {
      return res.status(404).send({ message: 'Department not found' });
    }

    res.send({ message: 'Department deleted successfully', department: deletedDepartment });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete department', error: error.message });
  }
};

module.exports = { addDepartment, updateDepartment, deleteDepartment };
