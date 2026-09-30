import type { Metadata } from 'next'
import { DM_Mono, DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProgressProvider } from '@gad/context/progress-context'
import { SlimBar } from '@gad/components/ui/slim-bar'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { HOME_TITLE, SITE_NAME, SITE_URL } from '@/lib/seo'
import ogImage from '@gad/assets/images/RGAN XI logo landscape.png'

// Self-hosted at build time by next/font. Replaces the render-blocking Google
// Fonts @import that used to sit at the top of globals.css. The CSS variable
// names match the ones tailwind.config.ts already reads.
const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
})
const fontBody = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-body',
})
const fontMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
  preload: false,
})

// Public pages are statically rendered and refreshed in the background at
// most once a minute (ISR) instead of hitting Supabase on every request.
export const revalidate = 60

const title = {
  default: HOME_TITLE,
  template: '%s | RGAN XI',
}
const description =
  'The Region XI Gender and Development Advocates Network (RGAN XI Inc.) is a non-stock, non-profit, non-sectarian, and apolitical organization dedicated to advancing gender equality, diversity, equity, and social inclusion through research, education, policy engagement, and community partnerships.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: ['gender and development', 'GAD', 'gender equity', 'research', 'Philippines', 'women empowerment'],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height }],
  },
  twitter: {
    card: 'summary_large_image',
    title: title.default,
    description,
    images: [ogImage.src],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: 'Region XI Gender and Development Advocates Network',
  url: SITE_URL,
  logo: `${SITE_URL}${ogImage.src}`,
  email: 'journal.grp@gmail.com',
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ProgressProvider>
          <SlimBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ProgressProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

