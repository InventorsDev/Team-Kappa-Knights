import React from "react";
import XPBar from "./XPBar";
interface Subtitle {
  title: string;
  link: string;
  sequence: number; // order in which it should be taken
  completedStatus: boolean;
}

// Interface for each course
interface Course {
  title: string;
  subtitles: Subtitle[];
}
function SkillTree(data: Course) {
  return <div>yo</div>;
}

export default SkillTree;
