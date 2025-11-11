import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "@/lib/animations";

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

export const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};