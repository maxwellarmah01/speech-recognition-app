import { useState, useRef, useEffect } from "react";
import "./App.css";
import Toast from "./components/Toast";

function App() {
  const [words, setWords] = useState(
    "Click the microphone to start listening..."
  );
  const [isPulsing, setIsPulsing] = useState(false);
  const recognitionRef = useRef(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);

    // Hide the toast after 3 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  useEffect(() => {
    // Initialize SpeechRecognition instance only once on mount
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-GB";
      recognitionRef.current.continuous = true;

      recognitionRef.current.onresult = (event) => {
        setWords(event.results[event.results.length - 1][0].transcript);
      };
    } else {
      alert("Speech Recognition API not supported in this browser.");
    }

    // Cleanup: stop recognition if it's still active when unmounting
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleClick = () => {
    if (recognitionRef.current) {
      setIsPulsing((prev) => !prev);

      if (!isPulsing) {
        // Start listening when toggled on
        setWords("Listening... Say something!");
        recognitionRef.current.start();
        showToast("Listening started...");
      } else {
        // Stop listening when toggled off
        recognitionRef.current.stop();
        showToast("Listening stopped.");
      }
    }
  };

  return (
    <>
      <div
        className={`microphone-container ${isPulsing ? "pulsing" : ""}`}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="48"
          height="48"
          fill="currentColor"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </div>
      <div className="words">{words}</div>
      <Toast message={toastMessage} isVisible={toastVisible} />
    </>
  );
}

export default App;
