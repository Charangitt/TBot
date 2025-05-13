import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const chat = async (userMessage) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const json = await response.json();
      console.log("Backend response:", json);

      if (!json.messages || !Array.isArray(json.messages)) {
        console.error("Unexpected response format:", json);
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, ...json.messages]);
    } catch (error) {
      console.error("Chat request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((prev) => prev.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
