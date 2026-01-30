"use client";

import { useFooter } from "@/hooks/footer";
import Image from "next/image";
import Link from "next/link";
import { TbBrandYoutubeFilled } from "react-icons/tb";

/**
 * FooterContent client component that fetches and displays footer data
 */
export function FooterContent() {
  const { data: footerData, isLoading } = useFooter();

  // 기본값 설정 (데이터가 없거나 로딩 중일 때)
  const companyName = footerData?.company_name || "인스크립트";
  const ceoName = "권주영"; // CEO 이름은 별도 관리되지 않으므로 하드코딩 유지
  const businessNumber = footerData?.business_number || "874-52-00865";
  const address = footerData?.address || "서울 종로구 율곡로 225 3층";
  const email = footerData?.email || "inscript2023@gmail.com";
  const mailOrderNumber = footerData?.mail_order_number || "2023-서울종로-1234";
  const phone = footerData?.phone || "010-5862-1203";
  // const instagram = "@inscriptbooks"; // 인스타그램은 별도 관리되지 않으므로 하드코딩 유지
  const copyright = "© 2025 Inscript. All contents are protected by copyright."; // 카피라이트는 별도 관리되지 않으므로 하드코딩 유지

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:flex-1">
        {/* Company Name */}
        <h2 className="min-w-[136px] font-serif text-[28px] leading-[32px] font-bold text-primary">
          {companyName}
        </h2>

        {/* Company Information Container */}
        <div className="flex flex-col gap-2 lg:flex-1">
          {/* Basic Company Info Section */}
          <div className="flex flex-col gap-2.5 text-primary sm:flex-row sm:flex-wrap">
            <div className="flex gap-2">
              <div>대표</div>
              <div>{ceoName}</div>
            </div>

            <div className="hidden sm:block">|</div>

            <div className="flex gap-2">
              <div>사업자 등록번호</div>
              <div>{businessNumber}</div>
            </div>

            <div className="hidden sm:block">|</div>

            <div className="flex gap-2">
              <div>주소</div>
              <div>{address}</div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="flex flex-col gap-2.5 text-primary sm:flex-row sm:flex-wrap">
            <div className="flex gap-2">
              <div>이메일</div>
              <div>{email}</div>
            </div>

            <div className="hidden sm:block">|</div>

            <div className="flex gap-2">
              <div>전화</div>
              <div>{phone}</div>
            </div>

            <div className="hidden sm:block">|</div>

            <div className="flex gap-2">
              <div>통신판매업신고</div>
              <div>{mailOrderNumber}</div>
            </div>
          </div>
          <div className="flex gap-2.5 justify-start">
            <div className="flex">
              <div className="text-primary">{copyright}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer icons */}
      <div className="flex flex-row gap-3 lg:items-center">
        <Link
          href="https://www.instagram.com/inscriptbooks"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="인스타그램으로 이동"
        >
          <Image
            src="/images/footer/instagram.svg"
            alt="인스타그램"
            width={24}
            height={24}
          />
        </Link>
        <Link
          href="https://www.youtube.com/@Inscript2023"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="유튜브로 이동"
        >
          <TbBrandYoutubeFilled size={24} className="text-[#911A00]" />
        </Link>
        <Link
          href="https://pf.kakao.com/_tSxcgxj/chat?t_src=kakaomap"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="카카오톡채널로 이동"
        >
          <Image
            src="/images/footer/kakao.svg"
            alt="카카오톡채널"
            width={24}
            height={24}
          />
        </Link>

        {/* <Link
              href="/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="네이버스마트스토어로 이동"
            >
              <Image
                src="/images/footer/naver_smartstore.svg"
                alt="네이버스마트스토어"
                width={24}
                height={24}
              />
            </Link> */}
      </div>
    </div>
  );
}
