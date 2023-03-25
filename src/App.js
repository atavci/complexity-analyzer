import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import "./App.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "./custom-prism.css";

function App() {
  const [code, setCode] = useState(
    `function myAlgorithm(arr) {
  for (let i = 0; i < arr.length; i++) {
      console.log(arr[i]);
  }
  return true;
}`
  );
  const [results, setResults] = useState("Your complexity analysis will be displayed here.");
  const [loading, setLoading] = useState(false);

  function handleResult(results) {
    setResults(results);
  }

  function analyzeCode() {
    setLoading(true);
    const url = "http://localhost:3000/conversation";
    const data = {
      message:
        "Calculate the complexity of the following code and output the result with big O notation. Code: " +
        code,
    };
    console.log("data: " + JSON.stringify(data));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json().then((responseData) => {
          handleResult(responseData.response);
          setLoading(false);
        });
      })
      .catch((error) => console.error("Error:", error));
  }

  return (
    <div className="App">
      <header>
        <h1>Big O Complexity Analyzer</h1>
      </header>
      <main>
        <section className="left-column">
          <div className="code-editor">
          <h2>Code</h2>
            <Editor
              lassName="code"
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
              }}
            />
          </div>
          <p className="description">
            Paste your code above to analyze its complexity in Big O Notation.
          </p>
          <button id="analyze-btn" onClick={analyzeCode}>Analyze</button>
        </section>
        <section className="right-column">
          <div className="results">
            <h2>Results</h2>
            {loading ? (
              <div className={`loading ${loading ? "pulse" : ""}`}>Loading...</div>
            ) : (
              <ul>
                <li>{results}</li>
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
