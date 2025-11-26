"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Actions, Action } from "@/components/ai-elements/actions";
import { useState, Fragment } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon, RefreshCcwIcon, CopyIcon } from "lucide-react";
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
import { Navbar } from "@/components/Navbar";

const models = [
  {
    name: "Gemini 2.5 Flash",
    value: "google/gemini-2.5-flash",
  },
  {
    name: "Gemini 2.5 Pro",
    value: "google/gemini-2.5-pro",
  },
];

// Helper function from your working example - converts FileList to proper format
const convertFilesToDataURLs = async (files) => {
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
};

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage, status } = useChat();
  // Modified handleSubmit that uses your working approach
  const handleSubmit = async (message) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    try {
      let fileParts = [];

      if (message.files && message.files.length > 0) {
        console.log("Files received:", message.files);

        // Create a FileList-like object from AI Elements files
        // We'll fetch the blob URLs and create File objects
        const filePromises = message.files.map(async (fileObj) => {
          try {
            const response = await fetch(fileObj.url);
            const blob = await response.blob();
            // Create a proper File object that FileReader can handle
            return new File([blob], fileObj.filename, {
              type: fileObj.mediaType,
            });
          } catch (error) {
            console.error("Error fetching blob:", error);
            return null;
          }
        });

        const actualFiles = await Promise.all(filePromises);
        const validFiles = actualFiles.filter(Boolean);

        if (validFiles.length > 0) {
          // Now use your working conversion function
          fileParts = await convertFilesToDataURLs(validFiles);
        }
      }

      // Use the same message format as your working example
      sendMessage(
        {
          role: "user",
          parts: [
            { type: "text", text: message.text || "Sent with attachments" },
            ...fileParts,
          ],
        },
        {
          body: {
            model: model,
            webSearch: webSearch,
          },
        }
      );

      setInput("");
    } catch (error) {
      console.error("Error processing files:", error);
    }
  };

  // Placeholder regenerate function
  const regenerate = () => {
    console.log("Regenerate last message (not yet implemented)");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid={true} />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pt-24 h-[calc(100vh-5rem)] flex flex-col">
        <div className="flex flex-col flex-1 min-h-0">
          <Conversation className="flex-1 min-h-0 overflow-hidden">
            <ConversationContent className="pb-4">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === "assistant" &&
                    message.parts.filter((part) => part.type === "source-url")
                      .length > 0 && (
                      <Sources>
                        <SourcesTrigger
                          count={
                            message.parts.filter(
                              (part) => part.type === "source-url"
                            ).length
                          }
                        />
                        {message.parts
                          .filter((part) => part.type === "source-url")
                          .map((part, i) => (
                            <SourcesContent key={`${message.id}-${i}`}>
                              <Source href={part.url} title={part.url} />
                            </SourcesContent>
                          ))}
                      </Sources>
                    )}

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
                            {message.role === "assistant" &&
                              i === message.parts.length - 1 && (
                                <Actions className="mt-2">
                                  <Action onClick={regenerate} label="Retry">
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
                        return (
                          <Fragment key={`${message.id}-${i}`}>
                            <Message from={message.role}>
                              <MessageContent>
                                <div className="border rounded p-2 mb-2 overflow-hidden">
                                  {part.mediaType?.startsWith("image/") ? (
                                    <img
                                      src={part.url}
                                      alt="Uploaded image"
                                      className="max-w-full sm:max-w-xs rounded"
                                    />
                                  ) : part.mediaType === "application/pdf" ? (
                                    <div className="w-full overflow-auto">
                                      <iframe
                                        src={part.url}
                                        width="100%"
                                        height="600"
                                        title="PDF attachment"
                                        className="rounded min-h-[400px] sm:min-h-[500px] md:min-h-[600px]"
                                        style={{ minWidth: "100%" }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <span>📁</span>
                                      <span className="text-sm sm:text-base">
                                        File attached
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </MessageContent>
                            </Message>
                          </Fragment>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              ))}
              {status === "submitted" && <Loader />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <PromptInput
            onSubmit={handleSubmit}
            className="mt-2 sm:mt-4 flex-shrink-0"
            globalDrop
            multiple
          >
            <PromptInputBody>
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className="min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
              />
            </PromptInputBody>
            <PromptInputToolbar className="flex-wrap gap-2">
              <PromptInputTools className="flex-wrap gap-2">
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton
                  variant={webSearch ? "default" : "ghost"}
                  onClick={() => setWebSearch(!webSearch)}
                  className="text-xs sm:text-sm"
                >
                  <GlobeIcon size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Search</span>
                </PromptInputButton>
                <PromptInputModelSelect
                  onValueChange={(value) => {
                    setModel(value);
                  }}
                  value={model}
                >
                  <PromptInputModelSelectTrigger className="text-xs sm:text-sm min-w-[120px] sm:min-w-[150px]">
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((m) => (
                      <PromptInputModelSelectItem key={m.value} value={m.value}>
                        {m.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!input && status !== "streaming"}
                status={status}
                className="flex-shrink-0"
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default ChatBotDemo;
