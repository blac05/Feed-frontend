import { motion } from "framer-motion";

export default function GiftAnimation({ emoji }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 100,
        scale: 0.5,
      }}
      animate={{
        opacity: [0, 1, 0],
        y: [100, -300, 100],
        scale: [0.5, 1.5, 0.5],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        loop: Infinity,
      }}
      className="fixed bottom-10 right-10 text-6xl pointer-events-none"
    >
      {emoji}
    </motion.div>
  );
}