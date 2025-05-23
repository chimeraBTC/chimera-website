import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Update the gradient animation constant
const gradientAnimation = {
  backgroundSize: "200% 200%",
  animation: "gradient 2s linear infinite",
};

interface IHeader {
  unisatConnectWallet: () => void;
  paymentAddress: string;
  setPaymentAddress: (e: string) => void;
  paymentPubkey: string;
  setPaymentPubkey: (e: string) => void;
  ordinalAddress: string;
  setOrdinalAddress: (e: string) => void;
  ordinalPubkey: string;
  setOrdinalPubkey: (e: string) => void;
}

export default function Header(props: IHeader) {
  const {
    setPaymentAddress,
    setOrdinalAddress,
    setOrdinalPubkey,
    setPaymentPubkey
  } = props;

  useEffect(() => {
    const userAddress = localStorage.getItem("paymentAddress");
    setPaymentAddress(userAddress ? userAddress : "");
    const ordinalAddress = localStorage.getItem("ordinalAddress");
    setOrdinalAddress(ordinalAddress ? ordinalAddress : "");
    const ordinalPubkey = localStorage.getItem("ordinalPubkey");
    setOrdinalPubkey(ordinalPubkey ? ordinalPubkey : "");
    const paymentPubkey = localStorage.getItem("paymentPubkey");
    setPaymentPubkey(paymentPubkey ? paymentPubkey : "");
  }, [setPaymentAddress, setOrdinalAddress, setOrdinalPubkey, setPaymentPubkey]);

  return (
    <>
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
        </div>
      </motion.header>
    </>
  );
} 