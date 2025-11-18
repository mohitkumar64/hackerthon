import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";

export default function Automation() {
  const iframeRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [template, setTemplate] = useState("/demo.html"); // default template

  // Load steps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("automationSteps");
    if (saved) setSteps(JSON.parse(saved));
  }, []);

  // ---------------- SAVE FORM TO DB ----------------
  const saveFormToDB = async ({ data, time }) => {
    try {
      console.log("Saving to DB:", data, time);

      const res = await axios.post(
        "http://localhost:5000/save-form",
        { data, time },
        { withCredentials: true }
      );

      console.log("Saved:", res.data);
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // ---------------- RECEIVE MESSAGE FROM IFRAME ----------------
  useEffect(() => {
    const handleMessage = (event) => {
      const allowedOrigin = window.location.origin;
      if (event.origin !== allowedOrigin) return;

      const msg = event.data;
      if (!msg || msg.type !== "IFRAME_FORM_SUBMIT") return;

      console.log("Received submit:", msg.payload);
      saveFormToDB(msg.payload);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ---------------- START RECORDING ----------------
  const startRecording = () => {
    setIsRecording(true);

    const frame = iframeRef.current;

    const attachListeners = () => {
      let doc;
      try {
        doc = frame.contentWindow.document;
      } catch {
        console.warn("Cannot read iframe document");
        return;
      }

      console.log("Attaching listeners...");

      const handleInput = (e) =>
        setSteps((prev) => [
          ...prev,
          {
            type: "fill",
            selector: getSelector(e.target),
            value: e.target.value,
          },
        ]);

      const handleClick = (e) =>
        setSteps((prev) => [
          ...prev,
          { type: "click", selector: getSelector(e.target) },
        ]);

      const submitButton = doc.querySelector(".container button");

      const handleSubmitClick = () => {
        console.log("Submit click recorded");
      };

      doc.addEventListener("input", handleInput);
      doc.addEventListener("click", handleClick);

      if (submitButton) {
        submitButton.addEventListener("click", handleSubmitClick);
        console.log("Submit listener attached");
      }

      iframeRef.current.recordHandlers = {
        handleInput,
        handleClick,
        handleSubmitClick,
      };
    };

    const doc = frame.contentWindow.document;
    if (doc.readyState === "complete" || doc.readyState === "interactive") {
      attachListeners();
    } else {
      frame.onload = attachListeners;
    }
  };

  // ---------------- STOP RECORDING ----------------
  const stopRecording = () => {
    setIsRecording(false);

    const frame = iframeRef.current;
    let doc;
    try {
      doc = frame.contentWindow.document;
    } catch {}

    const { handleInput, handleClick, handleSubmitClick } =
      iframeRef.current.recordHandlers || {};

    if (doc) {
      if (handleInput) doc.removeEventListener("input", handleInput);
      if (handleClick) doc.removeEventListener("click", handleClick);
      const submitBtn = doc.querySelector(".container button");
      if (submitBtn && handleSubmitClick)
        submitBtn.removeEventListener("click", handleSubmitClick);
    }

    localStorage.setItem("automationSteps", JSON.stringify(steps));
    console.log("Stopped. Steps:", steps);
  };

  // ---------------- RUN AUTOMATION ----------------
  const runAutomation = () => {
    const frame = iframeRef.current;
    let doc;
    try {
      doc = frame.contentWindow.document;
    } catch {
      console.warn("Cannot access iframe");
      return;
    }

    steps.forEach((step, i) => {
      setTimeout(() => {
        const el = doc.querySelector(step.selector);
        if (!el) return;

        // Auto-scroll
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        if (step.type === "fill") {
          el.value = step.value;
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }

        if (step.type === "click") {
          el.click();
        }
      }, i * 150);
    });
  };

  // ---------------- CLEAR STEPS ----------------
  const clearSteps = () => {
    setSteps([]);
    localStorage.removeItem("automationSteps");
  };

  return (
    <>
      <Navbar />

      {/* 🔴 RECORDING BADGE */}
      {isRecording && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "red",
            color: "white",
            padding: "8px 14px",
            borderRadius: "8px",
            fontWeight: "bold",
            zIndex: 9999,
          }}
        >
          ● Recording...
        </div>
      )}

      <div style={{ display: "flex", gap: "20px", margin: "10px" }}>

        {/* LEFT SIDE */}
        <div style={{ flex: 2 }}>

          {/* 🔥 ONE HORIZONTAL LINE FOR ALL BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "15px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* TEMPLATE BUTTONS */}
            <button
              className="btn-aut bg-green-500 border-[1px] border-white shadow-xl rounded-md px-4 py-2"
              onClick={() => {
                setTemplate("/demo.html");
                clearSteps();
              }}
            >
              Faculty Form
            </button>

            <button
              className="btn-aut bg-green-500 border-[1px] border-white shadow-xl rounded-md px-4 py-2"
              onClick={() => {
                setTemplate("/train.html");
                clearSteps();
              }}
            >
              Train Ticket Form
            </button>

            {/* Spacer */}
            <div style={{ width: "20px" }} />

            {/* ACTION BUTTONS */}
            <button
              className="btn-aut bg-blue-500 border-[1px] border-white shadow-xl rounded-md px-4 py-2"
              onClick={startRecording}
            >
              Start recording
            </button>

            <button
              className="btn-aut bg-blue-500 border-[1px] border-white shadow-xl rounded-md px-4 py-2"
              onClick={stopRecording}
            >
              Stop recording
            </button>

            <button
              className="btn-aut bg-blue-500 border-[1px] border-white shadow-xl rounded-md px-4 py-2"
              onClick={runAutomation}
            >
              Run recording
            </button>

            <button
              className="btn-aut bg-blue-500 border-[1px] border-white shadow-xl rounded-md px-4 py-2"
              onClick={clearSteps}
            >
              Clear
            </button>
          </div>

          {/* IFRAME */}
          <iframe
            key={template}
            ref={iframeRef}
            id="demoFrame"
            src={template}
            style={{
              width: "100%",
              height: "70vh",
              border: "1px solid black",
              marginTop: "10px",
            }}
            title="demo"
          />
        </div>

        {/* RIGHT: Steps Viewer */}
        <div
          style={{
            flex: 1,
            height: "70vh",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            margin: "80px 0 0 0",
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

// ----------- GET CSS SELECTOR -----------
function getSelector(el) {
  if (!el) return "";
  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  return el.tagName.toLowerCase();
}
