import { AuthorPreviewCard } from "@/components/features/author/components";
import { Author } from "@/models/author";
import { cn } from "@/lib/utils";

interface AuthorListProps {
  authorList: Author[];
  className?: string;
}

export default function AuthorList({ authorList, className }: AuthorListProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:auto-rows-[320px] lg:grid-cols-3",
        className,
      )}
    >
      {authorList.map((author) => (
        <AuthorPreviewCard key={author.id} author={author} />
      ))}
    </div>
  );
}
