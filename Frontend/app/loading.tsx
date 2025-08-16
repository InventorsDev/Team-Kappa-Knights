// import { Loader } from "lucide-react";
import Loader from "@/components/common/loader/Loader";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
}
