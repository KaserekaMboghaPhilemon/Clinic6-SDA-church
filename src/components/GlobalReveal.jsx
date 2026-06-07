import React, { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

function GlobalReveal({ children, className = '', as = 'div', staggerChildren = 0, ...rest }) {
  const ref = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
      {...(staggerChildren > 0
        ? {
            variants: {
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: 'easeOut',
                  staggerChildren,
                },
              },
            },
          }
        : {})}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

function GlobalRevealItem({ children, className = '', as = 'div', ...rest }) {
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export { GlobalReveal, GlobalRevealItem }
