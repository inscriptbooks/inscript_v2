"use client";
import * as React from "react";
import Image from "next/image";
export default function SendMailPage() {
  return (
    <div className="flex max-w-[800px] flex-col items-center justify-center bg-transparent px-20 py-28 max-md:px-5 max-md:pt-24">
      <div className="flex w-[520px] max-w-full flex-col">
        <div className="flex min-h-[438px] flex-col justify-between rounded-xl bg-white p-16 shadow-sm max-md:max-w-full max-md:px-5">
          <div className="flex w-full flex-col">
            <div className="flex items-start gap-2 self-center text-xl font-semibold leading-tight text-gray-1">
              <Image
                src="/images_jj/lock.webp"
                alt="mail"
                width={24}
                height={24}
              />
              <div className="text-gray-1">임시 비밀번호 발송 드립니다!</div>
            </div>
            <div className="mt-6 flex w-full flex-col">
              <div className="flex w-full items-start justify-between whitespace-nowrap rounded bg-gray-6 py-6 text-center text-lg font-semibold leading-none text-red">
                <div className="flex w-full min-w-60 flex-1 shrink basis-0 items-center justify-between">
                  <div className="my-auto flex-1 shrink basis-0 self-stretch text-[#911A00]">
                    asdkls12lsdk
                  </div>
                </div>
              </div>
              <div className="mt-6 self-center text-base tracking-tight text-gray-3">
                임시비밀번호 로그인 후 비밀번호를 변경해주세요.
              </div>
            </div>
          </div>
          <div className="mt-28 flex flex-col items-center self-center text-right text-xs font-medium leading-relaxed tracking-normal text-gray-4 max-md:mt-10">
            <Image
              src="/images_jj/logo3.webp"
              alt="logo"
              width={244}
              height={40.52}
            />
          </div>
        </div>
        <div className="mt-24 flex w-[347px] max-w-full flex-col self-center text-center text-sm leading-6 tracking-tight max-md:mt-10">
          <div className="w-full font-medium">
            <div className="text-gray-4">
              본 메일은 발신전용 입니다.
              <br />더 궁금하신 사항은 문의주시면 성심껏 답변 드리겠습니다.{" "}
            </div>
            <div className="mt-1.5 text-[#911A00]">
              P. 02-1234-1234 F. 02-1234-1234 E. admin@000.co.kr
            </div>
          </div>
          <div className="mt-14 flex items-center gap-0.5 self-center text-gray-4 max-md:mt-10">
            <div className="my-auto flex items-center gap-2 self-stretch whitespace-nowrap">
              <div className="my-auto flex flex-row items-center gap-2 self-stretch text-[#A0A0A0]">
                Copyright{" "}
                <Image
                  src="/images_jj/logo4.webp"
                  alt="logo"
                  width={65}
                  height={13}
                />
              </div>
            </div>
            <div className="my-auto self-stretch text-[#A0A0A0]">
              Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
