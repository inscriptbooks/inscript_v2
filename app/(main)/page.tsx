import {
  MainBannerCarousel,
  MainSearchSection,
  MainMemoSection,
  MainProgramSection,
  MainAdBannerSection,
  PopupModal,
} from "@/components/features/main";

export default function MainPage() {
  return (
    <>
      <section className="w-full flex-1">
        <MainSearchSection />
        <MainBannerCarousel />
        {/* <MainStringBannerCarousel /> */}
        <MainMemoSection />
        <MainProgramSection />
        <MainAdBannerSection />
      </section>
      <PopupModal />
    </>
  );
}
