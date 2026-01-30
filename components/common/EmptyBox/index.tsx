interface EmptyBoxProps {
  text?: string;
}

export default function EmptyBox({ text }: EmptyBoxProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <span className="font-serif text-sm font-bold text-gray-3 lg:text-xl">
        {text}
      </span>
    </div>
  );
}
