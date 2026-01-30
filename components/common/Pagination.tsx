import { ChevronLeft, ChevronRight } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 5;

    if (!showEllipsis) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, last 2 pages
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first 2 pages, ellipsis, last 3 pages
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <div
            key={`ellipsis-${index}`}
            className="flex h-6 w-6 items-center justify-center text-sm font-medium text-orange-3"
          >
            ...
          </div>
        );
      }

      const isActive = page === currentPage;

      return (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-sm text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-white"
              : "text-orange-3 hover:text-primary"
          )}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className={cn("inline-flex items-center gap-4", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "flex h-6 w-6 items-center justify-center transition-opacity disabled:opacity-50",
          currentPage === 1
            ? "text-gray-300"
            : "text-orange-3 hover:text-primary"
        )}
      >
        <ChevronLeft
          size={24}
          color={currentPage === 1 ? "#C9C9C9" : "#911A00"}
        />
      </button>

      <div className="flex items-center gap-2">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-6 w-6 items-center justify-center transition-opacity disabled:opacity-50",
          currentPage === totalPages
            ? "text-gray-300"
            : "text-orange-3 hover:text-primary"
        )}
      >
        <ChevronRight
          size={24}
          color={currentPage === totalPages ? "#C9C9C9" : "#911A00"}
        />
      </button>
    </div>
  );
}
