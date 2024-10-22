import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { PagesProgressBar } from "next-nprogress-bar";
import MainContent from "@/components/MainContent";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <MainContent
        Component={Component}
        pageProps={pageProps}
        router={router}
      />
      <PagesProgressBar
        height="4px"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </SessionProvider>
  );
}
