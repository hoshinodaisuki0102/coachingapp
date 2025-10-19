// app/api/problems/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const problemId = parseInt(params.id, 10);

    const { data, error } = await supabase
      .from("problems")
      .select("*")
      .eq("id", problemId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: `문제 #${problemId}를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ Problem fetch error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
