import { useEffect, useState } from "react";

interface IGrade {
  level: number;
}

export default function StrongLevel({ level }: IGrade) {
  const [grade, setGrade] = useState("normal");

  useEffect(() => {
    /* setGrade(
      level > 1
        ? level > 4
          ? level > 7
            ? "gold"
            : "silver"
          : "bronze"
        : "normal"
    ); */

    if (level > 7) {
      setGrade("gold");
    } else if (level > 4) {
      setGrade("silver");
    } else if (level > 1) {
      setGrade("bronze");
    } else {
      setGrade("normal");
    }
  }, [level]);

  return (
    <span
      className={`px-[10px] bg-grade-${grade} text-grade-${grade}-title font-bold`}
    >
      {level}
    </span>
  );
}
