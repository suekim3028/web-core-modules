"use client";

import { useEffect, useRef } from "react";
import { interval, take } from "rxjs";

export const useSecondEffect = (
  seconds: number,
  effect: (times: number) => void
) => {
  const started = useRef(false);
  useEffect(() => {
    if (!started.current) {
      started.current = true;

      const numbers = interval(1000);
      numbers.pipe(take(seconds)).subscribe(effect);
    }
  }, []);
};
export const useEverySecondEffect = (effect: (now: Date) => void) => {
  useEffect(() => {
    const source = interval(1000);
    const subscribe = source.subscribe(() => effect(new Date()));

    return () => {
      subscribe.unsubscribe();
    };
  }, [effect]);
};
