import { useEffect, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../App";

export default function useUsageTracker() {

  const sessionStart = useRef(Date.now());
  const isTabActive = useRef(true);
  const isIdle = useRef(false);
  const idleTimer = useRef(null);
  const lastAlertTime = useRef(0);

  const TAB_KEY = "active_usage_tab";

  useEffect(() => {

    // ----- TAB LEADER CHECK -----
    const isLeader = () => {
      const current = localStorage.getItem(TAB_KEY);

      if (!current) {
        localStorage.setItem(TAB_KEY, Date.now().toString());
        return true;
      }

      return current === tabId;
    };

    const tabId = Date.now().toString();
    localStorage.setItem(TAB_KEY, tabId);

    const sendUsage = async () => {

      if (!isLeader()) return;

      const now = Date.now();
      const diff = now - sessionStart.current;

      const minutes = Math.floor(diff / 60000);

      if (minutes < 1) return;

      try {

        const res = await axios.post(
          `${serverUrl}/api/usage/update`,
          { minutes },
          { withCredentials: true }
        );

        const usage = res.data.continuousUsageMinutes;

        // ---- ALERT COOLDOWN (10 MIN) ----
        if (usage > 120) {
          const nowTime = Date.now();

          if (nowTime - lastAlertTime.current > 10 * 60 * 1000) {
            alert("You have been studying for 2 hours. Take a short break!");
            lastAlertTime.current = nowTime;
          }
        }

        sessionStart.current = Date.now();

      } catch (err) {
        console.error("usage tracking failed", err);
      }
    };

    // ----- TAB VISIBILITY -----
    const handleVisibility = () => {

      if (document.hidden) {

        sendUsage();
        isTabActive.current = false;

      } else {

        sessionStart.current = Date.now();
        isTabActive.current = true;

      }

    };

    document.addEventListener("visibilitychange", handleVisibility);

    // ----- IDLE DETECTION -----
    const resetIdleTimer = () => {

      if (isIdle.current) {
        sessionStart.current = Date.now();
      }

      isIdle.current = false;

      clearTimeout(idleTimer.current);

      idleTimer.current = setTimeout(() => {

        isIdle.current = true;
        sendUsage();

      }, 5 * 60 * 1000);

    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);

    resetIdleTimer();

    // ----- PERIODIC SAVE (5 MIN) -----
    const interval = setInterval(() => {

      if (!isLeader()) return;
      if (!isTabActive.current) return;
      if (isIdle.current) return;

      sendUsage();

    }, 5 * 60 * 1000);

    return () => {

      sendUsage();

      clearInterval(interval);

      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);

    };

  }, []);
}