// components/AttemptWidget.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  problem: {
    id: number;
    question: string;
    hint?: string | null;
    solution?: string | null;
  };
};

export default function AttemptWidget({ problem }: Props) {
  const [answer, setAnswer] = useState("");
  const [attemptNum, setAttemptNum] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);

  const getUserId = async (): Promise<string | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  };

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedback(null);
    setDisabled(true);
    try {
      const user_id = await getUserId();
      if (!user_id) {
        setFeedback("로그인이 필요합니다. 먼저 로그인하세요.");
        setDisabled(false);
        return;
      }

      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          problem_id: problem.id,
          attempt_num: attemptNum,
          user_answer: answer,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setFeedback(data.error || "서버 오류");
      } else {
        if (data.isCorrect) {
          setFeedback(data.message || "정답입니다!");
          setSolution(data.solution ?? problem.solution ?? null);
        } else {
          // 오답 처리
          if (attemptNum === 1) {
            setHint(data.hint ?? problem.hint ?? "힌트가 없습니다.");
            setFeedback(data.message ?? "틀렸습니다. 힌트를 확인하세요.");
            setAttemptNum(2);
          } else {
            setSolution(data.solution ?? problem.solution ?? "해설이 없습니다.");
            setFeedback(data.message ?? "두 번째도 틀렸습니다.");
            setDisabled(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setFeedback("네트워크 오류");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <section style={{ marginTop: 12 }}>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <label>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>정답 입력</div>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ padding: 10, fontSize: 16, width: "100%" }}
            disabled={disabled}
            required
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={disabled} style={{ padding: "8px 12px" }}>
            제출 ({attemptNum}차)
          </button>
        </div>
      </form>

      {feedback && <div style={{ marginTop: 12, background: "#f3f4f6", padding: 10 }}>{feedback}</div>}
      {hint && (
        <div style={{ marginTop: 12, background: "#fff7ed", padding: 10, borderRadius: 6 }}>
          <strong>힌트</strong>
          <div style={{ marginTop: 8 }}>{hint}</div>
        </div>
      )}
      {solution && (
        <div style={{ marginTop: 12, background: "#ecfdf5", padding: 10, borderRadius: 6 }}>
          <strong>해설</strong>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{solution}</div>
        </div>
      )}
    </section>
  );
}
