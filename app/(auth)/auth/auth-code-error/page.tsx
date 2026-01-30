import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center px-5 pb-[60px]">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border border-red-3 bg-white p-8">
        <h1 className="font-serif text-2xl font-bold text-red-1">
          로그인 오류
        </h1>
        <p className="text-center text-gray-2">
          로그인 중 문제가 발생했습니다.
          <br />
          다시 시도해주세요.
        </p>
        <Link
          href="/auth"
          className="w-full rounded bg-primary px-6 py-3 text-center font-bold text-white hover:bg-primary/90"
        >
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </section>
  );
}
