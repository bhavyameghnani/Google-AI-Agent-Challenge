"use client";

import { useChat } from "@ai-sdk/react";

export function useCompanyChat(companyData) {
  console.log("=== useCompanyChat DEBUG ===");
  console.log("Company data:", companyData ? "EXISTS" : "MISSING");
  console.log("Company name:", companyData?.company_name);

  const chat = useChat({
    api: "/api/company-chat",
    body: {
      companyData: companyData,
    },
    onError: (error) => {
      console.error("=== CHAT ERROR ===", error);
    },
    onFinish: (message) => {
      console.log("=== CHAT FINISHED ===", message);
    },
  });

  console.log("Chat status:", chat.status);
  console.log("Chat messages:", chat.messages.length);

  return {
    ...chat,
    companyName: companyData?.company_name || "Unknown Company",
    hasCompanyData: Boolean(companyData),
  };
}
