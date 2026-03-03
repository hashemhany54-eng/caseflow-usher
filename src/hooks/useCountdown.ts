import { useEffect, useState } from "react";

export function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isOverdue, setIsOverdue] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        const absDiff = Math.abs(diff);
        const h = Math.floor(absDiff / 3600000);
        const m = Math.floor((absDiff % 3600000) / 60000);
        setTimeLeft(`${h}h ${m}m overdue`);
        setIsOverdue(true);
        setIsUrgent(false);
      } else if (diff < 3600000) {
        const m = Math.floor(diff / 60000);
        setTimeLeft(`${m}m left`);
        setIsOverdue(false);
        setIsUrgent(true);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setTimeLeft(`${h}h ${m}m left`);
        setIsOverdue(false);
        setIsUrgent(false);
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, isOverdue, isUrgent };
}
