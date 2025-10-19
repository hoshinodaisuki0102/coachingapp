"use client";

import { useEffect, useState } from "react";

interface Problem {
  id: number;
  category: string;
  question_no: number;
  question_text: string;
  question_img: string | null;
  answer: string;
  hint: string | null;
  explanation: string | null;
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`/api/problems/${params.id}`);
      const data = await res.json();
      if (data.success) setProblem(data.data);
      else setMessage(data.error || "문제를 불러올 수 없습니다.");
    };
    fetchProblem();
  }, [params.id]);

  const checkAnswer = () => {
    if (!problem) return;
    if (answer.trim() === problem.answer.trim()) {
      setMessage("정답입니다! 🎉");
      setShowSolution(true);
    } else {
      setMessage("틀렸어요 😢 힌트를 확인해보세요!");
      setShowHint(true);
    }
  };

  if (!problem) {
    return (
      <main className="p-8 text-center">
        <h2 className="text-2xl font-semibold">{message || "로딩 중..."}</h2>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">
        {problem.category} - 문제 {problem.question_no}
      </h1>

      <p className="text-lg whitespace-pre-wrap mb-4">{problem.question_text}</p>

      {problem.question_img && (
        <img
          src={problem.question_img}
          alt="문제 이미지"
          className="rounded-lg shadow-md mb-4"
        />
      )}

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="정답을 입력하세요"
        className="border border-gray-400 rounded-lg p-2 w-full mb-3"
      />
      <button
        onClick={checkAnswer}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        제출
      </button>

      {message && <p className="mt-3 text-lg">{message}</p>}

      {showHint && problem.hint && (
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <strong>힌트 💡</strong>
          <p>{problem.hint}</p>
        </div>
      )}

      {showSolution && problem.explanation && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <strong>해설 📘</strong>
          <p className="whitespace-pre-wrap">{problem.explanation}</p>
        </div>
      )}
    </main>
  );
}
