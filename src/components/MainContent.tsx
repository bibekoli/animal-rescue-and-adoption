import { AppProps } from "next/app";
import ResponsiveDrawer from "@/components/ResponsiveDrawer";
import { Outfit as Font } from "next/font/google";

const font = Font({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function MainContent({
  Component,
  pageProps,
  router,
}: AppProps) {
  const route = router.route;
  console.log(route);

  return (
    <main className={font.className}>
      {route.startsWith("/auth/") ? (
        <Component {...pageProps} />
      ) : (
        <ResponsiveDrawer>
          <Component {...pageProps} />
        </ResponsiveDrawer>
      )}
    </main>
  );
}
