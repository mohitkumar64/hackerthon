import { useRef, useState, useEffect } from "react";
import { Navbar } from "./Navbar";

export default function Automation() {
  const iframeRef = useRef(null);
  const [steps, setSteps] = useState([]);

  
  useEffect(() => {
    const saved = localStorage.getItem("automationSteps");
    if (saved) setSteps(JSON.parse(saved));
  }, []);

  const startRecording = () => {
    const frame = iframeRef.current;
    const doc = frame.contentWindow.document;

    const handleInput = (e) => {
      setSteps((prev) => {
        const updated = [
          ...prev,
          { type: "fill", selector: getSelector(e.target), value: e.target.value }
        ];
        return updated;
      });
    };

    const handleClick = (e) => {
      setSteps((prev) => {
        const updated = [
          ...prev,
          { type: "click", selector: getSelector(e.target) }
        ];
        return updated;
      });
    };

    doc.addEventListener("input", handleInput);
    doc.addEventListener("click", handleClick);

    iframeRef.current.recordHandlers = { handleInput, handleClick };
  };

  const stopRecording = () => {
    const frame = iframeRef.current;
    const doc = frame.contentWindow.document;

    const { handleInput, handleClick } = iframeRef.current.recordHandlers;

    doc.removeEventListener("input", handleInput);
    doc.removeEventListener("click", handleClick);

    // SAVE TO LOCALSTORAGE CAN BE CHANGE TO MONGO MAYBE I WILL DO IT
    localStorage.setItem("automationSteps", JSON.stringify(steps));

    console.log("RECORDED STEPS:", steps);
  };


  const runAutomation = () => {
    const frame = iframeRef.current;
    const doc = frame.contentWindow.document;

    steps.forEach((step, i) => {
      setTimeout(() => {
        const el = doc.querySelector(step.selector);

        if (!el) {
          console.log("Element not found, skipping:", step.selector);
          return;
        }

        if (step.type === "fill") {
          el.value = step.value;
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }

        if (step.type === "click") {
          el.click();
        }
      }, i * 400);
    });
  };

  const clearSteps = () => {
    setSteps([]);
    localStorage.removeItem("automationSteps");
  };

  return (
    <>
    <Navbar />
    <div style={{ display: "flex ", gap: "20px" , margin :"10px"}}>
      
      {/* LEFT SIDE — Buttons + iframe */}
      <div style={{ flex: 2 }}>
        <button className="btn-aut bg-blue-500 border-[1px] border-white shadow-2xl shadow-blue-600/50 rounded-md" onClick={startRecording}>Start Recording</button>
        <button className="btn-aut bg-blue-500 border-[1px] border-white shadow-2xl shadow-blue-600/50 rounded-md" onClick={stopRecording}>Stop Recording</button>
        <button className="btn-aut bg-blue-500 border-[1px] border-white shadow-2xl shadow-blue-600/50 rounded-md" onClick={runAutomation}>Run Automation</button>
        <button className="btn-aut bg-blue-500 border-[1px] border-white shadow-2xl shadow-blue-600/50 rounded-md" onClick={clearSteps}>Clear</button>

        <iframe
          ref={iframeRef}
          id="demoFrame"
          src="/demo.html"
          style={{
            width: "100%",
            height: "80vh",
            border: "1px solid black",
            marginTop: "10px"
          }}
        />
      </div>

      {/* RIGHT SIDE — Step Viewer */}
      <div style={{
        flex: 1,
        height: "80vh",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px"
      }}>
        <h3>Recorded Steps</h3>
        <pre style={{ fontSize: "14px" }}>
          {JSON.stringify(steps, null, 2)}
        </pre>
      </div>

    </div></>
  );
}

function getSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  return el.tagName.toLowerCase();
}
