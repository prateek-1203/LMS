"use client";
import { useState } from "react";

export function ChatBox() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

 const askQuestion = async () => {
  setLoading(true);
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!prompt.trim()) {
  alert("Please ask something related to LMS.");
  return;
}

  const data = await res.json();
 setResponse(
  data?.choices?.[0]?.message?.content || data?.error?.message || "Sorry, I couldn’t get a response."
);
  setLoading(false);
};
  return (
    <div className="max-w-lg mx-auto p-4 border rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Ask AI Assistant</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        placeholder="Ask something about your course..."
        className="w-full border rounded p-2"
      />
      <button
        onClick={askQuestion}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
   {response && (
  <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
    {response}
  </div>
)}
    </div>
  );
}
