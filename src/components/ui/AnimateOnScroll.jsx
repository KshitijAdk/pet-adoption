import React from 'react';
import { motion } from 'framer-motion';

// Reusable component for scroll animations
const AnimateOnScroll = ({
    children,
    animation = "fadeInUp",
    duration = 0.8,
    delay = 0,
    staggerChildren = 0.1,
    threshold = 0.1,
    once = true,
    className = ""
}) => {
    // Animation variants library
    const animations = {
        fadeInUp: {
            hidden: { opacity: 0, y: 50 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration,
                    delay
                }
            }
        },
        fadeIn: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    duration,
                    delay
                }
            }
        },
        scaleUp: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    delay
                }
            }
        },
        slideInLeft: {
            hidden: { opacity: 0, x: -100 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    duration,
                    delay
                }
            }
        },
        slideInRight: {
            hidden: { opacity: 0, x: 100 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    duration,
                    delay
                }
            }
        }
    };

    // Container animation for staggered children
    const containerAnimation = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren,
                delayChildren: delay
            }
        }
    };

    // Choose the appropriate animation variant
    const selectedAnimation = animations[animation] || animations.fadeInUp;

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, threshold }}
            variants={staggerChildren ? containerAnimation : selectedAnimation}
        >
            {children}
        </motion.div>
    );
};

// Child component for staggered animations
export const AnimatedChild = ({
    children,
    animation = "fadeInUp",
    duration = 0.5,
    className = ""
}) => {
    const animations = {
        fadeInUp: {
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration }
            }
        },
        fadeIn: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { duration }
            }
        },
        scaleUp: {
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: { duration }
            }
        }
    };

    const selectedAnimation = animations[animation] || animations.fadeInUp;

    return (
        <motion.div className={className} variants={selectedAnimation}>
            {children}
        </motion.div>
    );
};

export default AnimateOnScroll;