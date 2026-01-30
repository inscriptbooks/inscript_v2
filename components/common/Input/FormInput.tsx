import { Input } from "@/components/ui/input";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CheckCircle } from "@/components/icons";

interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  required?: boolean;
  error?: string;
  numericOnly?: boolean;
  maxLength?: number;
  labelClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showErrorWithCheckbox?: boolean;
}

export default function FormInput({
  label,
  required,
  error,
  className,
  numericOnly,
  maxLength,
  labelClassName,
  onChange,
  showErrorWithCheckbox = false,
  ...props
}: FormInputProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center">
        <FormLabel
          className={cn(
            "relative w-[65px] shrink-0 gap-1 font-semibold leading-6 text-gray-3 lg:w-40 lg:text-xl",
            error && !showErrorWithCheckbox && "-top-2.5",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-red">*</span>}
        </FormLabel>

        <div className="flex w-full flex-col gap-1">
          <Input
            className={cn(
              "h-12 bg-orange-4 text-sm placeholder:text-orange-3 lg:h-14 lg:text-base",
              error && "border-destructive",
              className,
            )}
            onChange={(e) => {
              let newValue = e.target.value;

              if (numericOnly) {
                newValue = newValue.replace(/[^0-9]/g, "");
              }

              // maxLength 체크 - 한글 입력에서도 정확히 동작하도록
              if (maxLength && newValue.length > maxLength) {
                newValue = newValue.slice(0, maxLength);
              }

              e.target.value = newValue;

              onChange?.(e);
            }}
            {...props}
          />
          {error && !showErrorWithCheckbox && <FormMessage>{error}</FormMessage>}
        </div>
      </div>
      
      {/* 체크박스와 함께 에러 표시 */}
      {error && showErrorWithCheckbox && (
        <div className="mt-2 flex items-center gap-2 pl-[65px] lg:pl-40">
          <CheckCircle checked={false} onChange={() => {}} className="pointer-events-none" />
          <span className="text-sm font-medium text-red lg:text-base">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
