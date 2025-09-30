import Image from "next/image";
import pageNotFound from "@/public/SVGs/undraw_page-not-found_6wni.svg";
import Link from "next/link";

function notFound() {
  return (
    <div className="grid place-items-center h-screen text-center">
      <div className="flex flex-col gap-4">
        <div className="">
          <Image src={pageNotFound} width={600} height={600} alt="404" />
          <p>sorry bro...page not found</p>
        </div>
        <Link className="hover:underline hover:text-[#00bfa5]" href={"/dashboard"}>
          Return To Dashboard
        </Link>
      </div>
    </div>
  );
}

export default notFound;
