// app/admin/problems/page.tsx
"use client";

import React, { useState } from "react";
import AdminOnly from "@/components/AdminOnly";

export default function AdminProblemsPage() {
  return (
    <AdminOnly>
      <AdminForm />
    </AdminOnly>
  );
}

function AdminForm() {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [solution, setSolution] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, question, answer, hint, solution, subject, difficulty }),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.error || "등록 실패");
      } else {
        setMessage("문제 등록 성공!");
        // 초기화
        setTitle("");
        setQuestion("");
        setAnswer("");
        setHint("");
        setSolution("");
      }
    } catch (err) {
      console.error(err);
      setMessage("네트워크 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>관리자 - 문제 등록</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 800 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="제목" />
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} required placeholder="문제(텍스트)" rows={6} />
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} required placeholder="정답(비교용 문자열)" />
        <input value={hint} onChange={(e) => setHint(e.target.value)} placeholder="힌트" />
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="해설" rows={4} />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="과목" />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <div>
          <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
            {loading ? "등록 중..." : "문제 등록"}
          </button>
        </div>
      </form>

      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </main>
  );
}
