"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChatBox } from "./ChatBox";

export const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 z-50"
          >
            💬 Ask AI
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
          <ChatBox />
        </DialogContent>
      </Dialog>
    </div>
  );
};