import Image from "next/image";
import { FooterContent } from "./components/FooterContent";

/**
 * Footer component displaying company information and contact details
 */
export default function Footer() {
  return (
    <footer className="w-full bg-red-3" data-component-name="footer">
      {/* Content Wrapper - Max Width 1440px */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-[20px] py-11 lg:px-[120px] xl:gap-0">
        {/* Main Content Container */}
        <FooterContent />
      </div>
    </footer>
  );
}
