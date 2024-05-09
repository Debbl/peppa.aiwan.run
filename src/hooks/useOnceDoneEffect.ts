import { useEffect, useRef } from "react";

const useOnceDoneEffect = (
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) => {
  const isRun = useRef(false);

  useEffect(() => {
    if (!isRun.current) {
      effect();
    }

    const isDone = deps?.every((dep) => !!dep);
    if (isDone) {
      isRun.current = true;
    }
  }, deps);
};

export { useOnceDoneEffect };
