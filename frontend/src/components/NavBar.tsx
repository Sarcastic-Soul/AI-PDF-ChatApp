"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ModeToggle";
import { PdfUploader } from "@/components/PdfUploader";
import React from "react";

function NavBar({ onUpload }: { onUpload: () => void }) {
    return (
        <header className="w-full bg-background text-foreground shadow border-b border-muted">
            <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-bold tracking-tight text-foreground">
                    🧾 CatChat PDF
                </h1>
                <div className="flex items-center gap-2">
                    <PdfUploader onUpload={onUpload} />
                    <ModeToggle />
                    <UserButton />
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
