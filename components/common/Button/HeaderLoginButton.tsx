import Link from "next/link";

export default function HeaderLoginButton() {
  return (
    <Link
      href="/auth"
      className="flex h-10 items-center justify-center gap-2.5 rounded-md border border-primary bg-background px-4 py-2 font-semibold leading-[150%] tracking-[-0.32px] text-primary"
    >
      로그인하기
    </Link>
  );
}
