import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PlayFormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  required?: boolean;
  error?: string;
  numericOnly?: boolean;
  maxLength?: number;
  labelClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PlayFormInput({
  label,
  required,
  error,
  className,
  numericOnly,
  maxLength,
  onChange,
  ...props
}: PlayFormInputProps) {
  return (
    <div className="flex w-full items-start">
      <div className="flex h-14 w-40 items-start gap-1 py-4">
        <span className="font-pretendard text-xl font-semibold leading-6 text-gray-3">
          {label}
        </span>
        {required && (
          <span className="font-pretendard text-xl font-semibold leading-6 text-red">
            *
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <Input
          className={cn(
            "h-14 bg-orange-4 text-base placeholder:text-orange-3",
            error && "border-destructive",
            className,
          )}
          onChange={(e) => {
            let newValue = e.target.value;

            if (numericOnly) {
              newValue = newValue.replace(/[^0-9]/g, "");
            }

            if (maxLength && newValue.length > maxLength) {
              newValue = newValue.slice(0, maxLength);
            }

            e.target.value = newValue;

            onChange?.(e);
          }}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
