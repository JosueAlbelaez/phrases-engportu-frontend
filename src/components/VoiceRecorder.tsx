import { useState, useRef, useEffect } from 'react';
import { Mic, Square} from 'lucide-react';
import { calculateSimilarity } from '../utils/levenshtein';

interface VoiceRecorderProps {
  targetPhrase: string;
  isDarkMode: boolean;
  resetKey?: boolean;
  inline?: boolean;
  resultId?: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function VoiceRecorder({ targetPhrase, isDarkMode, resetKey, inline = false, resultId = 'similarity-result' }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSimilarity(null);
    setErrorMessage(null);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, [resetKey]);

  useEffect(() => {
    const resultDiv = document.getElementById(resultId);
    if (resultDiv) {
      if (errorMessage) {
        resultDiv.innerHTML = `
          <div class="flex items-center justify-center text-red-500">
            <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>
            <span>${errorMessage}</span>
          </div>
        `;
      } else if (similarity !== null) {
        const color = getFeedbackColor(similarity);
        resultDiv.innerHTML = `
          <div class="${color} font-medium text-center">
            ${getFeedbackMessage(similarity)}
          </div>
        `;
      } else {
        resultDiv.innerHTML = '';
      }
    }
  }, [similarity, errorMessage, isDarkMode, resultId]);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setErrorMessage('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const similarityScore = calculateSimilarity(targetPhrase, transcript);
        setSimilarity(similarityScore);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        setErrorMessage('Error recording: ' + event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.start();
      setIsRecording(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error initializing speech recognition.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const getFeedbackColor = (score: number): string => {
    if (score <= 60) return isDarkMode ? 'text-red-400' : 'text-red-600';
    if (score <= 80) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-green-400' : 'text-blue-600';
  };

  const getFeedbackMessage = (score: number): string => {
    if (score <= 60) return `Coincidencia del ${score}%, puedes intentar nuevamente.`;
    if (score <= 80) return `Coincidencia de ${score}%. Bien hecho.`;
    return `Coincidencia del ${score}%, ¡Excelente pronunciación!`;
  };

  const buttonClasses = `flex items-center justify-center 
                       px-2 py-1 text-sm min-w-[50px] 
                       md:px-4 md:py-2 md:text-base md:min-w-[70px] 
                       rounded transition-colors 
                       ${
                         isRecording
                           ? 'bg-red-600 hover:bg-red-700'
                           : isDarkMode
                           ? 'bg-green-600 hover:bg-green-700'
                           : 'bg-green-800 hover:bg-green-600'
                       } text-white`;

  return (
    <div className={inline ? 'inline-block' : ''}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={buttonClasses}
      >
        {isRecording ? (
          <>
            <Square className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
            Detener
          </>
        ) : (
          <>
            <Mic className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
            Grabar
          </>
        )}
      </button>
    </div>
  );
}