import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import ContextViewer from "./ContextViewer";

type Props = {
    role: "user" | "ai";
    text: string;
    docs?: { pageContent: string; metadata?: any }[];
};

export function ChatBubble({ role, text, docs }: Props) {
    const isUser = role === "user";
    const isThinking = role === "ai" && text.trim().toLowerCase() === "ai is thinking...";
    const lines = text.split("\n").filter(Boolean);

    return (
        <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"} px-1`}>
            <div className="flex gap-2 items-start max-w-full">
                {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm">
                        🐾
                    </div>
                )}

                <div
                    className={`inline-block max-w-[90%] p-3 text-sm whitespace-pre-wrap rounded-xl ${isUser
                        ? "bg-[var(--chat-user-bg)] text-[var(--chat-user-text)]"
                        : "bg-[var(--chat-ai-bg)] text-[var(--chat-ai-text)] border border-muted"
                        }`}
                >
                    {isThinking ? (
                        <div className="flex gap-1 items-center">
                            <span>AI is thinking</span>
                            <motion.span
                                className="inline-block"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                ...
                            </motion.span>
                        </div>
                    ) : isUser ? (
                        text
                    ) : (
                        <>
                            {lines.map((line, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                >
                                    <ReactMarkdown
                                        components={{
                                            code: ({ children }) => (
                                                <code className="bg-muted px-1 py-0.5 rounded text-[0.875em]">
                                                    {children}
                                                </code>
                                            ),
                                        }}
                                    >
                                        {line}
                                    </ReactMarkdown>
                                </motion.div>
                            ))}

                            {docs && <ContextViewer docs={docs} />}
                        </>
                    )}
                </div>

                {isUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                        😺
                    </div>
                )}
            </div>
        </div>
    );
}
