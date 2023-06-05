import { useEffect, useState } from "react";

export default function useNotification(mails) {
  const [prevMailCount, setPrevMailCount] = useState(0);

  useEffect(() => {
    if (
      mails.length > prevMailCount &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      if (!document.hidden) {
        return;
      }
      new Notification("Coodesh Mail!", {
        body: "Chegou um novo e-mail!",
      });
    }
    setPrevMailCount(mails.length);
  }, [mails, prevMailCount]);
}
