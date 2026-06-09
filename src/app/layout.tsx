import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'UstoTJ — Платформаи устоҳои боэътимод дар Тоҷикистон',
  description: 'Устоҳои санҷидашударо дар Тоҷикистон ёбед. Механикҳо, электрикҳо, сантехникҳо, бинокорон ва дигар мутахассисон. Шарҳҳо, нархҳо ва портфолио дар як ҷо.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tg" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      {/* We removed hardcoded bg-white/text-zinc-900 because globals.css handles bg-background text-foreground now */}
      <body className="transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
