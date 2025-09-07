import React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef } from "react";

async function convertFilesToDataURLs(files) {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise() <
        {
          type: "file",
          mediaType: string,
          url: string,
        } >
        ((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: "file",
              mediaType: file.type,
              url: reader.result,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState();
  const fileInputRef = useRef(null);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:8080",
    }),
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.parts.map((part, index) => {
            if (part.type === "text") {
              return <span key={`${m.id}-text-${index}`}>{part.text}</span>;
            }
            return null;
          })}
        </div>
      ))}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          sendMessage({
            role: "user",
            parts: [{ type: "text", text: input }],
          });
          setInput("");
        }}
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
      >
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
