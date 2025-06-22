"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfPreviewModal({
    url,
    open,
    onOpenChange,
}: {
    url: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [numPages, setNumPages] = useState<number | null>(null);

    console.log(url);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-5xl h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>PDF Preview</DialogTitle>
                </DialogHeader>
                <Document
                    file={url}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<p>Loading PDF...</p>}
                >
                    {Array.from(new Array(numPages), (_, i) => (
                        <Page key={i} pageNumber={i + 1} />
                    ))}
                </Document>
            </DialogContent>
        </Dialog>
    );
}