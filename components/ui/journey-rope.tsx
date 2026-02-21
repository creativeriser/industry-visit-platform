"use client"

import { motion, useScroll, useTransform, MotionValue, useSpring } from "framer-motion"
import { useRef } from "react"

export function JourneyRope() {
    const ref = useRef<HTMLDivElement>(null)

    // Track the Rope's progress relative to the Viewport Center.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"]
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const fillHeight = useTransform(smoothProgress, [0.0, 0.70], ["0%", "100%"]);

    return (
        <div ref={ref} className="relative w-full h-full flex justify-center z-0">

            {/* TRACK (Grey Line) */}
            <div className="absolute top-[18%] bottom-[12%] w-6 bg-slate-200 rounded-full" />

            {/* FILL (Solid Blue Line) */}
            <div className="absolute top-[18%] bottom-[12%] w-6 rounded-full overflow-hidden">
                <motion.div
                    className="w-full bg-blue-600 origin-top rounded-full"
                    style={{ height: fillHeight }}
                />
            </div>

            {/* NODES: Exact Thresholds. 32px Size. */}
            <Node top="18%" scrollProgress={smoothProgress} threshold={0.0} />
            <Node top="53%" scrollProgress={smoothProgress} threshold={0.35} />
            <Node top="88%" scrollProgress={smoothProgress} threshold={0.70} />

        </div>
    )
}

function Node({ top, scrollProgress, threshold }: { top: string, scrollProgress: MotionValue<number>, threshold: number }) {
    // NODE BEHAVIOR (Restored Phase 28):
    // Active if scroll >= threshold.
    // 32px (w-8) Sizing.
    // Dominant over the 24px (w-6) Rop.

    const backgroundColor = useTransform(scrollProgress,
        [threshold - 0.005, threshold],
        ["#e2e8f0", "#2563eb"] // slate-200 (Inactive) -> blue-600 (Active)
    )

    return (
        <motion.div
            className="absolute -translate-y-1/2 w-8 h-8 rounded-full shadow-sm z-10 border-2 border-white"
            style={{
                top,
                backgroundColor
            }}
        />
    )
}
