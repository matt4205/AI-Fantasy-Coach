import { useEffect, useState } from "react";

function App(){
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
    .then((res) => res.json())
    .then((data) => setApiMessage(data.message))
    .catch((error) => {
      console.error("API error:", error);
      setApiMessage("Could not connect to backend");
    });
}, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Fantasy Coach</h1>
      <p>Thsi is the AI powered coach for Fantasy</p>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>Backend Status</h2>
        <p>{apiMessage}</p>
      </div>
    </main>
  );
}

export default App;