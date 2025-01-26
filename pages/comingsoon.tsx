import Head from 'next/head';
import { Inter } from 'next/font/google';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const WaveBackground = dynamic(() => import('@/components/WaveBackground'), { ssr: false });
const inter = Inter({ subsets: ['latin'] });

export default function ComingSoon() {
  return (
    <main className={`min-h-screen flex flex-col items-center justify-center ${inter.className} relative overflow-hidden`}>
      <Head>
        <title>Coming Soon - CHIMERA BTC</title>
        <link rel="icon" href="/chimera-icon.svg" />
      </Head>

      {/* Background */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          <WaveBackground />
        </div>
        <div className="absolute inset-0 bg-black opacity-55" />
      </div>

      <motion.h1 
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-center z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span 
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
          style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px" }}
        >
          Coming Soon
        </span>
      </motion.h1>
    </main>
  );
}
