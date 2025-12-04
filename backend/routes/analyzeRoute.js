const express = require('express');
const router = express.Router();
const { analyzeWebsite } = require('../controllers/analyzeController');

// Single endpoint - keep it simple
router.post('/', analyzeWebsite);

// Optional: GET with URL parameter (for testing)
router.get('/', (req, res) => {
  res.json({
    method: 'POST',
    endpoint: '/api/analyze',
    body: { url: 'https://example.com' },
    returns: {
      size: 'bytes',
      domElements: 'count',
      requests: 'count',
      co2: 'grams',
      greenScore: '0-100'
    }
  });
});

module.exports = router;