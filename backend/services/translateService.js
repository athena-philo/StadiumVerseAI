const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini client matching aiService.js
const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey.trim() !== '') {
  aiClient = new GoogleGenAI({ apiKey });
}

// Pre-defined local dictionary fallback for quick stadium announcements
const localAnnouncementsDictionary = {
  "please proceed to gate a.": {
    "Spanish": "Por favor diríjase a la Puerta A.",
    "French": "Veuillez vous diriger vers la porte A.",
    "German": "Bitte begeben Sie sich zu Tor A.",
    "Portuguese": "Por favor, dirija-se ao Portão A.",
    "Arabic": "يرجى التوجه إلى البوابة أ.",
    "Japanese": "ゲートAへお進みください。"
  },
  "emergency exit this way.": {
    "Spanish": "Salida de emergencia por aquí.",
    "French": "Sortie de secours par ici.",
    "German": "Notausgang in dieser Richtung.",
    "Portuguese": "Saída de emergência por este caminho.",
    "Arabic": "مخرج الطوارئ من هذا الطريق.",
    "Japanese": "非常口はこちらです。"
  },
  "kickoff starts in 10 minutes.": {
    "Spanish": "El saque inicial comienza en 10 minutos.",
    "French": "Le coup d'envoi commence dans 10 minutes.",
    "German": "Der Anstoß erfolgt in 10 Minuten.",
    "Portuguese": "O pontapé de saída começa em 10 minutos.",
    "Arabic": "تبدأ ركلة البداية خلال 10 دقائق.",
    "Japanese": "キックオフは10分後に始まります。"
  }
};

async function translateText(text, targetLanguage) {
  const normalizedText = (text || '').trim();
  const lowerText = normalizedText.toLowerCase();

  // If Gemini client is loaded, translate using LLM FIRST
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `You are the StadiumVerseAI Translation Engine. 
Translate the following stadium announcement or spectator text accurately to ${targetLanguage}.
Do not add any explanations, headers, notes, or wrap quotes. Return only the translated text.

Text to translate: "${normalizedText}"`,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.error("Gemini API error in translateService, using fallback dictionary:", err);
    }
  }

  // FALLBACK: Dictionary lookup
  // Clean punctuation for direct match check
  const lookupKey = lowerText.replace(/[.!?]/g, '').trim() + '.';
  
  if (localAnnouncementsDictionary[lookupKey] && localAnnouncementsDictionary[lookupKey][targetLanguage]) {
    return localAnnouncementsDictionary[lookupKey][targetLanguage];
  }

  // Fallback for custom texts when no match is found and Gemini is disabled
  return `🌐 [${targetLanguage} Translation]: "${normalizedText}" (AI Translation temporarily unavailable)`;
}

module.exports = {
  translateText
};
