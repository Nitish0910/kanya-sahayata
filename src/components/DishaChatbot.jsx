'use client';
import { useState, useEffect, useRef } from 'react';
import { FiMic, FiMicOff, FiSend, FiX, FiVolume2, FiVolumeX, FiNavigation } from 'react-icons/fi';
import Image from 'next/image';

// ========== INTENT ENGINE ==========
const intents = [
  // Emergency / Crisis
  { keys: ['help me', 'bachao', 'danger', 'abuse', 'violence', 'maaro', 'maar', 'rape', 'harass', 'molestation', 'threat', 'suicide', 'kill', 'die', 'emergency', 'sos'], intent: 'emergency' },
  // Greetings
  { keys: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hii', 'hiii', 'good morning', 'good evening', 'good afternoon'], intent: 'greet' },
  // Education
  { keys: ['education', 'school', 'college', 'study', 'padhai', 'book', 'exam', 'scholarship', 'tuition', 'notes', 'learn', 'siksha'], intent: 'service_education' },
  // Medical
  { keys: ['medical', 'health', 'doctor', 'hospital', 'medicine', 'sick', 'bimar', 'treatment', 'clinic', 'dawai', 'ilaj', 'disease', 'fever'], intent: 'service_medical' },
  // Domestic
  { keys: ['domestic', 'clothes', 'uniform', 'shoes', 'supplies', 'kapde', 'saman', 'ration', 'ghar', 'home', 'daily needs'], intent: 'service_domestic' },
  // Career
  { keys: ['career', 'job', 'naukri', 'rozgar', 'skill', 'resume', 'interview', 'training', 'internship', 'placement', 'kaam'], intent: 'service_career' },
  // Legal
  { keys: ['legal', 'law', 'rights', 'court', 'police', 'complaint', 'fir', 'lawyer', 'advocate', 'kanoon', 'adhikar', 'dowry', 'child marriage'], intent: 'service_legal' },
  // Mental Health
  { keys: ['mental', 'counseling', 'anxiety', 'depression', 'stress', 'sad', 'lonely', 'tension', 'pareshani', 'udaas', 'feeling', 'therapy', 'counselor', 'talk to someone'], intent: 'service_mental' },
  // Track Request
  { keys: ['track', 'status', 'my request', 'mera request', 'kahan hai', 'update', 'request status', 'check request'], intent: 'track_request' },
  // NGO
  { keys: ['ngo', 'nearby', 'near me', 'organization', 'foundation', 'paas', 'closest', 'which ngo'], intent: 'find_ngo' },
  // Help Request Submit
  { keys: ['submit', 'request', 'apply', 'form', 'help chahiye', 'madad', 'sahayata', 'help request', 'register request'], intent: 'submit_request' },
  // Donate
  { keys: ['donate', 'donation', 'daan', 'contribute', 'money', 'fund'], intent: 'donate' },
  // Contact
  { keys: ['contact', 'phone', 'email', 'reach', 'address', 'location', 'pata', 'sampark'], intent: 'contact' },
  // About
  { keys: ['about', 'kanya sahayata', 'what is', 'kya hai', 'who are you', 'kaun ho', 'tum kaun'], intent: 'about' },
  // Services list
  { keys: ['services', 'seva', 'what services', 'kya services', 'kya kya milta', 'features', 'modules'], intent: 'services_list' },
  // Goodbyes
  { keys: ['bye', 'goodbye', 'thanks', 'thank you', 'dhanyawad', 'shukriya', 'ok bye', 'alvida'], intent: 'goodbye' },
  // How are you
  { keys: ['how are you', 'kaise ho', 'kya haal', 'kaisi ho'], intent: 'how_are_you' },
];

function detectIntent(text) {
  const lower = text.toLowerCase().trim();
  for (const { keys, intent } of intents) {
    for (const key of keys) {
      if (lower.includes(key)) return intent;
    }
  }
  return 'unknown';
}

// ========== RESPONSE GENERATOR ==========
function getResponse(intent, user) {
  const userName = user?.name?.split(' ')[0] || '';
  const namePrefix = userName ? `${userName}, ` : '';
  const nameSuffix = userName ? ` ${userName}` : '';

  const responses = {
    emergency: {
      text: `🚨 ${userName ? userName + ', a' : 'A'}ap safe hain? Please immediately call:\n\n📞 Women Helpline: 181\n📞 Child Helpline: 1098\n📞 Police: 100\n📞 Emergency: 112\n\nAap akele nahi hain. Hum aapke saath hain. ❤️`,
      buttons: [
        { label: '📞 Call 181', action: 'call:181' },
        { label: '📞 Call 100', action: 'call:100' },
        { label: '⚖️ Legal Aid', action: 'navigate:/legal-aid' },
        { label: '💙 Talk to Counselor', action: 'navigate:/mental-health' },
      ],
      speak: true, priority: true
    },
    greet: {
      text: `Namaste${nameSuffix}! 🌸 Main Disha hun — aapki Virtual Assistant. Aap mujhse kuch bhi puch sakte hain!\n\nMain aapki madad kar sakti hun:\n• Education, Medical, Career guidance\n• Legal help & Mental health support\n• Nearby NGOs dhundne me\n• Help request submit karne me\n\nKya chahiye aapko?`,
      buttons: [
        { label: '📚 Education Help', action: 'intent:service_education' },
        { label: '🏥 Medical Help', action: 'intent:service_medical' },
        { label: '💼 Career Guidance', action: 'intent:service_career' },
        { label: '📋 Track My Request', action: 'intent:track_request' },
        { label: '🏢 Find Nearby NGO', action: 'intent:find_ngo' },
        { label: '🚨 Emergency Help', action: 'intent:emergency' },
      ]
    },
    service_education: {
      text: `📚 Education Services:\n\n• Study materials & video lectures\n• Scholarship information\n• Exam preparation help\n• School supplies & books\n• Tuition & mentoring programs\n\nHamari partner NGOs jaise Pratham Foundation, Nanhi Kali aur Smile Foundation education me help karti hain.`,
      buttons: [
        { label: '📝 Submit Help Request', action: 'navigate:/help-request' },
        { label: '📚 Go to Education Page', action: 'navigate:/education' },
        { label: '🏢 Find Education NGOs', action: 'intent:find_ngo' },
      ]
    },
    service_medical: {
      text: `🏥 Medical Services:\n\n• Free medical consultations\n• Medicine & treatment support\n• Health awareness camps\n• Mental health counseling\n• Mobile health units in rural areas\n\nNGOs jaise MSF India, Uday Foundation, Jan Swasthya Sahyog free medical help dete hain.`,
      buttons: [
        { label: '📝 Submit Help Request', action: 'navigate:/help-request' },
        { label: '🏥 Go to Medical Page', action: 'navigate:/medical' },
        { label: '🏢 Find Medical NGOs', action: 'intent:find_ngo' },
      ]
    },
    service_domestic: {
      text: `🏠 Domestic Support:\n\n• School uniforms & shoes\n• Daily essentials & ration\n• Sanitary products\n• Clothing & warm clothes\n• School bags & stationery\n\nGoonj Foundation, Nanhi Kali, Deepalaya jaise NGOs domestic needs me help karte hain.`,
      buttons: [
        { label: '📝 Submit Help Request', action: 'navigate:/help-request' },
        { label: '🏠 Go to Domestic Page', action: 'navigate:/domestic' },
        { label: '🏢 Find Domestic NGOs', action: 'intent:find_ngo' },
      ]
    },
    service_career: {
      text: `💼 Career Guidance:\n\n• Job listings & placements\n• Resume building help\n• Interview preparation\n• Skill training programs\n• Scholarship & internships\n• Entrepreneurship guidance\n\nNasscom Foundation, LabourNet, Udyogini aur SEWA career help me expert hain.`,
      buttons: [
        { label: '📝 Submit Help Request', action: 'navigate:/help-request' },
        { label: '💼 Go to Career Page', action: 'navigate:/career' },
        { label: '🏢 Find Career NGOs', action: 'intent:find_ngo' },
      ]
    },
    service_legal: {
      text: `⚖️ Legal Aid:\n\n• Know your rights (POCSO, DV Act)\n• Free legal counsel\n• Report abuse confidentially\n• FIR filing guidance\n• Shelter homes & rehabilitation\n\n🚨 Emergency Numbers:\n📞 Women Helpline: 181\n📞 Child Helpline: 1098\n\nMajlis Legal Centre, HRLN, Shakti Shalini free legal help dete hain.`,
      buttons: [
        { label: '📞 Call 181', action: 'call:181' },
        { label: '📝 Submit Help Request', action: 'navigate:/help-request' },
        { label: '⚖️ Go to Legal Aid Page', action: 'navigate:/legal-aid' },
      ]
    },
    service_mental: {
      text: `💙 Mental Health Support:\n\n${userName ? userName + ', a' : 'A'}gar aap udaas ya pareshaan hain — it's okay to ask for help.\n\n• Free counseling helplines\n• Emotional support groups\n• Stress management techniques\n• Self-care resources\n\n📞 iCall: 9152987821\n📞 Vandrevala Foundation: 1860-2662-345\n\nYe free aur confidential hain. Abhi call kar sakte hain.`,
      buttons: [
        { label: '📞 Call iCall', action: 'call:9152987821' },
        { label: '💙 Mental Health Page', action: 'navigate:/mental-health' },
        { label: '📝 Request Counseling', action: 'navigate:/help-request' },
      ],
      speak: true
    },
    track_request: {
      text: `📋 Request Track karne ke liye "My Requests" page pe jaayein. Wahan aapko:\n\n• Request ka current status dikhega\n• Assigned NGO ki details milegi\n• Progress bar se pata chalega request kahan hai\n\nKya main aapko My Requests page pe le jaun?`,
      buttons: [
        { label: '📋 Go to My Requests', action: 'navigate:/my-requests' },
        { label: '📝 Submit New Request', action: 'navigate:/help-request' },
      ],
      fetchRequests: true
    },
    find_ngo: {
      text: `🏢 Aapke paas bahut se NGOs available hain! NGO Partners page pe:\n\n• 22+ verified NGOs listed hain\n• Aapki location ke nearest NGOs dikhte hain\n• Service type se filter kar sakte hain\n• Contact details bhi milte hain\n\nKya main aapko NGO page pe le jaun?`,
      buttons: [
        { label: '🏢 Find Nearby NGOs', action: 'navigate:/ngos' },
        { label: '📝 Register Your NGO', action: 'navigate:/ngos/register' },
      ]
    },
    submit_request: {
      text: `📝 Help Request submit karna bahut easy hai!\n\n1️⃣ Form me apna naam, phone, address bharo\n2️⃣ Service type choose karo (Education/Medical/Career etc.)\n3️⃣ Problem describe karo\n4️⃣ Submit!\n\nAdmin verify karega → NGO assign hoga → Help milegi! ✅\n\nKya main aapko form pe le jaun?`,
      buttons: [
        { label: '📝 Go to Help Request Form', action: 'navigate:/help-request' },
        { label: '📋 Track Existing Request', action: 'intent:track_request' },
      ]
    },
    donate: {
      text: `🙏 Donate karke aap ek ladki ki zindagi badal sakte hain!\n\nAap donate kar sakte hain:\n• Education fund\n• Medical supplies\n• Daily essentials\n\nHar chota contribution matter karta hai. ❤️`,
      buttons: [
        { label: '💝 Go to Donate Page', action: 'navigate:/donate' },
      ]
    },
    contact: {
      text: `📞 Contact Kanya Sahayata:\n\n📧 Email: kanyasahayata@gmail.com\n📱 Phone: 9100200340\n📍 Address: Moradabad, India\n\nYa phir Contact page pe jaake message bhej sakte hain!`,
      buttons: [
        { label: '📞 Contact Page', action: 'navigate:/contact' },
      ]
    },
    about: {
      text: `🌸 Kanya Sahayata ek mission hai — ladkiyon ko encourage aur help karne ka.\n\nHum provide karte hain:\n• 6 services (Education, Medical, Domestic, Career, Legal Aid, Mental Health)\n• 22+ NGO partners\n• Location-based NGO matching\n• Complete help request workflow\n\nMain Disha hun — aapki Virtual Assistant jo 24/7 available hai! 💕`,
      buttons: [
        { label: '📖 About Page', action: 'navigate:/about' },
        { label: '🌐 All Services', action: 'intent:services_list' },
      ]
    },
    services_list: {
      text: `🌐 Kanya Sahayata ki 6 Services:\n\n📚 Education — Study help, scholarships\n🏥 Medical — Free consultations, medicines\n🏠 Domestic — Uniforms, daily essentials\n💼 Career — Jobs, skill training, resume\n⚖️ Legal Aid — Rights, free lawyers, helplines\n💙 Mental Health — Counseling, support groups\n\nKonsi service me help chahiye?`,
      buttons: [
        { label: '📚 Education', action: 'intent:service_education' },
        { label: '🏥 Medical', action: 'intent:service_medical' },
        { label: '💼 Career', action: 'intent:service_career' },
        { label: '⚖️ Legal Aid', action: 'intent:service_legal' },
        { label: '💙 Mental Health', action: 'intent:service_mental' },
        { label: '🏠 Domestic', action: 'intent:service_domestic' },
      ]
    },
    goodbye: {
      text: `🌸 Dhanyawad${nameSuffix}! Aapka din shubh ho.\n\nYaad rakhein — main 24/7 available hun. Jab bhi madad chahiye, bas "Hi" bolein! ❤️\n\nKanya Sahayata — Every girl deserves a chance. 💕`,
      buttons: []
    },
    how_are_you: {
      text: `Main bilkul thik hun${nameSuffix}! 😊 Aapka kya haal hai? Main aapki kisi bhi tarah se madad karne ke liye ready hun!\n\nKya kuch chahiye?`,
      buttons: [
        { label: '📋 All Services', action: 'intent:services_list' },
        { label: '📝 Help Request', action: 'intent:submit_request' },
      ]
    },
    unknown: {
      text: `Hmm, main samajh nahi paayi${nameSuffix}. 🤔\n\nMain inme se help kar sakti hun:\n• Services ke baare me batana\n• Help request submit karna\n• Nearby NGOs dhundhna\n• Request status track karna\n• Emergency helplines dena\n\nKya aap neeche ke buttons se choose karein?`,
      buttons: [
        { label: '📋 All Services', action: 'intent:services_list' },
        { label: '📝 Submit Request', action: 'intent:submit_request' },
        { label: '🏢 Find NGO', action: 'intent:find_ngo' },
        { label: '📊 Track Request', action: 'intent:track_request' },
        { label: '🚨 Emergency', action: 'intent:emergency' },
      ]
    },
  };

  return responses[intent] || responses.unknown;
}

// ========== CHATBOT COMPONENT ==========
export default function DishaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [typing, setTyping] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [pulse, setPulse] = useState(true);
  const messagesEnd = useRef(null);
  const recognitionRef = useRef(null);

  // Check session
  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => { if (d.loggedIn) setUser(d.user); });
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Welcome message on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = getResponse('greet', user);
      setMessages([{ role: 'bot', text: welcome.text, buttons: welcome.buttons, time: new Date() }]);
      if (voiceOn) speak(welcome.text);
      setPulse(false);
    }
  }, [isOpen]);

  // ========== SPEECH ==========
  const speak = (text) => {
    if (!voiceOn || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[📚🏥🏠💼⚖️💙🌸🚨📞📧📍📋📝🌐💕❤️💝🙏😊🤔🔊1️⃣2️⃣3️⃣4️⃣✅•\n]/g, ' ').replace(/\s+/g, ' ').trim();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'hi-IN';
    utter.rate = 1.0;
    utter.pitch = 1.1;
    // Try to find a Hindi female voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') && v.name.toLowerCase().includes('female')) ||
                       voices.find(v => v.lang.includes('hi')) ||
                       voices.find(v => v.name.toLowerCase().includes('google') && v.lang.includes('hi'));
    if (hindiVoice) utter.voice = hindiVoice;
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech Recognition not supported in this browser'); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      // Auto-send
      setTimeout(() => handleSend(transcript), 300);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // ========== MESSAGE HANDLING ==========
  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: msg.trim(), time: new Date() }]);
    setInput('');
    setTyping(true);

    // Simulate typing delay
    const delay = Math.min(800 + msg.length * 20, 2000);
    setTimeout(() => {
      const intent = detectIntent(msg);
      const response = getResponse(intent, user);

      // If tracking request, fetch real data
      if (intent === 'track_request' && user) {
        fetchAndShowRequests();
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: response.text, buttons: response.buttons, priority: response.priority, time: new Date() }]);
        if (voiceOn && (response.speak !== false)) speak(response.text);
      }
      setTyping(false);
    }, delay);
  };

  const fetchAndShowRequests = async () => {
    try {
      const res = await fetch('/api/my-requests');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const reqs = data.data;
        const statusMap = { pending: '⏳ Pending', verified: '✅ Verified', assigned: '🤝 NGO Assigned', completed: '🎉 Completed', rejected: '❌ Rejected' };
        let text = `📊 ${user?.name?.split(' ')[0] || 'Aapke'} ki requests:\n\n`;
        reqs.forEach((r, i) => {
          text += `${i + 1}. ${r.service_type.toUpperCase()} — ${statusMap[r.status] || r.status}`;
          if (r.assigned_ngo) text += `\n   🏢 NGO: ${r.assigned_ngo}`;
          text += '\n\n';
        });
        text += 'Detail ke liye My Requests page pe jaayein!';
        setMessages(prev => [...prev, { role: 'bot', text, buttons: [{ label: '📋 View All Requests', action: 'navigate:/my-requests' }], time: new Date() }]);
        if (voiceOn) speak(text);
      } else {
        const text = `Abhi aapka koi active request nahi hai. Naya request submit karna chahein?`;
        setMessages(prev => [...prev, { role: 'bot', text, buttons: [{ label: '📝 Submit Request', action: 'navigate:/help-request' }], time: new Date() }]);
        if (voiceOn) speak(text);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Request fetch nahi ho paya. Please My Requests page pe check karein.', buttons: [{ label: '📋 My Requests', action: 'navigate:/my-requests' }], time: new Date() }]);
    }
  };

  const handleButton = (action) => {
    if (action.startsWith('navigate:')) {
      window.location.href = action.replace('navigate:', '');
    } else if (action.startsWith('call:')) {
      window.open(`tel:${action.replace('call:', '')}`, '_self');
    } else if (action.startsWith('intent:')) {
      const intent = action.replace('intent:', '');
      const response = getResponse(intent, user);
      setMessages(prev => [...prev, { role: 'bot', text: response.text, buttons: response.buttons, priority: response.priority, time: new Date() }]);
      if (voiceOn) speak(response.text);
    }
  };

  // ========== RENDER ==========
  return (
    <>
      {/* Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', width: '64px', height: '64px',
            borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none', cursor: 'pointer', zIndex: 9998, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 8px 30px rgba(16,185,129,0.4)',
            animation: pulse ? 'DishaPulse 2s ease-in-out infinite' : 'none',
            transition: 'all 0.3s ease',
            padding: '12px'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          title="Chat with Disha AI"
        >
          <Image src="/logo.png" alt="Disha AI Logo" width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '400px', height: '580px',
          borderRadius: '20px', overflow: 'hidden', zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          background: '#0f172a', border: '1px solid rgba(16,185,129,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(16,185,129,0.1)',
          animation: 'DishaFadeIn 0.3s ease-out',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px', background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/logo.png" alt="Disha AI Logo" width={40} height={40} style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>Disha AI</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>🟢 Online — 24/7 available</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setVoiceOn(!voiceOn); window.speechSynthesis.cancel(); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }} title={voiceOn ? 'Mute' : 'Unmute'}>
                {voiceOn ? <FiVolume2 size={16} /> : <FiVolumeX size={16} />}
              </button>
              <button onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'DishaFadeIn 0.3s ease-out' }}>
                <div style={{
                  maxWidth: '85%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #10b981, #059669)' : msg.priority ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1))' : 'rgba(255,255,255,0.06)',
                  color: msg.role === 'user' ? 'white' : '#e2e8f0',
                  border: msg.priority ? '1px solid rgba(239,68,68,0.3)' : msg.role === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>

                {/* Buttons */}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', maxWidth: '85%' }}>
                    {msg.buttons.map((btn, j) => (
                      <button key={j} onClick={() => handleButton(btn.action)} style={{
                        padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600,
                        background: btn.action.startsWith('call:') ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.1)',
                        color: btn.action.startsWith('call:') ? '#f87171' : '#34d399',
                        border: `1px solid ${btn.action.startsWith('call:') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                        cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                      onMouseEnter={e => { e.target.style.background = btn.action.startsWith('call:') ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.2)'; e.target.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.target.style.background = btn.action.startsWith('call:') ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.1)'; e.target.style.transform = 'translateY(0)'; }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '10px', color: '#475569', marginTop: '4px', padding: '0 4px' }}>
                  {msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-start', animation: 'DishaFadeIn 0.3s ease-out' }}>
                <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', animation: 'DishaBounce 1.4s ease-in-out infinite' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', animation: 'DishaBounce 1.4s ease-in-out 0.2s infinite' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', animation: 'DishaBounce 1.4s ease-in-out 0.4s infinite' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(0,0,0,0.2)',
          }}>
            {/* Mic Button */}
            <button
              onClick={listening ? stopListening : startListening}
              style={{
                width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: listening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                color: listening ? '#f87171' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: listening ? 'DishaPulse 1s ease-in-out infinite' : 'none',
                transition: 'all 0.2s',
              }}
              title={listening ? 'Stop Listening' : 'Speak to Disha'}
            >
              {listening ? <FiMicOff size={18} /> : <FiMic size={18} />}
            </button>

            {/* Text Input */}
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder={listening ? '🎤 Sun rahi hun...' : 'Type your message...'}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: '50px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0', fontSize: '14px', outline: 'none',
                fontFamily: 'Poppins, sans-serif',
              }}
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              style={{
                width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                background: input.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                color: input.trim() ? 'white' : '#475569', cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Chatbot CSS */}
      <style jsx global>{`
        @keyframes DishaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(16,185,129,0); }
        }
        @keyframes DishaFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes DishaBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
