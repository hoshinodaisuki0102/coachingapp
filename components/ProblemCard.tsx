// components/ProblemCard.tsx
"use client";

import React from "react";
import Link from "next/link";

type Props = {
  problem: {
    id: number;
    title: string;
    subject?: string;
    difficulty?: string;
    accuracy?: number | null;
  };
};

export default function ProblemCard({ problem }: Props) {
  return (
    <article style={{
      border: "1px solid #e2e8f0",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      background: "#fff"
    }}>
      <h3 style={{ margin: "0 0 6px 0" }}>{problem.title}</h3>
      <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
        {problem.subject ? <span>{problem.subject} · </span> : null}
        {problem.difficulty ? <span>{problem.difficulty}</span> : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/problems/${problem.id}`}>
          <a style={{ textDecoration: "none", color: "#0066ff" }}>문제 풀기 →</a>
        </Link>
        <div style={{ fontSize: 13, color: "#333" }}>
          정확률: {problem.accuracy ? `${Number(problem.accuracy).toFixed(1)}%` : "0%"}
        </div>
      </div>
    </article>
  );
}
