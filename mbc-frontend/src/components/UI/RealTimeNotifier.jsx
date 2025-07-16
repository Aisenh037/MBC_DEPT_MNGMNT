// src/components/UI/RealTimeNotifier.jsx
import { useEffect } from "react";
import { useNotify } from "./NotificationProvider";
import { io } from "socket.io-client";

export default function RealTimeNotifier() {
  const notify = useNotify();

  useEffect(() => {
    const socket = io("http://localhost:5000"); // your server url
    socket.on("notice", (notice) => {
      notify(`New Notice: ${notice.title}`, "info");
    });
    // Add more events as needed
    return () => socket.disconnect();
  }, [notify]);

  return null;
}
