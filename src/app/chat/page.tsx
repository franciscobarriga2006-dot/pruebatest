"use client";

import ChatSidebar from "../../components/ChatSideBar";

export default function ChatPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl h-[85vh] shadow-sm rounded-2xl overflow-hidden bg-white">
        <ChatSidebar />
      </div>
    </div>
  );
}