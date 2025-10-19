// components/AuthStatus.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthStatus() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(currentUser ?? null);
      setLoading(false);
    };

    getUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div>로딩...</div>;

  if (!user) {
    return (
      <div>
        <a href="/login">로그인</a>
      </div>
    );
  }

  return (
    <div>
      <div>안녕하세요, {user.email}</div>
      <button onClick={signOut} style={{ marginTop: 8 }}>
        로그아웃
      </button>
    </div>
  );
}
