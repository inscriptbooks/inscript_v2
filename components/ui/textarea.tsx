import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive field-sizing-content flex min-h-14 w-full resize-none rounded-[4px] border border-input bg-transparent px-4 py-3 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 lg:px-5 lg:py-4",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
