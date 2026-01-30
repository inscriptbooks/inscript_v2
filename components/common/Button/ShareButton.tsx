import { Share } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  onClick: () => void;
}

export default function ShareButton({ onClick }: ShareButtonProps) {
  return (
    <Button
      type="button"
      variant="muted"
      size="icon"
      className="lg:size-12"
      onClick={onClick}
    >
      <Share className="size-5 text-primary lg:size-8" />
    </Button>
  );
}
