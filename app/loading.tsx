import Spinner from "@/components/static/loader";
import Image from "next/image";

export default function Loading() {
  return (
    <section className="bg-background w-dvw h-dvh flex flex-col gap-5 justify-center items-center">
      <div className="relative w-36 h-36 rounded-2xl overflow-hidden">
        <Image src={"/logo.png"} alt="logo" fill priority />
      </div>
      <div className=" flex gap-2 ">
        <Spinner className="text-primary" />
      </div>
    </section>
  );
}
