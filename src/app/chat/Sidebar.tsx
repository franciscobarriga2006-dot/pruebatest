"use client";

import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/ChatSideBar";
import type { UIChat } from "@/lib/types/chat-ui";

export default function SidebarClient({
  chats,
  activeChatId,
}: {
  chats: UIChat[];
  activeChatId: string | null;
}) {
  const router = useRouter();

  return (
    <ChatSidebar
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={(id) => router.push(`/chat/${encodeURIComponent(id)}`)}
    />
  );
}
