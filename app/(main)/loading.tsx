"use client";

import { Loader2 } from "lucide-react"; // spinner icon
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <Loader2 className="w-12 h-12 text-blue-500" />
            </motion.div>
        </div>
    );
}
