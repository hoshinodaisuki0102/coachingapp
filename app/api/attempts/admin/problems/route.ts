import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, problems } = body; // AdminPage 구조에 맞춤

    if (!category || !problems || !Array.isArray(problems)) {
      return NextResponse.json({ success: false, error: "카테고리 또는 문제 데이터가 올바르지 않습니다." }, { status: 400 });
    }

    // 문제 번호 자동 부여
    const formattedProblems = problems.map((p, i) => ({
      category,
      question_no: i + 1,
      question_text: p.question_text,
      question_img: p.question_img || null,
      answer: p.answer,
      hint: p.hint || null,
      explanation: p.explanation || null,
    }));

    const supabase = getAdminClient();
    const { data, error } = await supabase.from("problems").insert(formattedProblems);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ Problem insert error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
