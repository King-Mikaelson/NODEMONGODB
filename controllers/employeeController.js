const fs = require("fs");
const path = require("path");
const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  let employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found." });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ msg: "first name and last names are required" });
  }

  // create and store the employee all at once using Mongoose
  try {
    const newEmployee = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body.id) {
    return res.status(400).json({ msg: "id is required" });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ msg: `No employee matches ID ${req.body.id}` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;

  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ msg: "Employee id is required" });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ msg: `No employee matches ID ${req.body.id}` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployeeById = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ msg: "Employee id is required" });
  }

  try{
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
      return res
        .status(400)
        .json({ msg: `No employee with the id of ${req.params.id}` });
    }
    res.json(employee);
  }catch(err){
    console.error(err);
  }

};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
};
