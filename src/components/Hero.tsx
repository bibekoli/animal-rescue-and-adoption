import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-screen-xl pb-12 px-4 items-center lg:flex md:px-8">
      {/* Description section - 66% width */}
      <div className="space-y-4 flex-[2_2_0%] sm:text-center lg:text-left">
        <h1 className="text-gray-600 font-bold text-4xl xl:text-5xl">
          Online space for
          <span className="text-indigo-500"> Animals Rescue and Adoption</span>
        </h1>
        <p className="text-gray-500 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
          Discover animals in need of rescue and adoption near you. Our platform
          connects pet lovers with rescue centers and non-profit organizations
          to ensure a safe and secure rescue and adoption process.
        </p>
        <div className="pt-10 items-center justify-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex lg:justify-start">
          <Link
            href="/discover/rescue"
            className="px-7 py-3 w-full bg-emerald-500 text-emerald-50 text-center rounded-md shadow-md shadow-indigo-200 sm:w-auto flex items-center gap-2"
          >
            <Icon icon="mdi:location-radius" />
            Discover Nearby for Rescue
          </Link>
          <Link
            href="/discover/adoption"
            className="px-7 py-3 w-full bg-indigo-500 text-indigo-50 text-center rounded-md shadow-md shadow-indigo-200 sm:w-auto flex items-center gap-2"
          >
            <Icon icon="mdi:location-radius" />
            Discover Nearby for Adoption
          </Link>
        </div>
      </div>

      {/* Image section - 34% width */}
      <div className="flex-[1_1_0%] text-center mt-7 lg:mt-0 lg:ml-3">
        <Image
          src="/hero.jpg"
          alt="hero"
          width={500}
          height={500}
          className="w-full mx-auto sm:w-10/12 lg:w-full rounded-3xl shadow-md"
        />
      </div>
    </section>
  );
}
