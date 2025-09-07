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

import { CopyIcon, RefreshCcwIcon, Paperclip } from "lucide-react";

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

export default function Chat() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState(undefined);
  const fileInputRef = useRef(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:8080", // your backend
    }),
  });

  async function handleSubmit(e) {
    e.preventDefault();

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
    <div className="flex flex-col h-screen w-screen m-auto p-4">
      {/* Chat window */}
      <Conversation className="h-full">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {/* sources (citations) */}
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
                    {message.parts
                      .filter((p) => p.type === "source-url")
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source href={part.url} title={part.url} />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}

              {/* messages */}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <Response>{part.text}</Response>
                          </MessageContent>
                        </Message>

                        {/* assistant actions: retry, copy */}
                        {message.role === "assistant" &&
                          i === message.parts.length - 1 && (
                            <Actions className="mt-2">
                              <Action
                                onClick={() => window.location.reload()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                      </Fragment>
                    );

                  case "reasoning":
                    return (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className="w-full"
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
                        <img
                          key={`${message.id}-${i}`}
                          src={part.url}
                          alt="attachment"
                          className="max-w-xs rounded my-2"
                        />
                      );
                    }
                    if (part.mediaType === "application/pdf") {
                      return (
                        <iframe
                          key={`${message.id}-${i}`}
                          src={part.url}
                          width={400}
                          height={500}
                          className="my-2 border"
                        />
                      );
                    }
                    return null;

                  default:
                    return null;
                }
              })}
            </div>
          ))}

          {/* loader while waiting */}
          {status === "submitted" && <Loader />}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      {/* Input bar */}
      <PromptInput onSubmit={handleSubmit} className="mt-4">
        <PromptInputTextarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Say something..."
        />
        <PromptInputToolbar>
          <PromptInputTools>
            {/* file picker */}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFiles(e.target.files)}
              multiple
              ref={fileInputRef}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer px-2">
              <Paperclip size={16} />
            </label>
          </PromptInputTools>
          <PromptInputSubmit disabled={!input} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
