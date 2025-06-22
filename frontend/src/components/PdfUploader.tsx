"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export function PdfUploader({ onUpload }: { onUpload?: () => void }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", file);

        try {
            setLoading(true);
            const res = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");

            toast.success("PDF uploaded successfully!");
            onUpload?.(); // ✅ call refresh trigger
        } catch (err) {
            toast.error((err as any).message || "Upload error");
        } finally {
            setLoading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
            />
            <Button
                variant="outline"
                size="sm"
                className="text-sm gap-2"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
            >
                <UploadCloud className="w-4 h-4" />
                {loading ? "Uploading..." : "Upload"}
            </Button>
        </>
    );
}