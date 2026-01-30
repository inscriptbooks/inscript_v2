import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { users, userRoleEnum, userStatusEnum } from "@/lib/db/schema/users";
import { and, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const status = searchParams.get("status");

  const whereClauses = [];
  if (role)
    whereClauses.push(
      eq(users.role, role as (typeof userRoleEnum.enumValues)[number]),
    );
  if (status)
    whereClauses.push(
      eq(users.status, status as (typeof userStatusEnum.enumValues)[number]),
    );

  const data = await db.query.users.findMany({
    where: and(...whereClauses),
  });

  return NextResponse.json(data);
}
