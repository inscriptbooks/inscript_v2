"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Loader } from "@/components/common";

interface EntryDeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string | React.ReactNode;
  content?: string;
  createdAt?: string;
  onClose: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export default function EntryDeleteModal({
  isOpen,
  title,
  description,
  createdAt,
  content,
  onClose,
  onDelete,
  isLoading = false,
}: EntryDeleteModalProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent className="w-[335px] gap-10 rounded-md border border-primary bg-white p-6">
        <div className="flex w-full flex-col gap-3">
          <ModalHeader onClose={onClose} className="mb-0">
            {title}
          </ModalHeader>

          <ModalBody className="gap-6">
            <div className="w-full text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
              {description}
            </div>

            {(content || createdAt) && (
              <div className="flex w-full flex-col rounded-lg border border-gray-6 bg-background p-5">
                <div className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
                  {content && <p className="whitespace-pre-wrap">{content}</p>}
                  {createdAt && (
                    <span className="block">{`(${formatDate(createdAt)} 작성)`}</span>
                  )}
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleDelete}
              className="h-16 w-full rounded bg-primary px-14 py-5 text-lg font-bold text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader size="xs" /> : "삭제"}
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
