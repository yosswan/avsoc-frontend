import React from "react";
import type { AppProps } from "next/app";
import clsx from "clsx";
import { ToastProvider } from "react-toast-notifications";
import { Provider, signOut } from "next-auth/client";
import { ThemeContext, ThemeType } from "context";
import { QueryClientProvider, QueryClient } from "react-query";
import "styles/global-tailwind.scss";
import "styles/globals.scss";
import "styles/fonts.scss";
import "styles/styles-ant.scss";
import PermissionProvider from "context/PermissionProvider/PermissionProvider";
import Head from "next/head";
import { Session } from "next-auth";

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>): JSX.Element {
  const [theme, setTheme] = React.useState<ThemeType>("light");
  const queryClientRef = React.useRef<QueryClient | null>(null);
  const permissionsRef = React.useRef<any>(null);

  if (!queryClientRef.current) {
		queryClientRef.current = new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 24 * 60 * 60 * 1000, // 1 dia
					cacheTime: 25 * 60 * 60 * 1000, // 1 dia y 1 hora
					retry: false,
				}
			},
		});
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
      <Provider session={pageProps.session}>
        <QueryClientProvider client={queryClientRef.current}>
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
      </Provider>
    </>
  );
}

export default MyApp;
