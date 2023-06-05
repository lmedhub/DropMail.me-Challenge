import { useEffect, useState } from "react";
import { Mail } from "@/types/mailTypes.d";

export default function useNotification(mails: Mail[]) {
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
