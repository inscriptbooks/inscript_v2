import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PurchaseList from "./components/PurchaseList";
import { formatKoreanDate } from "@/lib/utils/date";
import type { PurchaseItem } from "./types";

export default async function PurchasesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // 1) 사용자 결제 항목 조회 (개별 작품 단위)
  const { data: itemRows } = await supabase
    .from("payment_items")
    .select("order_id, play_id, price, title, author")
    .eq("user_id", user.id);

  // 2) 다운로드 이력 조회
  const { data: downloadData } = await supabase
    .from("play_downloads")
    .select("play_id, order_id")
    .eq("user_id", user.id);

  const downloadMap = new Map<string, boolean>();
  (downloadData || []).forEach((d) => {
    downloadMap.set(`${d.order_id}_${d.play_id}`, true);
  });

  let purchases: PurchaseItem[] = [];
  if (Array.isArray(itemRows) && itemRows.length > 0) {
    const playIds = Array.from(
      new Set(
        (itemRows || []).map((r: any) => String(r.play_id)).filter(Boolean),
      ),
    );
    const orderIds = Array.from(
      new Set(
        (itemRows || []).map((r: any) => String(r.order_id)).filter(Boolean),
      ),
    );

    const [{ data: playRows }, { data: payRows }] = await Promise.all([
      supabase.from("plays").select("id, title").in("id", playIds),
      supabase
        .from("payments")
        .select("order_id, approved_at, created_at, amount")
        .in("order_id", orderIds),
    ]);

    const playMap = new Map<string, { title?: string }>();
    for (const pr of playRows || []) {
      playMap.set(String(pr.id), {
        title: (pr as any).title as string | undefined,
      });
    }

    const orderDateMap = new Map<string, string>();
    const orderAmountMap = new Map<string, number>();
    for (const p of payRows || []) {
      const raw = p.approved_at || p.created_at;
      if (raw) orderDateMap.set(String(p.order_id), String(raw));
      if (p.amount) orderAmountMap.set(String(p.order_id), Number(p.amount));
    }

    // 최신 결제가 먼저 보이도록 정렬 (주문 시간 기준)
    const withTs = (itemRows || []).map((row: any) => {
      const pid = String(row.play_id);
      const oid = String(row.order_id);
      const meta = playMap.get(pid);
      const rawDate = orderDateMap.get(oid) || "";
      const purchaseDate = rawDate ? formatKoreanDate(rawDate) : "";
      const itemPrice = Number(row.price) || 0;
      const paymentAmount = orderAmountMap.get(oid) || 0;
      const finalPrice = itemPrice > 0 ? itemPrice : paymentAmount;

      const p: PurchaseItem = {
        id: `${oid}_${pid}`,
        playId: pid,
        playTitle: String((row as any).title || meta?.title || ""),
        author: String((row as any).author || ""),
        purchaseDate,
        purchasedAt: rawDate,
        price: finalPrice,
        isDownloaded: downloadMap.has(`${oid}_${pid}`) || false,
        orderId: oid,
      };
      const ts = rawDate ? new Date(rawDate).getTime() : 0;
      return { p, ts };
    });

    withTs.sort((a, b) => b.ts - a.ts);
    purchases = withTs.map((x) => x.p);
  } else {
    // 보정: 과거 결제 내역만 있을 경우 fallback (주문명 단일 카드)
    const { data: rows } = await supabase
      .from("payments")
      .select("id, order_name, amount, approved_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    purchases = (rows || []).map((r: any) => {
      const dateSrc = r.approved_at || r.created_at;
      const purchaseDate = dateSrc ? formatKoreanDate(dateSrc) : "";
      return {
        id: String(r.id),
        playId: "",
        playTitle: r.order_name || "주문 상품",
        author: "",
        purchaseDate,
        purchasedAt: dateSrc,
        price: Number(r.amount) || 0,
      } as PurchaseItem;
    });
  }

  return <PurchaseList initialPurchases={purchases} />;
}
