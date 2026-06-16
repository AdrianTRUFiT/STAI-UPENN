import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Loader, Paperclip, Mic, MicOff, AlertCircle } from "lucide-react";
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
      text: `Hi Gabby — welcome to STAI@PENN. I’m STAI-C, pronounced “Stacey,” your Penn transition concierge. Ask me anything about UPenn move-in dates, packing lists, checklist clearances, or finances!`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
      }
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [isRecording]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() && !selectedFile) return;

    let textWithAttachment = textToSend;
    if (selectedFile) {
      textWithAttachment = `[Attached: ${selectedFile}] ${textToSend}`;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: textWithAttachment || `Uploaded attachment: ${selectedFile}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stopped
      setIsRecording(false);
      setInput((prev) => (prev ? prev + " [Voice Note Captured]" : "Please summarize current checklist clearances."));
    } else {
      setIsRecording(true);
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
    <div id="ask-experience" className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#011F5B] border-b border-blue-900 px-6 py-5 flex items-center justify-between relative shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-amber-300 border border-white/15 shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-base font-sans">Ask STAI-C</span>
              <span className="text-[9px] bg-[#990000] text-red-100 font-bold px-2 py-0.5 rounded border border-red-800/20 uppercase tracking-widest">
                AI Copilot
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5 font-sans font-medium">Logistical & Transition Guide</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-white/80 hover:text-white transition hover:bg-white/10 rounded-full cursor-pointer h-9 w-9 flex items-center justify-center text-lg font-bold"
              title="Close Chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area with Subtle Contrast Gradient Backdrop */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-slate-50 via-white to-blue-50/25">
        {messages.map((msg) => {
          const isModel = msg.role === "model";
          return (
            <div key={msg.id} className={`flex gap-3.5 max-w-(--breakpoint-md) ${isModel ? "" : "flex-row-reverse ml-auto"}`}>
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm transition-all duration-150 ${
                isModel 
                  ? "bg-[#011F5B] text-white border-blue-950" 
                  : userRole === "student"
                    ? "bg-[#011F5B] text-white border-blue-950"
                    : "bg-[#990000] text-white border-red-955"
              }`}>
                {isModel ? (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Bubble */}
              <div className="flex flex-col max-w-[85%]">
                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-3xs transition-shadow duration-150 ${
                  isModel 
                    ? "bg-white border-l-4 border-l-[#011F5B] border-t border-r border-b border-slate-200/90 shadow-xs text-slate-800 rounded-tl-none" 
                    : userRole === "student"
                      ? "bg-gradient-to-br from-[#011F5B] to-blue-800 text-white shadow-md border border-slate-900 rounded-tr-none"
                      : "bg-gradient-to-br from-[#990000] to-red-900 text-white shadow-md border-red-955 rounded-tr-none"
                }`}>
                  <div className={isModel ? "" : "text-white prose-invert selection:bg-amber-400/30 font-medium"}>
                    {isModel ? renderMessageContent(msg.text) : <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                  </div>
                </div>
                <span className={`text-[10px] text-slate-400 mt-1 px-1.5 font-sans font-medium ${isModel ? "text-left" : "text-right"}`}>
                  {isModel ? "STAI-C" : userRole === "student" ? "Gabby (Student)" : "Adrian (Parent)"} • {msg.createdAt}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3.5 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-[#011F5B] border border-blue-950 flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <div className="flex flex-col">
              <div className="bg-white border-l-4 border-l-amber-400 border-t border-r border-b border-slate-200 shadow-3xs px-5 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader className="w-4 h-4 animate-spin text-[#011F5B]" />
                <span className="text-xs text-slate-650 font-bold font-sans">STAI-C is analyzing UPenn guidelines...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording indicator when microphone is activated */}
      {isRecording && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-200 text-red-700 text-xs font-bold font-sans flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-650 rounded-full animate-ping" />
            <span>Speaking into STAI Mic... {recordingSeconds}s elapsed</span>
          </div>
          <button 
            type="button" 
            onClick={() => setIsRecording(false)} 
            className="text-[10px] uppercase font-bold bg-white text-red-700 border border-red-300 px-2 py-0.5 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Selected File Badge */}
      {selectedFile && (
        <div className="px-6 py-2 bg-emerald-50 border-t border-emerald-200 text-emerald-800 text-xs font-bold font-mono flex items-center justify-between">
          <span className="truncate">Attached: {selectedFile}</span>
          <button 
            type="button" 
            onClick={() => setSelectedFile(null)} 
            className="text-red-650 font-sans font-bold text-[10px] uppercase hover:underline"
          >
            Remove file
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        id="stai-file-attachment"
      />

      {/* Input Form with High Contrast Highlight Grid */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-5 bg-white border-t border-slate-200 flex items-center gap-3 relative shadow-sm"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#011F5B] via-[#990000] to-[#011F5B]" />
        
        {/* Attachment Pin Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-550 hover:bg-slate-100/80 active:scale-95 transition-all duration-155 cursor-pointer shadow-3xs"
          title="Add photo or document attachment"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Microphone Voice Button */}
        <button
          type="button"
          onClick={toggleRecording}
          className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border transition-all duration-155 cursor-pointer shadow-3xs ${
            isRecording 
              ? "bg-red-100 border-red-300 text-red-700 animate-pulse" 
              : "bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100/80 active:scale-95"
          }`}
          title="Use microphone to transcribe voice"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRecording ? "Transcribing voice request..." : "Ask STAI-C anything about dates, deadlines, or transition task details..."}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#011F5B] focus:bg-white text-sm px-4.5 py-3 rounded-xl outline-hidden text-slate-800 transition duration-150 placeholder:text-slate-400 focus:ring-2 focus:ring-[#011F5B]/10"
          disabled={loading || isRecording}
        />
        
        <button
          type="submit"
          disabled={(!input.trim() && !selectedFile) || loading}
          className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-xl shadow-xs transition duration-150 ${
            (!input.trim() && !selectedFile) || loading
              ? "bg-slate-100 text-slate-350 cursor-not-allowed border border-slate-200"
              : userRole === "student"
                ? "bg-[#011F5B] text-white hover:bg-blue-850 hover:scale-[1.03] active:scale-95 cursor-pointer"
                : "bg-[#990000] text-white hover:bg-red-850 hover:scale-[1.03] active:scale-95 cursor-pointer"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
