"use client";

import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Ghost, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
    return (
            <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background text-foreground">
                <div className="max-w-xl space-y-6">
                    <div className="flex justify-center">
                        <Ghost className="w-12 h-12 text-pink-500 dark:text-pink-400" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        📄 Chat with your PDFs
                    </h1>

                    <p className="text-muted-foreground text-base">
                        Upload large PDFs and ask questions directly from them.
                        Our AI reads it for you — so you don't have to.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <SignInButton mode="modal">
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Create Account
                            </Button>
                        </SignUpButton>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Powered by OpenRouter + Qdrant + LangChain + Clerk
                    </p>
                </div>

                <footer className="absolute bottom-6 text-xs text-muted-foreground">
                    Made with 🦴 by <Link href="https://github.com/Sarcastic-Soul" className="underline">Anish</Link>
                </footer>
            </main>
    );
}
