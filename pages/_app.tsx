import '@/styles/globals.css'
import "@rainbow-me/rainbowkit/styles.css"
import type { AppProps } from 'next/app'

// chains that are going to be supported
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
