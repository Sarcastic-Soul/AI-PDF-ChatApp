// tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
        extend: {
            borderRadius: {
                sm: "calc(var(--radius) - 4px)",
                md: "calc(var(--radius) - 2px)",
                lg: "var(--radius)",
                xl: "calc(var(--radius) + 4px)",
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                "primary-foreground": "var(--primary-foreground)",
                muted: "var(--muted)",
                "muted-foreground": "var(--muted-foreground)",
                "chat-user-bg": "var(--chat-user-bg)",
                "chat-user-text": "var(--chat-user-text)",
                "chat-ai-bg": "var(--chat-ai-bg)",
                "chat-ai-text": "var(--chat-ai-text)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
                mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [require("tw-animate-css")],
};
