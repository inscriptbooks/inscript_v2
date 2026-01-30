import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: footer 정보 조회
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("footer")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}

// POST: footer 정보 생성 또는 업데이트
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      companyName,
      businessNumber,
      address,
      email,
      phone,
      mailOrderNumber,
    } = body;

    // 기존 데이터 확인
    const { data: existingData } = await supabase
      .from("footer")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let result;

    if (existingData) {
      // 업데이트
      const { data, error } = await supabase
        .from("footer")
        .update({
          company_name: companyName,
          business_number: businessNumber,
          address,
          email,
          mail_order_number: mailOrderNumber,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    } else {
      // 새로 생성
      const { data, error } = await supabase
        .from("footer")
        .insert({
          company_name: companyName,
          business_number: businessNumber,
          address,
          email,
          mail_order_number: mailOrderNumber,
          phone,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save footer data" },
      { status: 500 }
    );
  }
}
