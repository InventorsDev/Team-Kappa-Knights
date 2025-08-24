"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import caret from "@/public/SVGs/caret-down-svgrepo-com.svg";

interface prop {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
function Caret({ isOpen, setIsOpen }: prop) {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
      className="w-[30px] h-[30px] cursor-pointer flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Image src={caret} alt="caret" width={30} height={30} />
      </motion.div>
    </motion.div>
  );
}

export default Caret;
