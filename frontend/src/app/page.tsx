"use client";

import NavBar from "@/components/NavBar";
import ChatPanel from "@/components/ChatPanel";
import { useState } from "react";
import PdfSidebar from "@/components/PdfSidebar";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePdfUpload = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <NavBar onUpload={handlePdfUpload} />
      <main className="flex h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex-1">
          <ChatPanel />
        </div>
        <PdfSidebar />
      </main>
    </>
  );
}
