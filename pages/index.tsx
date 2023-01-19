import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Exchange from '@/components/exchange/exchange';
// Jesse
// import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {address} = useAccount();
  return (
    <>
    {/* important for SEO */}
      <Head>
        <title>Agency</title>
        <meta name="description" content="Agency" />  
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Jesse */}
        {/* <main className={styles.main}> */}
        {/* <div className={styles.description}>description</div> */}
      </Head>
      <div>
      <Exchange walletConnected = {false}></Exchange>
      </div>
    </>
  )
}
