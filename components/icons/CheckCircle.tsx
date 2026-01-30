import { cn } from "@/lib/utils";

interface CheckCircleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function CheckCircle({
  checked,
  onChange,
  className,
}: CheckCircleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "border-1.5 flex h-6 w-6 items-center justify-center rounded-full",
        className,
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
      >
        {checked ? (
          <>
            <circle cx="12" cy="12.0352" r="10" fill="#911A00" />
            <path
              d="M8.5 12.5352L10.5 14.5352L15.5 9.53516"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <circle
              cx="12"
              cy="12.0352"
              r="10"
              stroke="#6D6D6D"
              strokeWidth="1.5"
            />
            <path
              d="M8.5 12.5352L10.5 14.5352L15.5 9.53516"
              stroke="#6D6D6D"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}
