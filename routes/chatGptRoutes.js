const express = require('express');
const { generatePost, generateGet } = require('../controllers/generate');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', generatePost); 
router.get('/', generateGet);

module.exports = router;
