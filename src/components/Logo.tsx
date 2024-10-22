import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl font-bold text-indigo-600 flex gap-2 justify-center items-center"
    >
      <Icon icon="fluent:animal-dog-24-filled" className="text-3xl" />
      {process.env.NEXT_PUBLIC_APP_NAME}
    </Link>
  );
}
