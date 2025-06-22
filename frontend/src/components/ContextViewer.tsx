import React from "react";

type ContextViewerProps = {
    docs: { pageContent: string; metadata?: any }[];
};

export default function ContextViewer({ docs }: ContextViewerProps) {
    if (!docs || docs.length === 0) return null;

    return (
        <details className="mt-2 text-xs text-muted-foreground">
            <summary className="cursor-pointer underline">View source context</summary>
            <ul className="mt-1 list-disc pl-4 space-y-2">
                {docs.map((doc, i) => {
                    const fileName = doc?.metadata?.source?.split("/")?.pop();
                    const pageNumber = doc?.metadata?.loc?.pageNumber;

                    return (
                        <li key={i} className="bg-muted p-2 rounded">
                            <pre className="whitespace-pre-wrap max-h-48 overflow-auto">
                                {doc.pageContent.slice(0, 500)}...
                            </pre>
                            <div className="mt-1 text-[10px] text-muted-foreground">
                                {fileName && <>📄 <strong>{fileName}</strong></>}
                                {pageNumber && <> — Page <strong>{pageNumber}</strong></>}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </details>
    );
}
