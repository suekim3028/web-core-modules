"use client";
import { useEffect } from "react";
import { interval, take } from "rxjs";

export const useSecondEffect = (
  seconds: number,
  effect: (times: number) => void
) => {
  useEffect(() => {
    const numbers = interval(1000);
    numbers.pipe(take(seconds)).subscribe(effect);
  }, []);
};
