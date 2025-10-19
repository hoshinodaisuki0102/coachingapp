"use client";

import { useState } from "react";

interface Problem {
  question_text: string;
  question_img: string;
  answer: string;
  hint: string;
  explanation: string;
}

export default function AdminPage() {
  const [category, setCategory] = useState("");
  const [problems, setProblems] = useState<Problem[]>([
    { question_text: "", question_img: "", answer: "", hint: "", explanation: "" },
  ]);
  const [status, setStatus] = useState("");

  const handleProblemChange = (index: number, field: keyof Problem, value: string) => {
    const updated = [...problems];
    updated[index][field] = value;
    setProblems(updated);
  };

  const addProblem = () => {
    setProblems([...problems, { question_text: "", question_img: "", answer: "", hint: "", explanation: "" }]);
  };

  const removeProblem = (index: number) => {
    const updated = problems.filter((_, i) => i !== index);
    setProblems(updated);
  };

  const handleSubmit = async () => {
    if (!category) {
      setStatus("카테고리 이름을 입력해주세요!");
      return;
    }

    try {
      const res = await fetch("/api/attempts/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, problems }),
      });

      const data = await res.json();

      if (!data.success) {
        setStatus("문제 등록 실패: " + data.error);
      } else {
        setStatus("문제 등록 성공!");
        setCategory("");
        setProblems([{ question_text: "", question_img: "", answer: "", hint: "", explanation: "" }]);
      }
    } catch (err: any) {
      setStatus("문제 등록 중 오류 발생: " + err.message);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>문제 등록 페이지</h1>

      <input
        placeholder="주차/카테고리 이름 예: 삼각비 1주차"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", fontSize: "1rem" }}
      />

      {problems.map((p, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>문제 {idx + 1}</h2>

          <textarea
            placeholder="문제 내용"
            value={p.question_text}
            onChange={(e) => handleProblemChange(idx, "question_text", e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />

          <input
            placeholder="이미지 URL (선택)"
            value={p.question_img}
            onChange={(e) => handleProblemChange(idx, "question_img", e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />

          <input
            placeholder="정답"
            value={p.answer}
            onChange={(e) => handleProblemChange(idx, "answer", e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />

          <input
            placeholder="힌트 (선택)"
            value={p.hint}
            onChange={(e) => handleProblemChange(idx, "hint", e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />

          <input
            placeholder="해설 (선택)"
            value={p.explanation}
            onChange={(e) => handleProblemChange(idx, "explanation", e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />

          {problems.length > 1 && (
            <button onClick={() => removeProblem(idx)} style={{ marginTop: "0.5rem", color: "red" }}>
              문제 삭제
            </button>
          )}
        </div>
      ))}

      <button onClick={addProblem} style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}>
        문제 추가
      </button>

      <button
        onClick={handleSubmit}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}
      >
        등록
      </button>

      {status && <p style={{ marginTop: "1rem", color: status.includes("성공") ? "green" : "red" }}>{status}</p>}
    </main>
  );
}
