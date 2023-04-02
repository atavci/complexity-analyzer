import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import "./App.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "./custom-prism.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://fbjjixkrcvwcptzvtkqw.supabase.co",
  process.env.REACT_APP_ANON_KEY
);

function findBigONotation(inputText) {
  const regex = /O\(\s*[a-zA-Z0-9\s+\-*/^]*\)/g;
  const matches = inputText.match(regex);

  return matches || [];
}


function App() {
  const [code, setCode] = useState(
    `function myAlgorithm(arr) {
  for (let i = 0; i < arr.length; i++) {
      console.log(arr[i]);
  }
  return true;
}`
  );
  const [results, setResults] = useState(
    "Your complexity analysis will be displayed here."
  );
  const [loading, setLoading] = useState(false);

  function handleResult(results) {
    console.log(results);
    if (results && results.choices && results.choices.length > 0) {
      console.log(results.choices);
      setResults(results.choices[0].message.content.toString());
      return true;
    }
    setResults(results);
  }

  function analyzeCode() {
    setLoading(true);
    supabase.functions
      .invoke("complexity-analyzer", {
        body: { prompt: code },
      })
      .then((response) => {
        try {
          handleResult(response.data.results);
        } catch (err) {
          handleResult("Unknown issue encountered");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        handleResult("error");
        setLoading(false);
      });
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
          <button id="analyze-btn" onClick={analyzeCode}>
            Analyze
          </button>
        </section>
        <section className="right-column">
          <div className="results">
            <div className="grid-container">
              <h2 className="row-el">Complexity</h2>
              <h2 className="row-el">{findBigONotation(results)[0] || ""}</h2>
            </div>

            {loading ? (
              <div className={`loading ${loading ? "pulse" : ""}`}>
                Loading...
              </div>
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
