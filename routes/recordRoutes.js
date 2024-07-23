const express = require('express');
const { generateToken, createRecord, updateRecord, getAllRecords } = require('../controllers/recordController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/token', generateToken);
router.post('/', authenticateToken, createRecord);
router.put('/:id', authenticateToken, updateRecord);
router.get('/', authenticateToken, getAllRecords);

module.exports = router;
