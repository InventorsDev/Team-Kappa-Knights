import { useCounterStore } from "@/state/store";
import React from "react";

interface Props {
  count: number;
}

function OtherComponent({ count }: Props) {
  const increment = useCounterStore((state) => state.incrementAsync);
  const decrement = useCounterStore((state) => state.decrement);
  return (
    <div className="h-screen flex items-center justify-center text-3xl">
      <div className="flex flex-col gap-2 w-[300px]">
        <button
          className="border  rounded-lg bg-amber-200 p-2"
          onClick={increment}
        >
          Increment
        </button>
        <p className="text-center">Count: {count}</p>
        <button
          className="border rounded-lg bg-amber-200 p-2"
          onClick={decrement}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}

export default OtherComponent;
