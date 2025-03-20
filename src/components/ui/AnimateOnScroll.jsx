import React from 'react';
import { motion } from 'framer-motion';

// Reusable component for scroll animations with enhanced visual appeal
const AnimateOnScroll = ({
    children,
    animation = "fadeInUp",
    duration = 1.2, // Increased duration for slower animation
    delay = 0.1, // Added slight initial delay
    staggerChildren = 0.15, // Increased stagger timing
    threshold = 0.15, // Slightly higher threshold for better timing
    once = true,
    className = ""
}) => {
    // Enhanced animation variants library with improved easing
    const animations = {
        fadeInUp: {
            hidden: { opacity: 0, y: 70 }, // Increased distance
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration,
                    delay,
                    ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for smooth deceleration
                }
            }
        },
        fadeIn: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    duration,
                    delay,
                    ease: [0.25, 0.1, 0.25, 1] // Smooth ease-out
                }
            }
        },
        scaleUp: {
            hidden: { opacity: 0, scale: 0.75 }, // More dramatic scale effect
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    delay,
                    ease: [0.34, 1.56, 0.64, 1] // Slight overshoot for bounce effect
                }
            }
        },
        slideInLeft: {
            hidden: { opacity: 0, x: -120 }, // Increased distance
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    duration,
                    delay,
                    ease: [0.25, 1, 0.5, 1] // Smooth deceleration
                }
            }
        },
        slideInRight: {
            hidden: { opacity: 0, x: 120 }, // Increased distance
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    duration,
                    delay,
                    ease: [0.25, 1, 0.5, 1] // Smooth deceleration
                }
            }
        },
        // Added new animations for variety
        fadeInBlur: {
            hidden: { opacity: 0, filter: "blur(8px)" },
            visible: {
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                    duration,
                    delay,
                    ease: "easeOut"
                }
            }
        },
        popIn: {
            hidden: { opacity: 0, scale: 0.4 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    delay,
                    ease: [0.34, 1.56, 0.64, 1] // Pronounced overshoot for pop effect
                }
            }
        }
    };

    // Enhanced container animation for staggered children
    const containerAnimation = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren,
                delayChildren: delay,
                ease: "easeOut",
                duration: 0.3
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
            viewport={{ once, threshold, margin: "-5% 0px -5% 0px" }} // Adjusted margin for better trigger timing
            variants={staggerChildren ? containerAnimation : selectedAnimation}
        >
            {children}
        </motion.div>
    );
};

// Enhanced child component for staggered animations
export const AnimatedChild = ({
    children,
    animation = "fadeInUp",
    duration = 0.8, // Increased duration
    className = ""
}) => {
    const animations = {
        fadeInUp: {
            hidden: { opacity: 0, y: 30 }, // Increased distance
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration,
                    ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for smooth deceleration
                }
            }
        },
        fadeIn: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    duration,
                    ease: "easeOut"
                }
            }
        },
        scaleUp: {
            hidden: { opacity: 0, scale: 0.85 }, // More obvious scale effect
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    ease: [0.34, 1.56, 0.64, 1] // Slight overshoot for bounce effect
                }
            }
        },
        // Added new animations for variety
        fadeInBlur: {
            hidden: { opacity: 0, filter: "blur(4px)" },
            visible: {
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                    duration,
                    ease: "easeOut"
                }
            }
        },
        popIn: {
            hidden: { opacity: 0, scale: 0.6 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    ease: [0.34, 1.56, 0.64, 1] // Pronounced overshoot for pop effect
                }
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