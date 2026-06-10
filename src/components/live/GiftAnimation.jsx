import { motion } from "framer-motion";

export default function GiftAnimation({
  emoji,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 100,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        y: -300,
        scale: 1.5,
      }}
      transition={{
        duration: 2,
      }}
      className="fixed bottom-10 right-10 text-6xl pointer-events-none"
    >
      {emoji}
    </motion.div>
  );
}