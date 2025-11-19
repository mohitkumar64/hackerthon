import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import './css/auto.css'


export default function Automation() {
  const iframeRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [template, setTemplate] = useState("/demo.html");

  /* ============================================================
      SPEECH RECOGNITION SETUP
  ============================================================ */
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = "en-US";
    recognition.continuous = false;
  }

  /* ============================================================
      SPEECH OUTPUT (TALK BACK)
  ============================================================ */
  function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    synth.speak(utter);
  }

  /* ============================================================
      LOAD SAVED STEPS
  ============================================================ */
  useEffect(() => {
    const saved = localStorage.getItem("automationSteps");
    if (saved) setSteps(JSON.parse(saved));
  }, []);

  /* ============================================================
      SAVE FORM DATA
  ============================================================ */
  const saveFormToDB = async ({ data, time }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/save-form",
        { data, time },
        { withCredentials: true }
      );
      console.log("Saved:", res.data);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  /* ============================================================
      RECEIVE MESSAGE FROM IFRAME
  ============================================================ */
  useEffect(() => {
    const handler = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "IFRAME_FORM_SUBMIT") {
        saveFormToDB(event.data.payload);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  /* ============================================================
      VOICE COMMAND + TALK BACK
  ============================================================ */
  const startVoiceCommand = () => {
    if (!recognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const frame = iframeRef.current;
    const doc = frame.contentWindow.document;

    recognition.start();
    speak("Listening for your command");

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      console.log("Voice command:", spoken);

      const fields = {
        "faculty name": "facultyName",
        subject: "subject",
        teaching: "teaching",
        communication: "communication",
        punctuality: "punctuality",
        behavior: "behavior",
        overall: "overall",
        suggestion: "suggestion",
      };

      // FILL FIELD
      for (let key in fields) {
        if (spoken.startsWith(key)) {
          const value = spoken.replace(key, "").trim();
          const el = doc.getElementById(fields[key]);

          if (el) {
            el.value = value;
            el.dispatchEvent(new Event("input", { bubbles: true }));
            speak(`${key} set to ${value}`);
          }
        }
      }

      // SUBMIT
      if (spoken.includes("submit")) {
        const btn = doc.getElementById("submitBtn");
        if (btn) {
          btn.click();
          speak("Form submitted successfully");
        }
      }
    };
  };

  /* ============================================================
      START RECORDING (FIXED)
  ============================================================ */
  const startRecording = () => {
    setIsRecording(true);

    const frame = iframeRef.current;

    const attachListeners = () => {
      const doc = frame.contentWindow.document;

      const ensureReady = () => {
        if (
          doc.readyState !== "complete" &&
          doc.readyState !== "interactive"
        ) {
          setTimeout(ensureReady, 40);
          return;
        }

        // --- FIX: Listen to input + change + click ---
        const handleInput = (e) => {
          setSteps((prev) => [
            ...prev,
            {
              type: "fill",
              selector: getSelector(e.target),
              value: e.target.value,
            },
          ]);
        };

        const handleChange = (e) => {
          setSteps((prev) => [
            ...prev,
            {
              type: "fill",
              selector: getSelector(e.target),
              value: e.target.value,
            },
          ]);
        };

        const handleClick = (e) => {
          setSteps((prev) => [
            ...prev,
            { type: "click", selector: getSelector(e.target) },
          ]);
        };

        doc.addEventListener("input", handleInput);
        doc.addEventListener("change", handleChange);
        doc.addEventListener("click", handleClick);

        iframeRef.current.recordHandlers = {
          handleInput,
          handleChange,
          handleClick,
        };
      };

      ensureReady();
    };

    if (frame.contentWindow.document.readyState === "complete")
      attachListeners();
    else frame.onload = attachListeners;
  };

  /* ============================================================
      STOP RECORDING
  ============================================================ */
  const stopRecording = () => {
    setIsRecording(false);

    const handlers = iframeRef.current.recordHandlers || {};
    const frame = iframeRef.current;
    const doc = frame.contentWindow.document;

    if (handlers.handleInput)
      doc.removeEventListener("input", handlers.handleInput);

    if (handlers.handleChange)
      doc.removeEventListener("change", handlers.handleChange);

    if (handlers.handleClick)
      doc.removeEventListener("click", handlers.handleClick);

    localStorage.setItem("automationSteps", JSON.stringify(steps));
    speak("Recording stopped");
  };

  /* ============================================================
      RUN AUTOMATION
  ============================================================ */
  const runAutomation = () => {
    const doc = iframeRef.current.contentWindow.document;

    steps.forEach((step, i) => {
      setTimeout(() => {
        const el = doc.querySelector(step.selector);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth", block: "center" });

        if (step.type === "fill") {
          el.value = step.value;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (step.type === "click") el.click();
      }, i * 150);
    });

    speak("Automation running");
  };

  /* ============================================================
      CLEAR STEPS
  ============================================================ */
  const clearSteps = () => {
    setSteps([]);
    localStorage.removeItem("automationSteps");
    speak("Steps cleared");
  };

  /* ============================================================
      FORCE UI UPDATE
  ============================================================ */
  useEffect(() => {}, [steps]);

  /* ============================================================
      UI
  ============================================================ */
  return (
    <>
      <Navbar />

      {isRecording && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "red",
            padding: "8px 14px",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
        >
          ● Recording...
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", margin: "10px" }}>
        {/* LEFT PANEL */}
        <div style={{ flex: 2 }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "15px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              className="btn-aut bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setTemplate("/demo.html");
                clearSteps();
              }}
            >
              Faculty Form
            </button>

            <button
              className="btn-aut bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setTemplate("/train.html");
                clearSteps();
              }}
            >
              Train Ticket Form
            </button>

            <div style={{ width: "20px" }}></div>

            <button
              className="btn-aut bg-blue-500 text-white px-4 py-2 rounded"
              onClick={startRecording}
            >
              Start Recording
            </button>

            <button
              className="btn-aut bg-blue-500 text-white px-4 py-2 rounded"
              onClick={stopRecording}
            >
              Stop 
            </button>

            <button
              className="btn-aut bg-blue-500 text-white px-4 py-2 rounded"
              onClick={runAutomation}
            >
              Run 
            </button>

            <button
              className="btn-aut bg-blue-500 text-white px-4 py-2 rounded"
              onClick={clearSteps}
            >
              Clear
            </button>

            <button
              className="btn-aut bg-purple-600 text-white px-4 py-2 rounded"
              onClick={startVoiceCommand}
            >
              🎤 Voice Command
            </button>
          </div>

          <iframe
            key={template}
            ref={iframeRef}
            src={template}
            style={{
              width: "100%",
              height: "70vh",
              border: "1px solid black",
              marginTop: "10px",
            }}
          ></iframe>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: 1,
            height: "70vh",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "80px",
          }}
        >
          <h3>Recorded Steps</h3>
          <pre style={{ fontSize: "14px" }}>
            {JSON.stringify(steps, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}

/* ============================================================
    SELECTOR BUILDER
============================================================ */
function getSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  return el.tagName.toLowerCase();
}
