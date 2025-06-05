"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, MessageCircle, X } from "lucide-react";

import msgWithLink from "@/app/api/chat/lib/convertTextToTag";
import { callGeminiAPI } from "@/services/Backend-api/gemini-service";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào! Tôi là OC. Tôi có thể giúp gì cho bạn hôm nay?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await callGeminiAPI(input);
      console.log(res);
      const data = await res;
      const botMsg: Message = {
        sender: "bot",
        text: data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        sender: "bot",
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          onClick={toggleChat}
          className="relative w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-end p-6">
          <div className="absolute inset-0 " onClick={toggleChat}></div>

          <div className="relative w-96 h-[500px] mb-8 mr-8">
            <Card className="w-full h-full shadow-2xl border-0 overflow-hidden p-0">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 bg-white bg-opacity-20">
                      <AvatarFallback className="text-white bg-transparent">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm mt-1">
                        Open Course Assistant
                      </h3>
                      <p className="text-xs opacity-90">
                        {isLoading ? "Đang nhập..." : "Trực tuyến"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleChat}
                    className="h-8 w-8 p-0 text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 h-full flex flex-col overflow-auto">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start space-x-2 ${
                        msg.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback
                          className={
                            msg.sender === "user"
                              ? "bg-blue-500 text-white text-xs"
                              : "bg-gray-300 text-gray-600 text-xs"
                          }
                        >
                          {msg.sender === "user" ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Bot className="h-3 w-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[75%] ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-2 rounded-lg text-sm ${
                            msg.sender === "user"
                              ? "bg-blue-500 text-white rounded-br-sm"
                              : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                          }`}
                        >
                          {msg.text.includes(
                            "http://localhost:3000/course/"
                          ) ? (
                            msgWithLink(msg.text)
                          ) : (
                            <p className="leading-relaxed">{msg.text}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 px-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 rounded-lg rounded-bl-sm p-2 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t bg-white p-3">
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full px-3 py-1 text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
