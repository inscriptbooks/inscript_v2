import { FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Search } from "@/components/icons";

interface FormSearchInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  onClick?: () => void;
  readOnly?: boolean;
}

export default function FormSearchInput({
  label,
  required,
  error,
  className,
  labelClassName,
  wrapperClassName,
  placeholder = "검색",
  onClick,
  readOnly = false,
  ...props
}: FormSearchInputProps) {
  return (
    <div className={cn("flex w-full flex-col", wrapperClassName)}>
      <div className="flex items-center">
        {label && (
          <FormLabel
            className={cn(
              "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
              error && "-top-2.5",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="text-red">*</span>}
          </FormLabel>
        )}

        <div className="flex w-full flex-col gap-1">
          <div
            className={cn(
              "flex w-full items-center justify-between gap-2.5 rounded border border-red-3 bg-orange-4 px-5 py-4",
              "transition-colors duration-200",
              error && "border-destructive",
              onClick && "cursor-pointer hover:border-red-2",
              className,
            )}
            onClick={onClick}
          >
            <input
              type="text"
              placeholder={placeholder}
              readOnly={readOnly}
              className={cn(
                "flex-1 bg-transparent font-pretendard text-base leading-6 tracking-[-0.32px] text-primary outline-none",
                "placeholder:text-orange-3",
                onClick && "cursor-pointer",
              )}
              {...props}
            />
            <Search size={24} className="flex-shrink-0 text-primary" />
          </div>
          {error && <FormMessage>{error}</FormMessage>}
        </div>
      </div>
    </div>
  );
}
