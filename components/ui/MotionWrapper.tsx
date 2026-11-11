"use client";

import React from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

interface MotionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

// Fade in up (standard AOS fade-up)
export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  ...props
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Fade in from left (AOS fade-right)
export function FadeInLeft({
  children,
  className = "",
  delay = 0,
  duration = 0.55,
  ...props
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Fade in from right (AOS fade-left)
export function FadeInRight({
  children,
  className = "",
  delay = 0,
  duration = 0.55,
  ...props
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Scale in (AOS zoom-in)
export function ScaleIn({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  ...props
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container for Grids
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  ...props
}: MotionProps & { staggerDelay?: number }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.08 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item child for grid items
export function StaggerItem({
  children,
  className = "",
  ...props
}: MotionProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// Interactive card with smooth hover elevation
export function HoverCard({
  children,
  className = "",
  ...props
}: MotionProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
