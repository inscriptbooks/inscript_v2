import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

interface BackLinkButtonProps {
  href: string;
  text: string;
}

export default function BackLinkButton({ href, text }: BackLinkButtonProps) {
  return (
    <Link href={href} className="flex w-fit items-center gap-1.5">
      <ArrowLeft className="text-primary" />
      <span className="font-serif text-sm font-bold leading-[18px] text-primary lg:text-base lg:leading-[36.4px]">
        {text}
      </span>
    </Link>
  );
}
