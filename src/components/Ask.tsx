import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, ShieldAlert, Compass, Coffee, HelpCircle, Loader } from "lucide-react";
import { ChatMessage, UserRole } from "../types";

interface AskProps {
  userRole: UserRole;
  onSelectAction: (actionKey: string) => void;
  onClose?: () => void;
}

export default function Ask({ userRole, onSelectAction, onClose }: AskProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "model",
      text: `Hi, I’m STAI-C your personal chatbot here to assist you. How can I help?`,
      createdAt: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestionsByRole = {
    student: [
      { text: "Where do packages go & how do I label them?", icon: Compass, key: "packages" },
      { text: "What mandatory events are happening during NSO?", icon: HelpCircle, key: "nso" },
      { text: "How do dining meal plans work at Hill House?", icon: Coffee, key: "dining" },
    ],
    parent: [
      { text: "Are we ready? What should we do next?", icon: ShieldAlert, key: "readiness" },
      { text: "How do we configure PennPay authorized payers?", icon: HelpCircle, key: "pennpay" },
      { text: "Where do we find ID Cards on August 21st?", icon: Compass, key: "penncard" },
    ],
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: textToSend,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact STAI-C server");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          role: "model",
          text: data.text,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "model",
          text: "I encountered a slight connection delay while updating our STAI servers. You can try resending the message, or verify your internet settings.",
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown-style parsed formatter for rich rendering of bold/headers
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-base font-semibold text-gray-900 mt-3 mb-1">{line.replace("### ", "")}</h3>;
      }
      // Heading 2
      if (line.startsWith("## ")) {
        return <h4 key={idx} className="text-lg font-bold text-gray-900 mt-4 mb-2">{line.replace("## ", "")}</h4>;
      }
      // Bold text formatting
      let formattedLine: React.ReactNode = line;
      if (line.includes("**")) {
        const parts = line.split("**");
        formattedLine = parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-gray-950 font-semibold">{part}</strong> : part));
      }
      // Italic text formatting
      if (typeof formattedLine === "string" && formattedLine.includes("*")) {
        const parts = formattedLine.split("*");
        formattedLine = parts.map((part, i) => (i % 2 === 1 ? <em key={i} className="italic text-gray-700">{part}</em> : part));
      } else if (Array.isArray(formattedLine)) {
        // Handle array mapping recursively
        formattedLine = formattedLine.map((fPart) => {
          if (typeof fPart === "string" && fPart.includes("*")) {
            const subParts = fPart.split("*");
            return subParts.map((sp, si) => (si % 2 === 1 ? <em key={si} className="italic text-gray-700">{sp}</em> : sp));
          }
          return fPart;
        });
      }

      // Bullets
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <ul key={idx} className="list-disc pl-5 mt-1 text-sm text-gray-700">
            <li>{formattedLine}</li>
          </ul>
        );
      }

      // Checkboxes or numbers
      if (/^\d+\.\s/.test(line)) {
        return (
          <ol key={idx} className="list-decimal pl-5 mt-1 text-sm text-gray-700">
            <li>{formattedLine}</li>
          </ol>
        );
      }

      // Standard Paragraph
      return line.trim() ? <p key={idx} className="text-sm text-gray-700 leading-relaxed my-1.5">{formattedLine}</p> : <div key={idx} className="h-2" />;
    });
  };

  return (
    <div id="ask-experience" className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/55">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 tracking-tight text-sm">STAI-C Interaction Layer</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-medium px-1.5 py-0.5 rounded-full uppercase">v0.1</span>
            </div>
            <p className="text-xs text-gray-500">Student Transition Adaptive Intelligence Chatbot (Pronounced "Stacey")</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-405 bg-white border border-gray-100 font-mono px-2.5 py-1 rounded">
            Role: {userRole === "student" ? "Gabby (Student)" : "Adrian (Parent)"}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg cursor-pointer"
              title="Minimize/Close Chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-slate-50/20">
        {messages.map((msg) => {
          const isModel = msg.role === "model";
          return (
            <div key={msg.id} className={`flex gap-3.5 max-w-(--breakpoint-md) ${isModel ? "" : "flex-row-reverse ml-auto"}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                isModel 
                  ? "bg-slate-900 text-white border-slate-900" 
                  : userRole === "student"
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : "bg-teal-100 text-teal-700 border-teal-200"
              }`}>
                {isModel ? (
                  <span className="text-[10px] font-bold">ST</span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div className="flex flex-col max-w-[85%]">
                <div className={`px-4.5 py-3 rounded-2xl text-sm ${
                  isModel 
                    ? "bg-white border border-gray-150 shadow-xs text-gray-800" 
                    : userRole === "student"
                      ? "bg-purple-650 text-white rounded-tr-none"
                      : "bg-teal-650 text-white rounded-tr-none"
                }`}>
                  <div className={isModel ? "" : "text-white prose-invert selection:bg-teal-500"}>
                    {isModel ? renderMessageContent(msg.text) : <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                  </div>
                </div>
                <span className={`text-[10px] text-gray-400 mt-1 px-1 ${isModel ? "text-left" : "text-right"}`}>
                  {isModel ? "STAI-C" : userRole === "student" ? "Gabby" : "Adrian"} • {msg.createdAt}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white border border-slate-900 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold">ST</span>
            </div>
            <div className="flex flex-col">
              <div className="bg-white border border-gray-150 shadow-xs px-4.5 py-3 rounded-2xl flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin text-slate-650" />
                <span className="text-xs text-gray-500 font-medium">STAI-C is checking transition documentation...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Access Prompt Suggestions */}
      <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100">
        <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase block mb-2">
          Suggestions for {userRole === "student" ? "Gabby" : "Adrian"}
        </span>
        <div className="flex flex-wrap gap-2">
          {quickQuestionsByRole[userRole].map((q, idx) => {
            const IconComponent = q.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(q.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200/80 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 transition duration-150 text-left"
              >
                <IconComponent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{q.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 bg-white border-t border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask STAI-C (e.g. "Where do packages go?" or "What should we do next?")`}
          className="flex-1 bg-slate-50 border border-gray-200 focus:border-slate-350 focus:bg-white text-sm px-4 py-2.5 rounded-xl outline-hidden text-gray-800 transition placeholder:text-gray-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl transition ${
            !input.trim() || loading
              ? "bg-gray-100 text-gray-350 cursor-not-allowed"
              : userRole === "student"
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
