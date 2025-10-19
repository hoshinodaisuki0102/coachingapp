// components/AdminOnly.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      setIsAdmin(Boolean(user?.email && adminEmail && user.email === adminEmail));
    };
    check();
    return () => {
      mounted = false;
    };
  }, []);

  if (isAdmin === null) return <div>검증 중...</div>;
  if (!isAdmin) return <div>관리자 권한이 필요합니다.</div>;
  return <>{children}</>;
}
