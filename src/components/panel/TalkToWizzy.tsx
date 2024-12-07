import React, { useEffect } from "react";
import { MessageSquare } from "lucide-react";

export const TalkToWizzy = () => {
  useEffect(() => {
    // Add the script dynamically
    const script = document.createElement('script');
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Talk to Wizzy</h3>
      </div>
      <div className="w-full h-[300px] rounded-lg overflow-hidden bg-white">
        <elevenlabs-convai agent-id="zmQ4IMOTcaVnB64g8OYl"></elevenlabs-convai>
      </div>
    </div>
  );
};