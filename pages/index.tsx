import { Inter } from 'next/font/google';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import WavyBackground from '@/components/WavyBackground';
import { FaTwitter, FaTelegramPlane, FaDiscord, FaBook, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BitcoinModel } from '@/components/BitcoinModel';
import * as THREE from 'three';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const fetchBtcPrice = () => {
      fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json')
        .then(response => response.json())
        .then(data => setBtcPrice(data.bpi.USD.rate));
    };

    fetchBtcPrice();
    const intervalId = setInterval(fetchBtcPrice, 5000);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <Head>
        <title>CHIMERA BTC</title>
        <link rel="icon" href="/chimera-icon.svg" />
      </Head>

      {/* Header Bar */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm h-16"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/chimera-wide.svg"
              alt="Chimera"
              width={180}
              height={40}
              className="h-8 w-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/your-dapp">
              <motion.button
                className="px-6 py-2 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 },
                  filter: 'brightness(1.1)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Launch dApp
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section with Wavy Background */}
      <WavyBackground className="fixed inset-0 w-full h-full z-[-1]" />
      
      {/* Hero Section */}
      <section className="min-h-screen w-full flex items-center justify-center px-8">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Header */}
          <motion.div
            className="flex flex-col space-y-4 lg:pr-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="text-center lg:text-right">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
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
            className="relative w-full h-[40vh]"
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
                  intensity={0.1}
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
            <FaChevronDown className="text-white text-4xl animate-pulse" />
          </motion.div>
        )}
      </section>

      {/* Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/30 to-transparent"
        style={{
          top: '20%',  
          height: '60%',
          opacity: 0.4,
        }}
      />

      {/* What is Hybrid DeFi Section */}
      <section className="w-full py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAA00] via-[#FFD700] to-[#FFAA00]"
                style={{ textShadow: "rgba(255, 170, 0, 0.5) 0px 0px 10px", lineHeight: "1.2", paddingBottom: "0.2em" }}
              >
                What is Hybrid DeFi?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hybrid DeFi unifies the entire onchain ecosystem into one seamless trading experience, including both non-fungible and fungible assets. <br></br><br></br> Our protocol enables tokenized Inscriptions as well as trustless Index Funds for the top digital assets on BTC.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-4">Tokenized Inscriptions</h3>
              <p className="text-gray-300">
                Gain exposure to your favorite Digital Artifacts on BTC by investing in their floor index tokens. Instantly trade in/out of your positions via our Hybrid AMM DEX.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-4">Ordinals/Runes Index Funds</h3>
              <p className="text-gray-300">
                Invest in the top projects of entire asset classes such as the Ordinals or Runes protocols with our market-cap weighted, automatically rebalanced Index Funds.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-4">LP to Earn</h3>
              <p className="text-gray-300">
                Provide liquidity for our Index Fund tokens on our Hybrid AMM DEX and earn trading fees. This means you can now earn passive yield on your Ordinals Inscriptions & more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 pb-40 bg-gradient-to-b from-black via-orange-800/10 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Platform Metrics
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: "$250M+", label: "Total Value Locked" },
              { value: "50K+", label: "Active Users" },
              { value: "99.99%", label: "Uptime" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="fixed bottom-0 w-full h-16 bg-black border-t border-gray-400 flex items-center justify-between px-4 z-50">
        <div className="flex items-center text-gray-400">
          <Image src="/btclogo.png" alt="Bitcoin Logo" width={30} height={30} />
          <span className="ml-2">{btcPrice ? `$${btcPrice}` : 'Loading...'}</span>
        </div>
        <div className="flex items-center border-l border-gray-400 pl-4">
          <Link href="https://twitter.com/chimeraBTC" className="text-gray-400 mx-2 hover:text-white"><FaTwitter size={24} /></Link>
          <Link href="https://t.me/gh0stc0in" className="text-gray-400 mx-2 hover:text-white"><FaTelegramPlane size={24} /></Link>
          <Link href="https://discord.gg/gh0stlabs" className="text-gray-400 mx-2 hover:text-white"><FaDiscord size={24} /></Link>
          <Link href="https://docs.gh0stlabs.io" className="text-gray-400 mx-2 hover:text-white"><FaBook size={24} /></Link>
        </div>
      </footer>
    </main>
  );
}