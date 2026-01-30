"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import RadioCircle from "./RadioCircle";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

interface RadioGroupItemProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  size?: number;
}

function RadioGroupItem({
  className,
  size = 24,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "flex items-center justify-center text-gray-3 outline-none disabled:cursor-not-allowed data-[state=checked]:text-primary [&_circle]:opacity-0 [&_circle]:data-[state=checked]:opacity-100",
        className,
      )}
      {...props}
    >
      <RadioCircle size={size} />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
