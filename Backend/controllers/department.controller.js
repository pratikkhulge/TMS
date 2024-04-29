const Department = require('../models/Department');
const { authorizeAdmin } = require('../services/AuthAdmin');

const addDepartment = async (req, res) => {
  const { authorized, message } = await authorizeAdmin(req, res);
  if (!authorized) {
    return res.status(403).send({ message });
  }

  try {
    const { departmentname, organisation_name } = req.body;

    const existingDepartment = await Department.findOne({ name: departmentname });
    if (existingDepartment) {
      return res.status(400).send({ message: 'Department already exists' });
    }

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
    const { departmentname , organisation_name } = req.body;

    const department = await Department.findOne({ organisation_name: organizationName });
    if (!department) {
      return res.status(404).send({ message: 'Department not found' });
    }

    if (organisation_name) {
      const existingDepartment = await Department.findOne({ organisation_name: organisation_name });
      if (existingDepartment || existingDepartment._id.toString() !== department._id.toString()) {
        return res.status(400).send({ message: 'Organization name already associated with another department' });
      }
    }

    department.name = departmentname ;
    if (organisation_name) {
      department.organisation_name = organisation_name;
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

    const deletedDepartment = await Department.findOneAndDelete({ organisation_name: organizationName });
    if (!deletedDepartment) {
      return res.status(404).send({ message: 'Department not found' });
    }

    res.send({ message: 'Department deleted successfully', department: deletedDepartment });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete department', error: error.message });
  }
};


const showAllDepartments = async (req, res) => {
  try {
    // Authorize admin
    const { authorized } = await authorizeAdmin(req, res);
    if (!authorized) {
      return res.status(403).json({ success:false ,message: 'Unauthorized: Only admin users can view all tickets' });
    }

    const departments = await Department.find();
    res.status(200).json({departments});
  } catch (error) {
    res.status(500).json({success:false, message: 'Failed to fetch tickets', error: error.message });
  }
};

module.exports = { addDepartment, updateDepartment, deleteDepartment,showAllDepartments };
