import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:size-4 gap-1.5 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "bg-secondary text-secondary-foreground",
        light: "bg-light text-light-foreground",
        lightMd: "bg-light-md text-light-md-foreground",
        lightSm: "bg-light-sm text-light-sm-foreground",
        outline: "border border-primary text-primary ",
      },
      size: {
        default: "h-8 py-2 px-[14px] text-xs font-bold rounded-full",
        xs: "h-5 py-1 px-[6px] text-[10px] font-medium rounded-sm",
        sm: "h-6 py-[6px] px-2 text-xs font-medium rounded-[3px]",
        md: "h-8 py-2 px-3 text-xs font-medium rounded-full",
        lg: "h-10 py-2 px-5 font-bold rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
