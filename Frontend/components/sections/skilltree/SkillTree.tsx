"use client";
import React, { useState } from "react";
import Caret from "@/components/common/caret/Caret";
import Image from "next/image";
import Link from "next/link";
import completedArrow from "@/public/SVGs/completed-arrow.svg";
import uncompletedArrow from "@/public/SVGs/uncompleted-arrow.svg";
import locked from "@/public/SVGs/locked.svg";
import completedIcon from "@/public/SVGs/completed.svg";
import inProgress from "@/public/SVGs/in-progress.svg";
import { motion, AnimatePresence } from "framer-motion";

// Interface for each subtitle
interface Subtitle {
  title: string;
  link: string;
  sequence: number; // order in which it should be taken
  status: "completed" | "in-progress" | "not-started";
}

// Interface for each course
interface Course {
  title: string;
  subtitles: Subtitle[];
}

interface SkillTreeProps {
  data: Course;
  completed: number;
  total: number;
}

function SkillTree({ data, completed, total }: SkillTreeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const progress = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
  return (
    <div className="border border-[#CCCCCCCC] p-2 rounded-[16px]">
      <div
        className="flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>{data.title}</div>
        <Caret isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      {!isOpen && (
        <div className="flex items-center gap-2">
          <div className=" my-2 h-[6px] w-full bg-[#ebfffc] rounded-lg overflow-hidden">
            <div
              className="h-full bg-[#00bfa5] rounded-lg "
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="w-10px">{progress}%</div>
        </div>
      )}

      {/* subtitles */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col gap-2 py-4 max-h-[500px] overflow-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {data.subtitles.map((subtitle, index) => (
              <div
                key={index}
                className={
                  subtitle.status === "completed"
                    ? "text-white"
                    : "text-[#212121]"
                }
              >
                <Link
                  href={subtitle.status !== "not-started" ? subtitle.link : ""}
                >
                  <article
                    className={`rounded-[16px] text-center font-semibold py-4 flex flex-col gap-2 ${
                      subtitle.status === "completed"
                        ? "bg-[#00BFA5]"
                        : subtitle.status === "in-progress"
                        ? "bg-[#EBFFFC]"
                        : "bg-[#F5F5F5]"
                    }`}
                  >
                    <div
                      className={`w-[24px] h-[24px] m-auto p-1 flex items-center justify-center rounded-[5px] ${
                        subtitle.status === "completed"
                          ? "bg-[#2d9183]"
                          : subtitle.status === "in-progress"
                          ? "bg-[#c3fff6]"
                          : "bg-[#dadada]"
                      }`}
                    >
                      <Image
                        src={
                          subtitle.status === "completed"
                            ? completedIcon
                            : subtitle.status === "in-progress"
                            ? inProgress
                            : locked
                        }
                        width={20}
                        height={20}
                        alt="status"
                      />
                    </div>
                    <p>{subtitle.title}</p>
                    <p className="text-[14px]">Level: {subtitle.sequence}</p>
                  </article>
                </Link>

                {subtitle.sequence !== total && (
                  <Image
                    src={
                      subtitle.status === "completed"
                        ? completedArrow
                        : uncompletedArrow
                    }
                    width={20}
                    height={20}
                    alt="arrow"
                    className="m-auto"
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SkillTree;
