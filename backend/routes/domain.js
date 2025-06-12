const express = require('express');
const router = express.Router();
const { validateDomain } = require('../middleware');
const { getDomainInfo } = require('../services/whois');
const { searchDomainExternal } = require('../services/external-apis');
const { saveSearchHistory } = require('../database');


router.get('/search', validateDomain, async (req, res) => {
  try {
    const { domain, source = 'internal' } = req.query;

    let result;

    if (source === 'external') {
      result = await searchDomainExternal(domain);
    } else {
      result = await getDomainInfo(domain);
    }

    saveSearchHistory(req.sessionId, domain, result, source);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 