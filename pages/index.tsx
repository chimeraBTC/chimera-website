import { Inter } from 'next/font/google';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import WavyBackground from '@/components/WavyBackground';
import dynamic from 'next/dynamic';
import { FaTwitter, FaDiscord, FaBook, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import WaveBackground with no SSR
const WaveBackground = dynamic(() => import('@/components/WaveBackground'), { ssr: false });

// Custom hook to detect if the user is on mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard breakpoint for md in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return isMobile;
}

export default function Home() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [mempoolFee, setMempoolFee] = useState<number | null>(null);
  const [showArrow, setShowArrow] = useState(true);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [paymentPubkey, setPaymentPubkey] = useState("");
  const [ordinalAddress, setOrdinalAddress] = useState("");
  const [ordinalPubkey, setOrdinalPubkey] = useState("");
  const isMobile = useIsMobile();

  // Function to conditionally apply animation props based on device
  const getAnimationProps = (props: any) => {
    if (isMobile) {
      // For mobile: disable animations but ensure visibility
      return {
        initial: { opacity: 1 }, // Start visible
        animate: { opacity: 1 }, // Stay visible
        whileInView: { opacity: 1 }, // Remain visible when in view
        transition: { duration: 0 } // No transition
      };
    }
    return props; // Return animation props for desktop
  };

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        setBtcPrice(data.bitcoin.usd);
      } catch (error) {
        console.error('Error fetching BTC price:', error);
      }
    };

    const fetchMempoolFees = async () => {
      try {
        const response = await fetch('https://mempool.space/api/v1/fees/recommended');
        const data = await response.json();
        setMempoolFee(data.halfHourFee); // Using half hour fee as a middle ground
      } catch (error) {
        console.error('Error fetching mempool fees:', error);
      }
    };

    fetchBtcPrice();
    fetchMempoolFees();

    const interval = setInterval(() => {
      fetchBtcPrice();
      fetchMempoolFees();
    }, 60000);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const unisatConnectWallet = () => {
    // This is just a placeholder for now
    console.log("Connect wallet clicked");
  };

  return (
    <div className="overflow-hidden">
      <main className={`flex min-h-screen flex-col items-center ${inter.className} overflow-x-hidden`}>
        <Head>
          <title>CHIMERA BTC</title>
          <link rel="icon" href="/chimera-icon.svg" />
        </Head>

        {/* Content Container with Vignette */}
        <div className="relative w-full min-h-screen">
          {/* Fixed Wavy Background that stays throughout the page */}
          <div className="fixed inset-0 w-full h-full">
            <WavyBackground className="w-full h-full" />
            <div className="absolute inset-0 bg-black opacity-50" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <Header 
              unisatConnectWallet={unisatConnectWallet}
              paymentAddress={paymentAddress}
              setPaymentAddress={setPaymentAddress}
              paymentPubkey={paymentPubkey}
              setPaymentPubkey={setPaymentPubkey}
              ordinalAddress={ordinalAddress}
              setOrdinalAddress={setOrdinalAddress}
              ordinalPubkey={ordinalPubkey}
              setOrdinalPubkey={setOrdinalPubkey}
            />

            {/* Hero Section */}
            <section className="min-h-screen w-full flex items-center justify-center px-8">
              <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Column - Header */}
                <motion.div
                  className="flex flex-col space-y-4 lg:pr-0 mb-8 md:mb-0"
                  {...getAnimationProps({
                    initial: { opacity: 0, y: 50, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                  })}
                >
                  <div className="text-center lg:text-right">
                    <motion.h1
                      {...getAnimationProps({
                        initial: { opacity: 0, y: 50, scale: 0.95 },
                        animate: { opacity: 1, y: 0, scale: 1 },
                        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                      })}
                      className="text-4xl md:text-6xl lg:text-6xl font-bold text-white leading-tight"
                    >
                      Passive Investing in the{" "}
                      <span 
                        className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                        style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2", paddingBottom: "0.2em" }}
                      >
                        Bitcoin Risk Economy
                      </span>
                    </motion.h1>
                  </div>
                </motion.div>

                {/* Right Column - Chimera Icon */}
                <motion.div
                  {...getAnimationProps({
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 1, delay: 0.8 }
                  })}
                  className="relative w-full h-[40vh] flex items-center justify-center"
                >
                  <div className="w-[240px] h-[240px] relative">
                    <Image 
                      src="/chimera-icon.svg"
                      alt="Chimera Icon"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Blinking Down Arrow */}
              {showArrow && (
                <motion.div 
                  className="fixed bottom-12 md:bottom-20 left-1/2 transform -translate-x-1/2 z-40"
                  {...getAnimationProps({
                    initial: { opacity: 1 },
                    exit: { opacity: 0 },
                    animate: { y: [0, 10, 0] },
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  })}
                >
                  <FaChevronDown className="text-white/60 text-2xl" style={{ strokeWidth: 1 }} />
                </motion.div>
              )}
            </section>

            {/* Decentralized ETFs Section */}
            <section className="w-full py-12 md:py-24 px-8 relative">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  {...getAnimationProps({
                    initial: { opacity: 0, y: 50, scale: 0.95 },
                    whileInView: { opacity: 1, y: 0, scale: 1 },
                    viewport: { once: true, margin: "100px" },
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                  })}
                  className="text-center mb-12 md:mb-24 pt-24 md:pt-48"
                >
                  <motion.h2
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 50, scale: 0.95 },
                      whileInView: { opacity: 1, y: 0, scale: 1 },
                      viewport: { once: true, margin: "100px" },
                      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                    })}
                    className="text-5xl md:text-6xl lg:text-7xl mb-24 font-bold"
                  >
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                      style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2" }}
                    >
                      Decentralized ETFs
                    </span>
                  </motion.h2>
                  <motion.p
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 50, scale: 0.95 },
                      whileInView: { opacity: 1, y: 0, scale: 1 },
                      viewport: { once: true, margin: "100px" },
                      transition: { duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
                    })}
                    className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-6xl mx-auto font-semibold leading-relaxed mb-4"
                  >
                    Our core innovation is a protocol for tokenized, &ldquo;DEX Traded Funds&rdquo; on Bitcoin layer 1 that bundle together a basket of BTC assets. Allowing holders to not only trade the ETFs on-chain, but also to redeem the underlying assets with 1 click.
                  </motion.p>

                  {/* ETF Infographic */}
                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "100px" },
                      transition: { duration: 1, delay: 0.3, ease: "easeOut" }
                    })}
                    className="relative w-full max-w-3xl mx-auto h-[400px] mt-16 mb-16"
                  >
                    {/* Large Basket/Circle */}
                    <div className="absolute w-[300px] h-[300px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-dashed border-orange-500/70 flex items-center justify-center">
                      <div className="absolute w-[280px] h-[280px] rounded-full bg-black/40 backdrop-blur-sm border border-white/20"></div>
                      
                      {/* ETF Label */}
                      <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-orange-500 text-black font-bold px-4 py-1 rounded-full text-sm">
                       BTC10 ETF
                      </div>
                      
                      {/* Coins inside the basket - positioned in a circular pattern */}
                      {/* Coin 1 - Top */}
                      <div className="absolute w-[60px] h-[60px] top-[30px] left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$DOG</span>
                      </div>
                      
                      {/* Coin 2 - Top Right */}
                      <div className="absolute w-[60px] h-[60px] top-[60px] right-[60px] rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$ORDI</span>
                      </div>
                      
                      {/* Coin 3 - Right */}
                      <div className="absolute w-[60px] h-[60px] top-1/2 right-[30px] transform -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$SATS</span>
                      </div>
                      
                      {/* Coin 4 - Bottom Right */}
                      <div className="absolute w-[60px] h-[60px] bottom-[60px] right-[60px] rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$QCATS</span>
                      </div>
                      
                      {/* Coin 5 - Bottom */}
                      <div className="absolute w-[60px] h-[60px] bottom-[30px] left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$NM</span>
                      </div>
                      
                      {/* Coin 6 - Bottom Left */}
                      <div className="absolute w-[60px] h-[60px] bottom-[60px] left-[60px] rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$OMB</span>
                      </div>
                      
                      {/* Coin 7 - Left */}
                      <div className="absolute w-[60px] h-[60px] top-1/2 left-[30px] transform -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$PUPS</span>
                      </div>
                      
                      {/* Coin 8 - Top Left */}
                      <div className="absolute w-[60px] h-[60px] top-[60px] left-[60px] rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$MIM</span>
                      </div>
                      
                      {/* Coin 9 - Center */}
                      <div className="absolute w-[60px] h-[60px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                        <span className="text-black font-bold text-sm">$RSIC</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Tokenized Inscriptions Section */}
            <section className="w-full py-12 md:py-24 px-8 relative">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  {...getAnimationProps({
                    initial: { opacity: 0, y: 50, scale: 0.95 },
                    whileInView: { opacity: 1, y: 0, scale: 1 },
                    viewport: { once: true, margin: "100px" },
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                  })}
                  className="text-center mb-12 md:mb-24 pt-24 md:pt-48"
                >
                  <motion.h2
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 50, scale: 0.95 },
                      whileInView: { opacity: 1, y: 0, scale: 1 },
                      viewport: { once: true, margin: "100px" },
                      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                    })}
                    className="text-4xl md:text-5xl font-bold mb-8"
                  >
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                      style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2" }}
                    >
                      Tokenized Inscriptions
                    </span>
                  </motion.h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, x: -20 },
                      whileInView: { opacity: 1, x: 0 },
                      viewport: { once: true, margin: "-20%" },
                      transition: { duration: 1, delay: 0.1, ease: "easeOut" }
                    })}
                    className="relative w-full h-[500px] flex items-center justify-center"
                  >
                    {/* Left image */}
                    <motion.div
                      {...getAnimationProps({
                        initial: { opacity: 0, scale: 0.8, rotate: -15 },
                        whileInView: { opacity: 1, scale: 1 },
                        viewport: { once: true },
                        transition: { duration: 1, delay: 0.2 }
                      })}
                      className="absolute w-[220px] h-[220px] left-0 transform -translate-x-[80%] -translate-y-[20%] -rotate-12 shadow-2xl rounded-2xl overflow-hidden"
                      style={{ zIndex: 1 }}
                    >
                      <Image
                        src="/bp.png"
                        alt="Bitcoin Puppets"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl"
                      />
                    </motion.div>

                    {/* Center image */}
                    <motion.div
                      {...getAnimationProps({
                        initial: { opacity: 0, scale: 0.8 },
                        whileInView: { opacity: 1, scale: 1 },
                        viewport: { once: true },
                        transition: { duration: 1, delay: 0.3 }
                      })}
                      className="absolute w-[240px] h-[240px] transform translate-y-[40%] shadow-2xl rounded-2xl overflow-hidden"
                      style={{ zIndex: 3 }}
                    >
                      <Image
                        src="/nm.webp"
                        alt="NodeMonkes"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl"
                      />
                    </motion.div>

                    {/* Right image */}
                    <motion.div
                      {...getAnimationProps({
                        initial: { opacity: 0, scale: 0.8, rotate: 15 },
                        whileInView: { opacity: 1, scale: 1 },
                        viewport: { once: true },
                        transition: { duration: 1, delay: 0.4 }
                      })}
                      className="absolute w-[220px] h-[220px] right-0 transform translate-x-[8%] -translate-y-[20%] rotate-12 shadow-2xl rounded-2xl overflow-hidden"
                      style={{ zIndex: 2 }}
                    >
                      <Image
                        src="/qc.png"
                        alt="Quantum Cats"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, x: 20 },
                      whileInView: { opacity: 1, x: 0 },
                      viewport: { once: true, margin: "-20%" },
                      transition: { duration: 1, delay: 0.2, ease: "easeOut" }
                    })}
                    className="flex flex-col justify-center"
                  >
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                      Additionally, our hybrid inscription protocol tokenizes the top Ordinal collections, enabling them to trade via DEX and CEX. This lowers the financial barrier to entry for blue chips, expanding the potential investor base to the global masses.
                    </p>
                    <ul className="space-y-4 text-gray-300">
                      <li className="flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Trustless Fractionalization
                      </li>
                      <li className="flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Pegged to Collection Floor Price
                      </li>
                      <li className="flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Instant Trading via Runes AMM DEX
                      </li>
                      <li className="flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Provide Liquidity to earn BTC Yield
                      </li>
                      <li className="flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Backed 1:1 by Ordinal Inscriptions & Instantly Redeemable
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* BTC10 Index Fund Section */}
            <section className="w-full py-12 md:py-24 px-8 relative">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  {...getAnimationProps({
                    initial: { opacity: 0, y: 50, scale: 0.95 },
                    whileInView: { opacity: 1, y: 0, scale: 1 },
                    viewport: { once: true, margin: "100px" },
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                  })}
                  className="text-center mb-12 md:mb-24 pt-24 md:pt-48"
                >
                  <motion.h2
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 50, scale: 0.95 },
                      whileInView: { opacity: 1, y: 0, scale: 1 },
                      viewport: { once: true, margin: "100px" },
                      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                    })}
                    className="text-4xl md:text-5xl font-bold mb-12"
                  >
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                      style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2" }}
                    >
                      BTC10
                    </span>
                  </motion.h2>
                  
                  <motion.p
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 50, scale: 0.95 },
                      whileInView: { opacity: 1, y: 0, scale: 1 },
                      viewport: { once: true, margin: "100px" },
                      transition: { duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
                    })}
                    className="text-xl md:text-2xl text-gray-300 max-w-6xl mx-auto font-semibold leading-relaxed mb-16"
                  >
                    The BTC10 ETF is our flagship product that provides diversified exposure to the top 10 assets in the Bitcoin ecosystem. It&apos;s designed to be the simplest way to gain broad market exposure without having to research, purchase, and manage multiple assets individually.
                  </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-20%" },
                      transition: { duration: 1, delay: 0.1, ease: "easeOut" }
                    })}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                  >
                    <div className="text-orange-500 text-4xl mb-4">01</div>
                    <motion.h3
                      {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, margin: "-20%" },
                        transition: { duration: 1, delay: 0.1, ease: "easeOut" }
                      })}
                      className="text-xl font-bold mb-4 text-white"
                    >
                      Weighted by Market Cap
                    </motion.h3>
                    <p className="text-gray-300">
                      Bundled &amp; weighted by market cap so you&apos;ll always have exposure to the most valuable Bitcion assets.
                    </p>
                  </motion.div>

                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-20%" },
                      transition: { duration: 1, delay: 0.2, ease: "easeOut" }
                    })}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                  >
                    <div className="text-orange-500 text-4xl mb-4">02</div>
                    <motion.h3
                      {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, margin: "-20%" },
                        transition: { duration: 1, delay: 0.2, ease: "easeOut" }
                      })}
                      className="text-xl font-bold mb-4 text-white"
                    >
                      Provably Backed 1:1
                    </motion.h3>
                    <p className="text-gray-300">
                    The underlying assets are stored non-custodially onchain in an Arch Network smart contract. The assets are even redeemable with just 1 click, ensuring the NAV price always stays pegged to the AUM value.
                    </p>
                  </motion.div>

                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-20%" },
                      transition: { duration: 1, delay: 0.3, ease: "easeOut" }
                    })}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                  >
                    <div className="text-orange-500 text-4xl mb-4">03</div>
                    <motion.h3
                      {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, margin: "-20%" },
                        transition: { duration: 1, delay: 0.3, ease: "easeOut" }
                      })}
                      className="text-xl font-bold mb-4 text-white"
                    >
                      AI Powered Portfolio Management
                    </motion.h3>
                    <p className="text-gray-300">
                    Our custom ai agent will rebalance the Index Fund autonomously, ensuring optimal weighting of assets to reduce risk and volatility.
                    </p>
                  </motion.div>

                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-20%" },
                      transition: { duration: 1, delay: 0.4, ease: "easeOut" }
                    })}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                  >
                    <div className="text-orange-500 text-4xl mb-4">04</div>
                    <motion.h3
                      {...getAnimationProps({
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, margin: "-20%" },
                        transition: { duration: 1, delay: 0.4, ease: "easeOut" }
                      })}
                      className="text-xl font-bold mb-4 text-white"
                    >
                      S&P500 of BTC
                    </motion.h3>
                    <p className="text-gray-300">
                    As the ecosystem grows our ETF will expand to include the top 100 BTC assets, positioning ourselves as the S&P500 of Bitcoin.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Collaborators and Partners Section */}
            <section className="w-full py-12 md:py-24 px-8 relative">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  {...getAnimationProps({
                    initial: { opacity: 0, y: 50, scale: 0.95 },
                    whileInView: { opacity: 1, y: 0, scale: 1 },
                    viewport: { once: true, margin: "100px" },
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                  })}
                  className="text-center mb-12 md:mb-24 pt-24 md:pt-48"
                >
                  <motion.h2
                    {...getAnimationProps({
                      initial: { opacity: 0, y: 50, scale: 0.95 },
                      whileInView: { opacity: 1, y: 0, scale: 1 },
                      viewport: { once: true, margin: "100px" },
                      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                    })}
                    className="text-3xl md:text-4xl font-bold mb-12"
                  >
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                      style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2" }}
                    >
                      Collaborators & Partners
                    </span>
                  </motion.h2>
                </motion.div>

                {/* Logo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-48 items-center justify-items-center max-w-5xl mx-auto px-8 mb-24 md:mb-48 pb-12 md:pb-24">
                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, scale: 0.8 },
                      whileInView: { opacity: 1, scale: 1 },
                      viewport: { once: true },
                      transition: { duration: 0.5, delay: 0.1 }
                    })}
                    className="relative w-[188px] h-[60px] filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                  >
                    <Image
                      src="/arch.png"
                      alt="Arch"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </motion.div>

                  <motion.div
                    {...getAnimationProps({
                      initial: { opacity: 0, scale: 0.8 },
                      whileInView: { opacity: 1, scale: 1 },
                      viewport: { once: true },
                      transition: { duration: 0.5, delay: 0.2 }
                    })}
                    className="relative w-[200px] h-[60px] filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                  >
                    <Image
                      src="/btcsl.png"
                      alt="BTCSL"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Bottom Glow Effect */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 translate-y-[20%] w-[4000px] h-[2000px] opacity-10 pointer-events-none z-10">
              <div 
                className="w-full h-full rounded-[50%]"
                style={{
                  background: 'radial-gradient(circle at 50% 100%, #FF4500 0%, rgba(255, 69, 0, 0.2) 25%, rgba(255, 69, 0, 0) 50%)',
                  filter: 'blur(120px)',
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}