import React from "react";
import { Button } from "./ui/button";
import { ApiKeyInput } from "./ApiKeyInput";

export const ChatHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          WonderWhiz
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ApiKeyInput />
      </div>
    </div>
  );
};