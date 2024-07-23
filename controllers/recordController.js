const Record = require('../models/recordModel');
const jwt = require('jsonwebtoken');

const generateToken = (req, res) => {
  const payload = { user: req.body.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '200h' });
  res.json({ token });
};

const createRecord = async (req, res) => {
  const { Name, Title, Description, Archive } = req.body;
  const newRecord = new Record({ Name, Title, Description, Archive });

  try {
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecord = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const record = await Record.findByIdAndUpdate(id, updates, { new: true });
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { generateToken, createRecord, updateRecord, getAllRecords };
