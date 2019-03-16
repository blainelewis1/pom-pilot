import { useRef, useEffect } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  const lastRun = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      let timeNow = Date.now();
      savedCallback.current(timeNow - lastRun.current);
      lastRun.current = timeNow;
    }
    if (delay !== null) {
      lastRun.current = Date.now();
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useShortcut(matches, action) {
  const savedMatches = useRef();
  const savedAction = useRef();

  useEffect(() => {
    savedMatches.current = matches;
    savedAction.current = action;
  });

  useEffect(() => {
    function test(e) {
      if (savedMatches.current(e)) {
        savedAction.current();
      }
    }

    window.addEventListener("keydown", test);
    return () => window.removeEventListener("keydown", test);
  });
}
