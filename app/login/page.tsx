// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // 옵션: 페이지 로드 시 URL에 세션 토큰이 있으면 처리 (Supabase가 자동으로 처리하기도 함)
    // 현재는 특별한 처리를 하지 않음 — 필요 시 여기에서 리다이렉트 처리 추가 가능
  }, []);

  const sendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("유효한 이메일 주소를 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      // emailRedirectTo: 사용자가 메일에서 클릭했을 때 돌아올 URL
      const redirectTo = `${window.location.origin}/`; // 로그인 후 홈으로 돌아오게
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        console.error("Magic link error:", error);
        setMessage("매직 링크 전송 중 오류가 발생했습니다. 콘솔을 확인하세요.");
      } else {
        setMessage("메일로 매직 링크를 보냈습니다. 메일에서 링크를 클릭해 로그인하세요.");
      }
    } catch (err) {
      console.error(err);
      setMessage("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 720, margin: "0 auto" }}>
      <h1>로그인</h1>
      <p>회원 이메일로 매직 링크를 보내드립니다. 메일에서 링크를 클릭하면 로그인됩니다.</p>

      <form onSubmit={sendMagicLink} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>
          {loading ? "전송 중…" : "매직 링크 전송"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: 16, padding: 12, background: "#f2f2f2", borderRadius: 6 }}>
          {message}
        </div>
      )}

      <hr style={{ margin: "24px 0" }} />
      <small>
        테스트: Supabase 프로젝트의 Authentication → Settings 에서 <strong>Site URL</strong>을{" "}
        <code>http://localhost:3000</code>으로 설정하세요. 이메일 매직 링크는 해당 URL로 돌아옵니다.
      </small>
    </main>
  );
}
