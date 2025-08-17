"use client";
import { useCounterStore } from "@/state/store";
import OtherComponent from "./OtherComponent";
import { useEffect } from "react";
const logCount = () => {
  useCounterStore.setState({ count: 10 }); // used for when it is outside a component so it works even though it is a custom hook
  // console.log(count);
};

function Page() {
  const count = useCounterStore((state) => state.count);

  useEffect(() => {
    logCount();
  }, []);

  return (
    <div>
      <OtherComponent count={count} />
    </div>
  );
}

export default Page;
