import React, { useState } from 'react';
import AIAssistantButton from './AIAssistantButton';
import AIAssistantPanel from './AIAssistantPanel';

export default function AIAssistant({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Welcome to StadiumVerse! 🏟️\nI am your AI Smart Stadium Companion. Ask me about concession lines, seat navigation directions, event times, or emergency assistance.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      animate: false
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastInput, setLastInput] = useState('');
  const [hasError, setHasError] = useState(false);

  const [preferences, setPreferences] = useState({
    vegetarian: false,
    vegan: false,
    halal: false,
    glutenFree: false,
    wheelchairAccessible: false,
    familyFriendly: false,
    kidFriendly: false,
    budgetFriendly: false
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSendMessage = async (text) => {
    setLastInput(text);
    setHasError(false);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text, time: timestamp };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Intercept keywords to trigger visual map routing coordinates
    const query = text.toLowerCase();
    if (onNavigate) {
      if ((query.includes('gate a') && query.includes('seat b12')) || (query.includes('guide') && query.includes('b12'))) {
        onNavigate('Gate A', 'Seat B12');
      } else if (query.includes('restroom') || query.includes('toilet') || query.includes('washroom') || query.includes('bathroom')) {
        onNavigate('Section 102', 'Restrooms Concourse A');
      } else if (query.includes('parking') && query.includes('gate a')) {
        onNavigate('Parking Lot', 'Gate A');
      }
    }

    try {
      const response = await fetch('https://stadiumverseai.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, preferences, history: messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI Assistant backend');
      }

      const data = await response.json();
      
      const aiMsg = { 
        sender: 'ai', 
        text: data.reply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        animate: true
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setHasError(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (chipText) => {
    const cleanText = chipText.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
    handleSendMessage(cleanText);
  };

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <AIAssistantButton isOpen={isOpen} onClick={handleToggle} />
      {isOpen && (
        <AIAssistantPanel 
          onClose={() => setIsOpen(false)}
          messages={messages}
          onSendMessage={handleSendMessage}
          onChipClick={handleChipClick}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isTyping={isTyping}
          preferences={preferences}
          onTogglePreference={togglePreference}
          hasError={hasError}
          onRetry={() => handleSendMessage(lastInput)}
          onCancel={() => {
            setHasError(false);
            setChatInput(lastInput);
          }}
        />
      )}
    </>
  );
}
