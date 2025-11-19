import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import "./n.css";

export function N8n() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerAutomation = async () => {
    try {
      setLoading(true);
      await axios.get("http://localhost:5000/trigger");

      alert("Automation triggered! Checking for new data...");

      // ⭐ Start polling every 3 seconds until data is available
      const interval = setInterval(async () => {
        try {
          const res = await axios.get("http://localhost:5000/getauto");

          if (res.data && res.data.data) {
            console.log("DATA ARRIVED:", res.data.data);
            setData(res.data.data);

            clearInterval(interval); // stop polling once data arrives
            setLoading(false);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);

    } catch (err) {
      console.error(err);
      alert("Failed to trigger automation.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getauto");
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getData();
  }, []);

  // ⭐ When there is no data yet → show button + loading
  if (!data)
    return (
      <>
        <Navbar />
        <div className="n1-loading-container">
          <h2 className="n1-loading">No data generated yet</h2>

          <button
            className="n1-trigger-btn"
            onClick={triggerAutomation}
            disabled={loading}
          >
            {loading ? "Running..." : "Run Automation Workflow"}
          </button>
        </div>
      </>
    );

  // ⭐ When data exists → show cards
  return (
    <>
      <Navbar />
      <div className="n1-container">
        <h1 className="n1-title">AI Generated Content</h1>

        <div className="n1-grid">

          <CardN1 title="Blog Title" text={data["Blog Title"]} />

          <CardN1 title="Tweet 1" text={data["Tweet1"]} />
          <CardN1 title="Tweet 2" text={data["Tweet2"]} />
          <CardN1 title="Tweet 3" text={data["Tweet3"]} />

          <CardN1 title="Email Summary" text={data["Email Summary"]} />

          <CardN1
            title="Blog URL"
            text={
              <a href={data["Blog Url"]} target="_blank" className="n1-link">
                {data["Blog Url"]}
              </a>
            }
          />

        </div>
      </div>
    </>
  );
}

function CardN1({ title, text }) {
  return (
    <div className="n1-card">
      <h2 className="n1-card-title">{title}</h2>
      <div className="n1-card-text">{text}</div>
    </div>
  );
}
