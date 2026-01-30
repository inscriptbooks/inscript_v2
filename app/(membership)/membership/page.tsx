import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

async function getMembershipContent() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("membership_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}

export default async function MembershipPage() {
  const content = await getMembershipContent();

  const introduction = content?.introduction || "";
  const benefits = content?.benefits || "";
  const subscriptionInfo = content?.subscription_info || "";

  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center">
      {/* PC Hero */}
      <section className="full-bleed relative hidden aspect-[80/27] max-h-[486px] w-screen md:block">
        <Image
          src="/images/membership-hero-pc.webp"
          alt="Membership Hero"
          fill
          className="object-cover"
        />

        {/* FIXME: 멤버십 기획 고정 시 삭제 */}
        {/* <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start p-[120px]">
            <div className="flex flex-col items-start gap-2.5">
              <h1 className="font-serif text-[48px] font-bold leading-[130%]">
                <span className="text-white">인스크립트의 </span>
                <span className="text-primary">멤버십</span>
                <span className="text-white">이 되어주세요</span>
              </h1>
            </div>
          </div>
        </div> */}
      </section>

      {/* Mobile Hero */}
      <section className="full-bleed relative aspect-[375/414] max-h-[414px] w-full md:hidden">
        <Image
          src="/images/membership-hero-mo.webp"
          alt="Membership Hero"
          fill
          className="object-cover"
        />

        {/* FIXME: 멤버십 기획 고정 시 삭제 */}
        {/* <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col px-5 pb-[79px]">
          <div className="flex flex-col items-start gap-2.5">
            <h1 className="font-serif text-[32px] font-bold leading-[36px]">
              <span className="text-gray-4">인스크립트의</span>
              <br />
              <span className="text-white">멤버십</span>
              <span className="text-gray-4">이 되어주세요</span>
            </h1>
          </div>
        </div> */}
      </section>

      <section className="flex w-full flex-col items-center justify-center px-[20px] py-10 lg:px-[120px] lg:py-[80px]">
        <div className="flex w-full max-w-[1200px] flex-col gap-[60px] lg:gap-[80px]">
          {/* 멤버십 소개 Section */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
            <div className="flex w-full flex-col justify-center lg:w-[360px] lg:flex-shrink-0">
              <h2 className="font-serif text-2xl font-bold text-primary lg:text-[28px] lg:leading-8">
                멤버십 소개
              </h2>
            </div>
            <div className="flex flex-1 flex-col">
              <p className="whitespace-pre-line font-pretendard text-base leading-6 tracking-[-0.32px] text-gray-1">
                {introduction}
              </p>
            </div>
          </div>

          {/* 멤버십 혜택 Section */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
            <div className="flex w-full flex-col justify-center lg:w-[360px] lg:flex-shrink-0">
              <h2 className="font-serif text-2xl font-bold text-primary lg:text-[28px] lg:leading-8">
                멤버십 혜택
              </h2>
            </div>
            <div className="flex flex-1 flex-col">
              <p className="whitespace-pre-line font-pretendard text-base leading-6 tracking-[-0.32px] text-gray-1">
                {benefits}
              </p>
            </div>
          </div>

          {/* 멤버십 구독료 Section */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
            <div className="flex w-full flex-col justify-center lg:w-[360px] lg:flex-shrink-0">
              <h2 className="font-serif text-2xl font-bold text-primary lg:text-[28px] lg:leading-8">
                멤버십 구독료
              </h2>
            </div>
            <div className="flex flex-1 flex-col">
              <p className="whitespace-pre-line font-pretendard text-base leading-6 tracking-[-0.32px] text-gray-1">
                {subscriptionInfo}
              </p>
            </div>
          </div>
        </div>
        <Link
          href="https://inscript.stibee.com/?fbclid=PARlRTSANlj8NleHRuA2FlbQIxMQABp19zqrrikO1jIumc339eAbxx3HSr5gxeSE1tTzRzzeLnx0S9YkuglFs51_t1_aem_aCYmSgcRfPNfohS6LUCCbg"
          target="_blank"
          // rel="noopener noreferrer"
        >
          <Button
            type="button"
            size="md"
            className="mt-20 w-full justify-center sm:w-[470px]"
          >
            {/* FIXME: 멤버쉽 페이지 링크 기획 추가 필요*/}
            멤버십 구독하고 혜택 받기
          </Button>
        </Link>
      </section>
    </section>
  );
}
