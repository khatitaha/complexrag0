'use client'

import { useEffect, useRef, useState } from 'react'
import { getDocument, version, GlobalWorkerOptions } from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'

GlobalWorkerOptions.workerSrc = '/pdf.worker.js'


// Set up worker only on client
if (typeof window !== 'undefined') {
    // IMPORTANT: Use the local worker from node_modules
    GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`
}

export default function PDFViewer({ url }: { url: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [pageNumber, setPageNumber] = useState(1)

    useEffect(() => {
        const renderPDF = async () => {
            const loadingTask = getDocument(url)
            const pdf = await loadingTask.promise
            const page = await pdf.getPage(pageNumber)

            const viewport = page.getViewport({ scale: 1.5 })
            const canvas = canvasRef.current
            if (!canvas) return
            const context = canvas.getContext('2d')
            canvas.height = viewport.height
            canvas.width = viewport.width

            await page.render({ canvasContext: context!, viewport }).promise
        }

        renderPDF().catch(console.error)
    }, [url, pageNumber])

    return (
        <div>
            <canvas ref={canvasRef} />
            {/* Optional: Navigation */}
            <div className="mt-2">
                <button onClick={() => setPageNumber(p => Math.max(p - 1, 1))}>Prev</button>
                <button onClick={() => setPageNumber(p => p + 1)}>Next</button>
            </div>
        </div>
    )
}
