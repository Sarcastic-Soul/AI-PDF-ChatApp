"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type UploadedFile = {
  name: string;
  uploadedAt: string;
};

export default function PdfSidebar() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("http://localhost:8000/files");
        const data: UploadedFile[] = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Failed to load files", err);
      }
    };
    fetchFiles();
  }, []);

  return (
    <aside
      className={clsx(
        "relative h-full border-l border-muted bg-background shadow-md transition-all duration-300 ease-in-out",
        collapsed ? "w-6" : "w-[280px]"
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -left-5 top-4 z-10 shadow rounded-full bg-background border border-muted"
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>

      {!collapsed && (
        <div className="p-4 overflow-y-auto space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">📂 Uploaded PDFs</h2>

          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
          ) : (
            files.map((file, index) => {
              const url = `http://localhost:8000/pdf/${encodeURIComponent(file.name)}`;
              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="p-2 flex flex-col gap-1 cursor-pointer hover:bg-muted/60 transition">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate max-w-[180px]">{file.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </span>
                  </Card>
                </a>
              );
            })
          )}
        </div>
      )}
    </aside>
  );
}
