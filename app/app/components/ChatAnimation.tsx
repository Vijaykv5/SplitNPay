"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

interface Message {
  id: number;
  text: string;
  time: string;
  sender: "user" | "other";
}

const messages: Message[] = [
  { id: 1, text: "Let's go on a vacation?", time: "11:31 AM", sender: "user" },
  { id: 2, text: "I'm down! Any ideas??", time: "11:33 AM", sender: "other" },
  {
    id: 3,
    text: "What about Goa? I'll call others too",
    time: "11:35 AM",
    sender: "user",
  },
  {
    id: 4,
    text: "Fix the budget and share equally in splitnpay.xyz",
    time: "11:37 AM",
    sender: "other",
  },
  { id: 5, text: "Done :)", time: "11:38 AM", sender: "user" },
];

export function ChatAnimation() {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4  rounded-xl">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.5,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex flex-col gap-1 max-w-[80%] p-3 rounded-2xl shadow-md ${
                message.sender === "user"
                  ? "bg-[#3B82F6] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.id === 4 ? (
                <p>
                  Fix the budget and share equally in{" "}
                  <Link
                    href="https://splitnpay.xyz"
                    className="text-blue-500 underline"
                  >
                    splitnpay.xyz
                  </Link>
                </p>
              ) : (
                <p>{message.text}</p>
              )}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">{message.time}</span>
                {message.sender === "user" && (
                  <div className="flex -space-x-1">
                    <Check className="h-3 w-3" />
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
