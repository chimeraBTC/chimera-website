import { Inter } from 'next/font/google';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import WavyBackground from '@/components/WavyBackground';
import dynamic from 'next/dynamic';
import { FaTwitter, FaDiscord, FaBook, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BitcoinModel } from '@/components/BitcoinModel';
import * as THREE from 'three';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import WaveBackground with no SSR
const WaveBackground = dynamic(() => import('@/components/WaveBackground'), { ssr: false });

export default function Home() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [mempoolFee, setMempoolFee] = useState<number | null>(null);
  const [showArrow, setShowArrow] = useState(true);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [paymentPubkey, setPaymentPubkey] = useState("");
  const [ordinalAddress, setOrdinalAddress] = useState("");
  const [ordinalPubkey, setOrdinalPubkey] = useState("");

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
                  className="flex flex-col space-y-4 lg:pr-0"
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-center lg:text-right">
                    <motion.h1
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                    >
                      The first Hybrid<br />
                      <span 
                        className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                        style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2", paddingBottom: "0.2em" }}
                      >
                        DeFi Platform
                      </span><br />
                      on Bitcoin
                    </motion.h1>
                  </div>
                </motion.div>

                {/* Right Column - 3D Object */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="relative w-full h-[40vh] hidden md:block"
                  style={{ 
                    touchAction: 'none',
                    cursor: 'grab',
                    zIndex: 10,
                    position: 'relative'
                  }}
                >
                  <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
                    <Canvas
                      camera={{ position: [0, 0, 4], fov: 45 }}
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      gl={{
                        alpha: true,
                        antialias: true,
                        preserveDrawingBuffer: true,
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 0.25
                      }}
                    >
                      {/* Lighting setup for better highlights */}
                      <ambientLight intensity={0.008} />
                      <directionalLight
                        position={[5, 5, 5]}
                        intensity={0.04}
                        castShadow
                      />
                      
                      {/* High quality environment map with increased contrast */}
                      <Environment
                        preset="studio"
                        background={false}
                        resolution={256}
                      />

                      <BitcoinModel />
                      <OrbitControls
                        makeDefault
                        enableZoom={false}
                        enablePan={false}
                        rotateSpeed={0.7}
                        dampingFactor={0.05}
                        enableDamping
                      />
                      
                      <EffectComposer>
                        <Bloom 
                          intensity={0.5}
                          luminanceThreshold={0.7}
                          luminanceSmoothing={0.3}
                          mipmapBlur
                          radius={0.4}
                        />
                      </EffectComposer>
                    </Canvas>
                  </div>
                </motion.div>
              </div>

              {/* Blinking Down Arrow */}
              {showArrow && (
                <motion.div 
                  className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FaChevronDown className="text-white/60 text-2xl" style={{ strokeWidth: 1 }} />
                </motion.div>
              )}
            </section>

            <section className="w-full py-24 px-8 relative">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center mb-24 pt-48"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-6xl lg:text-7xl mb-24 font-bold"
                  >
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                      style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2" }}
                    >
                      What is Hybrid DeFi?
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-6xl mx-auto font-semibold leading-relaxed mb-4"
                  >
                    Hybrid DeFi unifies the entire onchain ecosystem into one seamless trading experience, including both non-fungible and fungible assets.
                  </motion.p>
                </motion.div>

                {/* Core Features Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center mb-24 pt-48"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-6xl font-bold mb-2"
                  >
                    <span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                      style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2" }}
                    >
                      Core Features
                    </span>
                  </motion.h2>
                </motion.div>

                {/* Core Features Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10 text-center"
                  >
                    <div className="text-orange-500 text-4xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="text-2xl font-bold"
                    >
                      Tokenized Inscriptions
                    </motion.h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10 text-center"
                  >
                    <div className="text-orange-500 text-4xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                      className="text-2xl font-bold"
                    >
                      BTC10 Index Fund
                    </motion.h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10 text-center"
                  >
                    <div className="text-orange-500 text-4xl mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                      className="text-2xl font-bold"
                    >
                      LP to Earn
                    </motion.h3>
                  </motion.div>
                </div>

                {/* Detailed Sections */}
                
                {/* Tokenized Inscriptions Section */}
                <section className="w-full py-24 px-8 relative">
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "100px" }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-center mb-24 pt-48"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-bold mb-12"
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
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                        className="relative w-full h-[500px] flex items-center justify-center"
                      >
                        {/* Left image */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
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
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
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
                          initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.4 }}
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
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-col justify-center"
                      >
                        <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">
                          Making Blue Chips Accessible
                        </h3>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                          Our hybrid inscription protocol fractionalizes the top Ordinal collections, enabling them to trade as fungible "floor price index tokens". These Runes tokens can be swapped back for the underlying Inscriptions at any time.
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
                            Backed 1:1 by Ordinal Inscriptions
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </section>

                {/* BTC10 Index Fund Section */}
                <section className="w-full py-24 px-8 relative">
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "100px" }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-center mb-24 pt-48"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-bold mb-12"
                      >
                        <span 
                          className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                          style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2" }}
                        >
                          BTC10 Index Fund
                        </span>
                      </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                        className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                      >
                        <div className="text-orange-500 text-4xl mb-4">01</div>
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20%" }}
                          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                          className="text-xl font-bold mb-4"
                        >
                          Trading Made Simple
                        </motion.h3>
                        <p className="text-gray-300">
                          We&apos;ve removed the friction and complexity of trading BTC assets, making it effortless to invest in the BTC Layer 1 ecosystem.
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                      >
                        <div className="text-orange-500 text-4xl mb-4">02</div>
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20%" }}
                          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                          className="text-xl font-bold mb-4"
                        >
                          Back by Blue Chip Assets
                        </motion.h3>
                        <p className="text-gray-300">
                        The index fund is backed by a combination of top 10 BTC assets across Ordinals, Runes & BRC20.
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                      >
                        <div className="text-orange-500 text-4xl mb-4">03</div>
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20%" }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          className="text-xl font-bold mb-4"
                        >
                          AI Powered Portfolio Management
                        </motion.h3>
                        <p className="text-gray-300">
                        Our custom ai agent will rebalance the Index Fund autonomously, ensuring optimal weighting of assets to reduce risk and volatility.
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="bg-black/30 backdrop-blur-sm rounded-xl p-10 border border-white/10"
                      >
                        <div className="text-orange-500 text-4xl mb-4">04</div>
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20%" }}
                          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                          className="text-xl font-bold mb-4"
                        >
                          S&P500 of BTC
                        </motion.h3>
                        <p className="text-gray-300">
                        As the ecosystem grows our index will expand to include the top 100 BTC assets, positioning ourselves as the S&P500 of Bitcoin.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </section>

                {/* Collaborators and Partners Section */}
                <section className="w-full py-24 px-8 relative">
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "100px" }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-center mb-24"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-48 items-center justify-items-center max-w-5xl mx-auto px-8 mb-48">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative w-[200px] h-[60px] filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                      >
                        <Image
                          src="/arch.png"
                          alt="Arch"
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
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
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 translate-y-[20%] w-[4000px] h-[2000px] opacity-20 pointer-events-none z-10">
                  <div 
                    className="w-full h-full rounded-[50%]"
                    style={{
                      background: 'radial-gradient(circle at 50% 100%, #FF4500 0%, rgba(255, 69, 0, 0.3) 25%, rgba(255, 69, 0, 0) 50%)',
                      filter: 'blur(120px)',
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Remove the old footer and replace with the new Footer component */}
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}