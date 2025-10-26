"use client";

import { Action, Actions } from "@/components/ai-elements/actions";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Fragment, useState } from "react";

const AIChatTab = ({ companyData }) => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, reload } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/company-chat",
      body: {
        companyData: companyData,
      },
    }),
  });

  const handleSubmit = (message) => {
    const hasText = Boolean(message.text);
    if (!hasText) return;

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: message.text }],
    });

    setInput("");
  };

  const regenerate = () => {
    reload();
  };

  if (!companyData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bot className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Company Data Available
        </h3>
        <p className="text-gray-600">
          Please analyze a company first to start chatting about it.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 flex flex-col">
        <Conversation className="flex-1">
          <ConversationContent className="p-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ask me anything about {companyData.company_name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    I have complete access to all the company data. Try asking
                    specific questions!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
                    {[
                      "What's the company's valuation?",
                      "Who are the key people?",
                      "What's the total funding?",
                      "What industry is this company in?",
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left h-auto p-3 justify-start hover:bg-blue-50"
                        onClick={() => {
                          setInput(question);
                          handleSubmit({ text: question });
                        }}
                      >
                        <span className="text-sm">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent variant="flat">
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

        {/* Input */}
        <div className="border-t bg-white p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                placeholder={`Ask anything about ${companyData.company_name}...`}
              />
            </PromptInputBody>
            <PromptInputToolbar>
              <PromptInputTools />
              <PromptInputSubmit
                disabled={!input.trim() && status !== "streaming"}
                status={status}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default AIChatTab;
