import React from "react";
import type { AppProps } from "next/app";
import clsx from "clsx";
import { ToastProvider } from "react-toast-notifications";
import { SessionProvider } from "next-auth/react";
import { ThemeContext, ThemeType } from "context";
import { QueryClient, QueryClientProvider } from "react-query";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import "styles/global-tailwind.scss";
import "styles/globals.scss";
import "styles/fonts.scss";
import "styles/styles-ant.scss";
import PermissionProvider from "context/PermissionProvider/PermissionProvider";
import Head from "next/head";
import { Session } from "next-auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000,
      cacheTime: 48 * 60 * 60 * 1000,
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>): JSX.Element {
  const [theme, setTheme] = React.useState<ThemeType>("light");
  const permissionsRef = React.useRef<any>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Head>
          <title>Ministerio Juvenil AVSOC</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ministerio Juvenil AVSOC</title>
        <meta
          itemProp="description"
          name="description"
          content="CMS Ministerio Juvenil AVSOC"
        />
        <meta name="msapplication-TileColor" content="#e68fa7" />
        <meta name="theme-color" content="#e68fa7" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<link rel="manifest" href="/manifest.json" />
        <meta property="og:title" content="CMS Ministerio Juvenil AVSOC" />
        <meta property="og:site_name" content="CMS Ministerio Juvenil AVSOC" />
        <meta
          itemProp="description"
          property="og:description"
          content="CMS Ministerio Juvenil AVSOC"
        />
        {/* <meta
          property="og:image"
          itemProp="image"
          content="https://raw.githubusercontent.com/Yeltsin196/preview/main/preview.png"
        />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="200" /> */}
      </Head>
      <SessionProvider session={session}>
        {/* @ts-ignore - react-query v3 type compatibility */}
        <QueryClientProvider client={queryClient}>
          <PermissionProvider client={permissionsRef}>
            <ToastProvider
              autoDismissTimeout={4000}
              autoDismiss
              placement="top-center"
            >
              <ThemeContext.Provider value={{ theme, setTheme }}>
                <div
                  className={clsx(
                    "font-montserrat min-h-screen text-gray-800",
                    "transition-colors duration-1000",
                    theme
                  )}
                >
                  <Component {...pageProps} />
                </div>
              </ThemeContext.Provider>
            </ToastProvider>
          </PermissionProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
