"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/common";

interface EntryEditModalProps {
  isOpen: boolean;
  initialContent?: string;
  title: string;
  onClose: () => void;
  onSave?: (content: string) => void;
  isLoading?: boolean;
}

export default function EntryEditModal({
  isOpen,
  initialContent,
  title,
  onClose,
  onSave,
  isLoading = false,
}: EntryEditModalProps) {
  const [content, setContent] = useState(initialContent ?? "");

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent ?? "");
    }
  }, [isOpen, initialContent]);

  const handleSave = () => {
    if (onSave && content.trim()) {
      onSave(content);
    }
  };

  const handleClose = () => {
    setContent(initialContent ?? "");
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <ModalContent className="w-[335px] gap-10 rounded-md border border-primary bg-white p-6">
        <div className="flex w-full flex-col gap-3">
          <ModalHeader onClose={handleClose} className="mb-0">
            {title}
          </ModalHeader>

          <ModalBody className="gap-6">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[210px] resize-y border-gray-6 bg-background px-5 py-5 text-gray-2"
              placeholder="내용을 입력해주세요..."
            />
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSave}
              className="h-[60px] w-full rounded bg-primary text-lg font-bold text-white"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? <Loader size="xs" /> : "수정"}
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
