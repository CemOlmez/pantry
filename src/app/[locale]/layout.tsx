import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { AppLayout } from "@/components/layout/app-layout";
import "../globals.css";

export const metadata: Metadata = {
  title: "Pantry",
  description: "Smart Kitchen Companion",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "tr")) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AppLayout>{children}</AppLayout>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
