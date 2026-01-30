interface CommentCountProps {
  count: number;
  className?: string;
}

export function CommentCount({ count, className = "" }: CommentCountProps) {
  return <span className={`text-sm text-primary ${className}`}>[{count}]</span>;
}
