import React, { useState, useRef } from "react";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "medium",
    marginBottom: "20px",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  flexContainer: {
    display: "flex",
    marginBottom: "10px",
  },
  flexGrow: {
    flexGrow: 1,
    marginRight: "10px",
  },
  alert: {
    backgroundColor: "#d4edda",
    border: "1px solid #c3e6cb",
    color: "#155724",
    padding: "10px",
    borderRadius: "4px",
    marginTop: "10px",
  },
};

const createRegex = (items, isUrl) => {
  if (isUrl) {
    const paths = items.map((url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.pathname;
      } catch {
        return url;
      }
    });
    return `(${paths
      .map((path) => path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`;
  } else {
    return `(${items
      .map((query) => query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`;
  }
};

const SEORegexBuilder = () => {
  const [input, setInput] = useState("");
  const [regex, setRegex] = useState("");
  const [inputType, setInputType] = useState("url");
  const [copySuccess, setCopySuccess] = useState(false);
  const textAreaRef = useRef(null);

  const handleGenerate = () => {
    const items = input.split("\n").filter((item) => item.trim() !== "");
    const generatedRegex = createRegex(items, inputType === "url");
    setRegex(generatedRegex);
    setCopySuccess(false);
  };

  const handleCopy = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand("copy");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          SEO Regex Builder for Google Search Console
        </h2>
        <select
          style={styles.select}
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="url">URLs</option>
          <option value="query">Queries</option>
        </select>
        <textarea
          style={styles.textarea}
          placeholder={`Enter your ${
            inputType === "url" ? "URLs" : "queries"
          } here, one per line`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
        />
        <button style={styles.button} onClick={handleGenerate}>
          Generate Regex
        </button>
      </div>
      {regex && (
        <div style={styles.card}>
          <h3 style={styles.title}>Generated Regex</h3>
          <div style={styles.flexContainer}>
            <textarea
              ref={textAreaRef}
              style={{ ...styles.textarea, ...styles.flexGrow }}
              value={regex}
              readOnly
              rows={5}
            />
            <button style={styles.button} onClick={handleCopy}>
              Copy
            </button>
          </div>
          {copySuccess && <div style={styles.alert}>Copied to clipboard!</div>}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return <SEORegexBuilder />;
}
