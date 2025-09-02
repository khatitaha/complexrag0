import { motion } from "framer-motion";

export default function SectionSeparator() {
  return (
    <motion.div
      className="w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-green-500/0 my-16"
      initial={{ width: 0 }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  );
}