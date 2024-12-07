import React from "react";
import { MessageSquare } from "lucide-react";

export const TalkToWizzy = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Talk to Wizzy</h3>
      </div>
      <div className="w-full h-[300px] rounded-lg overflow-hidden">
        <div className="elevenlabs-widget">
          <elevenlabs-convai agent-id="zmQ4IMOTcaVnB64g8OYl"></elevenlabs-convai>
        </div>
      </div>
    </div>
  );
};