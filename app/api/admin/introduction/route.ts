import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const items = body.items as {
      device: string;
      category: string;
      url: string;
    }[];

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid payloads" },
        { status: 400 }
      );
    }

    const promises = items.map(async (item) => {
      // Upsert based on device and category. Wait, we don't have unique constraint.
      // We should first try to update. If no rows updated, insert.
      const { data: existing } = await supabase
        .from("introduction")
        .select("id")
        .eq("device", item.device)
        .eq("category", item.category)
        .single();

      if (existing) {
        return supabase
          .from("introduction")
          .update({ url: item.url })
          .eq("id", existing.id);
      } else {
        return supabase
          .from("introduction")
          .insert({
            device: item.device,
            category: item.category,
            url: item.url,
          });
      }
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update introduction settings" },
      { status: 500 }
    );
  }
}
