import { motion } from "framer-motion";
import { Input as BaseInput } from "@/components/ui/input";
import { fieldFocus } from "@/lib/animations";
import { ComponentProps } from "react";

export const AnimatedInput = (props: ComponentProps<typeof BaseInput>) => {
  return (
    <motion.div whileFocus={fieldFocus}>
      <BaseInput {...props} />
    </motion.div>
  );
};