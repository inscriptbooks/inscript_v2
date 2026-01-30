import { Bookmark } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  onClick: () => void;
  isBookmarked?: boolean;
}

export default function BookmarkButton({
  onClick,
  isBookmarked = false,
}: BookmarkButtonProps) {
  return (
    <Button
      type="button"
      variant="muted"
      size="icon"
      className="lg:size-12"
      onClick={onClick}
    >
      <Bookmark
        className="size-5 text-primary lg:size-8"
        filled={isBookmarked}
      />
    </Button>
  );
}
