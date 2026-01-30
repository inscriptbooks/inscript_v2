import { CommunityPostUploadForm } from "@/components/forms";

export default function CommunityPostUploadSection() {
  return (
    <section className="flex w-full flex-col pt-11 lg:pt-20">
      <h1 className="mb-5 font-serif text-xl font-bold text-primary lg:text-[28px]">
        커뮤니티 글쓰기
      </h1>
      <div className="full-bleed mb-12 border-b border-primary" />
      <CommunityPostUploadForm />
    </section>
  );
}
