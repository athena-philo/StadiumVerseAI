const translateService = require('../services/translateService');

async function handleTranslateText(req, res) {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Source text and targetLanguage parameter are required.' });
    }

    const translatedText = await translateService.translateText(text, targetLanguage);
    return res.json({ translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    return res.status(500).json({ error: 'An error occurred while translating your text.' });
  }
}

module.exports = {
  handleTranslateText
};
