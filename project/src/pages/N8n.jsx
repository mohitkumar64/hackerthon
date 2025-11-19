import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import "./n.css";

export function N8n() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getauto");

        console.log("FINAL REAL DATA:", res.data.data);

        // FIX HERE:
        setData(res.data.data);

      } catch (err) {
        console.error(err);
      }
    };

    getData();
  }, []);

  if (!data) return <p className="n1-loading">Loading...</p>;

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

        <CardN1 title="LinkedIn Post" text={data["LinkdedIn Post"]} />

        <CardN1
          title="Blog URL"
          text={
            <a href={data["Blog Url"]} target="_blank" className="n1-link">
              {data["Blog Url"]}
            </a>
          }
        />

      </div>
    </div></>
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
