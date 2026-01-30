"use client";

import { Send } from "@/components/icons";
import { useReceivedNotes } from "@/hooks/notes";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useState, useEffect } from "react";
import ShowMoreButton from "@/components/common/Button/ShowMoreButton";
import { useLoader } from "@/hooks/common/useLoader";
import NoteSendModal from "@/components/common/Modal/NoteSendModal";
import { createNote, updateNote } from "@/hooks/notes/apis";
import { Note } from "@/models/note";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { noteKeys } from "@/hooks/notes/keys";

interface MessageItemProps {
  username: string;
  timestamp: string;
  content: string;
  senderId: string;
  senderName: string;
  onReply: (senderId: string, senderName: string, noteId: string) => void;
  is_reply: boolean;
  noteId: string;
}

export default function MessageList() {
  const { data: notes, isLoading } = useReceivedNotes();
  const [visibleCount, setVisibleCount] = useState(5);
  const { showLoader, hideLoader } = useLoader();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<{
    id: string;
    name: string;
    noteId: string;
  } | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  if (isLoading) {
    return null;
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex w-full max-w-[794px] items-center justify-center py-10">
        <div className="font-pretendard text-sm text-gray-4">
          받은 쪽지가 없습니다.
        </div>
      </div>
    );
  }

  const displayedNotes = notes.slice(0, visibleCount);
  const hasMore = visibleCount < notes.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleReply = (
    senderId: string,
    senderName: string,
    noteId: string
  ) => {
    setSelectedRecipient({ id: senderId, name: senderName, noteId });
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setSelectedRecipient(null);
  };

  const handleSendReply = async (message: string) => {
    if (!selectedRecipient) {
      return;
    }

    try {
      // 답장 전송
      const noteData = {
        receiver_id: selectedRecipient.id,
        message,
      };

      const createdNote = await createNote(noteData);

      // 답장을 보낸 후 해당 쪽지의 is_reply를 true로 업데이트
      const result = await updateNote(selectedRecipient.noteId, {
        is_reply: true,
      });

      // 쿼리를 무효화하여 데이터를 새로 가져옴
      await queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    } catch (error) {
      throw error; // 에러를 다시 던져서 NoteSendModal에서 처리하도록 함
    }
  };

  return (
    <>
      <div className="flex w-full md:min-w-[794px] flex-col items-start gap-2.5">
        {displayedNotes.map((note) => (
          <MessageItem
            key={note.id}
            username={note.sender?.name || "알 수 없음"}
            timestamp={formatDistanceToNow(new Date(note.created_at), {
              addSuffix: true,
              locale: ko,
            })}
            content={note.message}
            senderId={note.sender_id}
            senderName={note.sender?.name || "알 수 없음"}
            onReply={handleReply}
            is_reply={note.is_reply}
            noteId={note.id}
          />
        ))}
        {hasMore && (
          <div className="w-full">
            <ShowMoreButton onClick={handleShowMore} />
          </div>
        )}
      </div>

      <NoteSendModal
        isOpen={isReplyModalOpen}
        recipientName={selectedRecipient?.name}
        onClose={handleCloseReplyModal}
        onSend={handleSendReply}
      />
    </>
  );
}

function MessageItem({
  username,
  timestamp,
  content,
  senderId,
  senderName,
  onReply,
  is_reply,
  noteId,
}: MessageItemProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2.5 rounded-[4px] bg-white p-5">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="font-pretendard text-sm font-medium leading-4 text-gray-3">
              {username}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-pretendard text-sm font-bold leading-4 tracking-[-0.28px] text-gray-4">
              {timestamp}
            </div>
            {is_reply && (
              <Badge variant="secondary" className="text-xs">
                답변완료
              </Badge>
            )}
          </div>
        </div>
        <button
          onClick={() => onReply(senderId, senderName, noteId)}
          className="flex items-center gap-1 px-3 py-0"
        >
          <Send color="#6D6D6D" />
          <div className="font-pretendard text-sm font-bold leading-4 tracking-[-0.28px] text-gray-3">
            답장하기
          </div>
        </button>
      </div>
      <div className="line-clamp-3 w-full font-pretendard text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
        {content}
      </div>
    </div>
  );
}
