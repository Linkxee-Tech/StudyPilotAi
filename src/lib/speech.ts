export const speakText = (text: string, voiceName?: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  // Cancel any active speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  
  // Try to find a suitable voice
  if (voiceName) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes(voiceName) || v.lang.includes(voiceName));
    if (voice) utterance.voice = voice;
  }
  
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
};

export const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition = 
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-NG'; // Nigerian English accent / default
  
  return recognition;
};
