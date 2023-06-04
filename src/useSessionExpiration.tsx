import React, { useEffect } from "react";

interface ExpirationProps {
  clearSession: () => void;
  setSessionID: (sessionID: string) => void;
}

export default function useSessionExpiration({
  setSessionID,
  clearSession,
}: ExpirationProps): void {
  useEffect(() => {
    const storedSessionID = localStorage.getItem("sessionID");
    const storedExpiration = localStorage.getItem("expiration");

    if (storedSessionID && storedExpiration) {
      const expiration = parseInt(storedExpiration);
      const currentTime = new Date().getTime();
      if (expiration > currentTime) {
        setSessionID(storedSessionID);
      } else {
        clearSession();
      }
    }
  }, [setSessionID, clearSession]);
}
