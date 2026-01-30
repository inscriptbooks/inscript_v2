import { SignUpForm } from "@/components/forms";

export default function AuthSignupPage() {
  return (
    <section className="flex w-full flex-1 flex-col items-center pb-[60px]">
      <div className="flex w-full justify-center border-b border-b-primary px-[20px] pb-5 pt-11 lg:px-[120px] lg:pt-20">
        <h1 className="font-serif text-xl font-bold text-primary lg:text-[28px]">
          회원가입
        </h1>
      </div>

      <SignUpForm />
    </section>
  );
}
