import { AuthorSelectModal } from "@/components/common/Modal";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "@/components/icons";
import { FormLabel, FormMessage } from "@/components/ui/form";

interface AuthorSelectProps {
  value?: string;
  error?: string;
  onChange?: (authorId: string) => void;
  disabled?: boolean;
}

export default function AuthorSelect({
  value,
  onChange,
  error,
  disabled,
}: AuthorSelectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<{
    id: string;
    authorName: string;
    authorNameEn?: string;
  } | null>(null);

  const handleConfirm = (author: {
    id: string;
    authorName: string;
    authorNameEn?: string;
    featuredWork: string;
  }) => {
    if (author.id === "NONE") {
      setSelectedAuthor({ id: "NONE", authorName: "작가 미지정" });
      onChange?.("NONE");
    } else {
      setSelectedAuthor(author);
      onChange?.(author.id);
    }
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    if (!disabled) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (value === "NONE") {
      setSelectedAuthor({ id: "NONE", authorName: "작가 미지정" });
    } else if (!value) {
      setSelectedAuthor(null);
    }
  }, [value]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center">
        <FormLabel
          className={cn(
            "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
            error && "-top-2.5"
          )}
        >
          작가
          <span className="text-red">*</span>
        </FormLabel>

        <div className="flex w-full flex-col gap-1">
          <button
            type="button"
            onClick={handleOpenModal}
            disabled={disabled}
            className={cn(
              "flex h-12 w-full items-center justify-between gap-2.5 rounded border border-red-3 bg-orange-4 px-5 text-sm lg:h-14 lg:text-base",
              "transition-colors duration-200",
              error && "border-destructive",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-left",
                !selectedAuthor && "text-orange-3"
              )}
            >
              {selectedAuthor
                ? selectedAuthor.id === "NONE"
                  ? "작가 미지정"
                  : `${selectedAuthor.authorName}${selectedAuthor.authorNameEn ? ` (${selectedAuthor.authorNameEn})` : ""}`
                : "작가를 선택해주세요"}
            </span>
            <Search size={24} className="shrink-0 text-primary" />
          </button>
          {error && <FormMessage>{error}</FormMessage>}
        </div>
      </div>

      <AuthorSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
