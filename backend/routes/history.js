const express = require('express');
const router = express.Router();
const { getSearchHistory, deleteHistoryItem } = require('../database');

router.get('/', async (req, res) => {
  try {
    const history = await getSearchHistory(req.sessionId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteHistoryItem(id, req.sessionId);

    if (!result.success) {
      return res.status(404).json({ error: 'History item not found' });
    }

    res.json({ message: 'History item deleted successfully' });
  } catch (error) {
    console.error('Error deleting history item:', error);
    res.status(500).json({ error: 'Failed to delete history item' });
  }
});

module.exports = router; 