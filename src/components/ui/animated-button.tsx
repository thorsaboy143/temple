import { motion } from "framer-motion";
import { Button as BaseButton } from "@/components/ui/button";
import { buttonTap, buttonHover } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface AnimatedButtonProps extends ComponentProps<typeof BaseButton> {
  isLoading?: boolean;
}

export const AnimatedButton = ({ 
  children, 
  className, 
  isLoading,
  ...props 
}: AnimatedButtonProps) => {
  return (
    <motion.div
      whileTap={buttonTap}
      whileHover={buttonHover}
      style={{ transformOrigin: "center" }}
    >
      <BaseButton
        className={cn(
          "transition-[background,opacity,shadow] duration-180", 
          className
        )}
        {...props}
      >
        {isLoading ? (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity
            }}
          />
        ) : children}
      </BaseButton>
    </motion.div>
  );
};