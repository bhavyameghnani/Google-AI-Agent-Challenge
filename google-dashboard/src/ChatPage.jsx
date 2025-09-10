import { useState, useRef, Fragment } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Response } from "@/components/ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

import { Clipboard, RefreshCcw, Paperclip } from "lucide-react";

async function convertFilesToDataURLs(files) {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise((resolve, reject) => {
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

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState(undefined);
  const fileInputRef = useRef(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:8080",
    }),
  });

  async function handleSubmit(e) {
    const fileParts =
      files && files.length > 0 ? await convertFilesToDataURLs(files) : [];

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }, ...fileParts],
    });

    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="w-screen h-screen p-6 relative flex flex-col bg-gray-50 text-gray-900">
      <Conversation className="flex-1 rounded-2xl border border-gray-200 shadow-sm bg-white p-4">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              {/* Sources (citations) */}
              {message.role === "assistant" &&
                message.parts.filter((p) => p.type === "source-url").length >
                  0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter((p) => p.type === "source-url")
                          .length
                      }
                    />
                    <SourcesContent>
                      {message.parts
                        .filter((p) => p.type === "source-url")
                        .map((part, i) => (
                          <Source
                            key={`${message.id}-source-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        ))}
                    </SourcesContent>
                  </Sources>
                )}

              {/* Message parts */}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Fragment key={`${message.id}-text-${i}`}>
                        <Message
                          from={message.role}
                          className={`p-3 rounded-xl ${
                            message.role === "user"
                              ? "bg-blue-50 text-blue-900 self-end"
                              : "bg-gray-100 text-gray-800 self-start"
                          }`}
                        >
                          <MessageContent>
                            <Response>{part.text}</Response>
                          </MessageContent>
                        </Message>

                        {/* Assistant actions */}
                        {message.role === "assistant" &&
                          i === message.parts.length - 1 && (
                            <Actions className="mt-2 flex gap-2">
                              <Action
                                onClick={() => window.location.reload()}
                                tooltip="Retry"
                                className="bg-white hover:bg-gray-200"
                              >
                                <RefreshCcw className="size-4" />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                tooltip="Copy"
                                className="bg-white hover:bg-gray-200"
                              >
                                <Clipboard className="size-4" />
                              </Action>
                            </Actions>
                          )}
                      </Fragment>
                    );

                  case "reasoning":
                    return (
                      <Reasoning
                        key={`${message.id}-reasoning-${i}`}
                        className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-yellow-800"
                        isStreaming={
                          status === "streaming" &&
                          i === message.parts.length - 1 &&
                          message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    );

                  case "file":
                    if (part.mediaType?.startsWith("image/")) {
                      return (
                        <Message
                          key={`${message.id}-image-${i}`}
                          from={message.role}
                        >
                          <MessageContent>
                            <img
                              src={part.url}
                              alt="attachment"
                              className="max-w-sm rounded-lg border border-gray-200 shadow-sm"
                            />
                          </MessageContent>
                        </Message>
                      );
                    }
                    if (part.mediaType === "application/pdf") {
                      return (
                        <Message
                          key={`${message.id}-pdf-${i}`}
                          from={message.role}
                        >
                          <MessageContent>
                            <iframe
                              src={part.url}
                              width={400}
                              height={500}
                              className="border rounded-lg shadow-sm"
                              title="PDF attachment"
                            />
                          </MessageContent>
                        </Message>
                      );
                    }
                    return null;

                  default:
                    return null;
                }
              })}
            </div>
          ))}

          {/* Loading indicator */}
          {status === "submitted" && <Loader />}
        </ConversationContent>

        <ConversationScrollButton className="bg-white hover:bg-gray-200" />
      </Conversation>

      {/* Input area */}
      <PromptInput
        onSubmit={handleSubmit}
        className="mt-4 rounded-xl border border-gray-300 bg-white shadow-sm"
      >
        <PromptInputTextarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Type a message..."
          className="text-gray-900 placeholder-gray-400"
        />
        <PromptInputToolbar>
          <PromptInputTools>
            {/* File attachment button */}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFiles(e.target.files)}
              multiple
              ref={fileInputRef}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer p-2 hover:bg-gray-100 rounded"
            >
              <Paperclip size={16} className="text-gray-600" />
            </label>
            {files && files.length > 0 && (
              <span className="text-xs text-gray-500">
                {files.length} file(s) selected
              </span>
            )}
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!input && !files}
            status={status}
            className="bg-blue-600 text-white hover:bg-blue-700"
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
