import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch report details
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select(
      `
      *,
      users!reports_user_id_fkey (
        name,
        email
      )
    `
    )
    .eq("id", id)
    .single();

  if (reportError) {
    return NextResponse.json(
      { success: false, error: reportError.message },
      { status: 500 }
    );
  }

  // Fetch target content based on type
  let targetContent = null;
  let targetAuthor = null;
  let comments: any[] = [];

  if (report.type === "post" && report.post_id) {
    const { data: post } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        content,
        created_at,
        user_id,
        type,
        is_visible
      `
      )
      .eq("id", report.post_id)
      .single();

    if (post) {
      targetContent = post;
      const { data: author } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", post.user_id)
        .single();
      targetAuthor = author;

      // Fetch comments for the post
      const { data: postComments, error: commentsError } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          is_visible,
          user_id,
          users (
            id,
            name,
            email
          )
        `
        )
        .eq("post_id", report.post_id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

      if (postComments) {
        comments = postComments;
      }
    }
  } else if (report.type === "memo" && report.memo_id) {
    const { data: memo } = await supabase
      .from("memos")
      .select(
        `
        id,
        title,
        content,
        created_at,
        user_id,
        is_visible
      `
      )
      .eq("id", report.memo_id)
      .single();

    if (memo) {
      targetContent = memo;
      const { data: author } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", memo.user_id)
        .single();
      targetAuthor = author;

      // Fetch comments for the memo
      const { data: memoComments } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          is_visible,
          user_id,
          users (
            id,
            name,
            email
          )
        `
        )
        .eq("memo_id", report.memo_id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });

      if (memoComments) {
        comments = memoComments;
      }
    }
  } else if (report.type === "comment" && report.comment_id) {
    const { data: comment } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        is_visible
      `
      )
      .eq("id", report.comment_id)
      .single();

    if (comment) {
      targetContent = comment;
      const { data: author } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", comment.user_id)
        .single();
      targetAuthor = author;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      report,
      targetContent,
      targetAuthor,
      comments,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status, processingMethod } = body as {
    status: "submitted" | "approved" | "rejected";
    processingMethod: "visible" | "hidden";
  };

  const supabase = await createClient();

  // Update report status in database
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .update({ is_complete: status })
    .eq("id", id)
    .single();

  if (reportError) {
    return NextResponse.json(
      { success: false, error: reportError.message },
      { status: 500 }
    );
  }

  // Fetch report details to get related post/memo/comment
  const { data: updatedReport, error: updatedReportError } = await supabase
    .from("reports")
    .select("type, post_id, memo_id, comment_id")
    .eq("id", id)
    .single();

  if (updatedReportError) {
    return NextResponse.json(
      { success: false, error: updatedReportError.message },
      { status: 500 }
    );
  }

  // Update visibility of related post/memo based on processing method
  const isVisible = processingMethod === "visible";

  if (updatedReport) {
    if (updatedReport.type === "post" && updatedReport.post_id) {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .update({ is_visible: isVisible })
        .eq("id", updatedReport.post_id)
        .select();

      if (postError) {
        return NextResponse.json(
          { success: false, error: postError.message },
          { status: 500 }
        );
      }
    } else if (updatedReport.type === "memo" && updatedReport.memo_id) {
      const { data: memoData, error: memoError } = await supabase
        .from("memos")
        .update({ is_visible: isVisible })
        .eq("id", updatedReport.memo_id)
        .select();

      if (memoError) {
        return NextResponse.json(
          { success: false, error: memoError.message },
          { status: 500 }
        );
      }
    } else if (updatedReport.type === "comment" && updatedReport.comment_id) {
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .update({ is_visible: isVisible })
        .eq("id", updatedReport.comment_id)
        .select();

      if (commentError) {
        return NextResponse.json(
          { success: false, error: commentError.message },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      is_complete: status,
      is_visible: isVisible,
    },
  });
}
