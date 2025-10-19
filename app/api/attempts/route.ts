import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, problem_id, attempt_num, user_answer } = body;

    // 문제 불러오기
    const { data: problem, error: fetchError } = await supabase
      .from("problems")
      .select("*")
      .eq("id", problem_id)
      .single();

    if (fetchError || !problem)
      throw new Error(fetchError?.message || "문제를 불러올 수 없습니다.");

    const isCorrect = problem.answer.trim() === user_answer.trim();

    // 시도 저장
    const { error: insertError } = await supabase.from("attempts").insert([
      {
        user_id,
        problem_id,
        attempt_num,
        user_answer,
        is_correct: isCorrect,
      },
    ]);

    if (insertError) throw insertError;

    // 정답률 계산용 통계 업데이트
    const { count: totalCount } = await supabase
      .from("attempts")
      .select("*", { count: "exact", head: true })
      .eq("problem_id", problem_id);

    const { count: correctCount } = await supabase
      .from("attempts")
      .select("*", { count: "exact", head: true })
      .eq("problem_id", problem_id)
      .eq("is_correct", true);

    const accuracy = totalCount ? ((correctCount ?? 0) / totalCount) * 100 : 0;

    await supabase.from("problems").update({ accuracy }).eq("id", problem_id);

    // 결과 반환
    return NextResponse.json({
      success: true,
      isCorrect,
      hint: !isCorrect ? problem.hint : null,
      solution: isCorrect ? problem.solution : null,
      message: isCorrect
        ? "정답입니다! 👏"
        : attempt_num === 1
        ? "틀렸어요! 힌트를 참고해보세요 🔍"
        : "두 번째도 틀렸어요 😢 정답 풀이를 확인하세요.",
    });
  } catch (err: any) {
    console.error("❌ Attempt error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
