import Logo from "@/components/Logo";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";

export default function Login() {
  const signinWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <Logo />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
          <div className="grid grid-cols-1 gap-x-3">
            <button
              className="flex items-center justify-center py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
              onClick={signinWithGoogle}
            >
              <Icon icon="flat-color-icons:google" />
              <span className="ml-2">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
