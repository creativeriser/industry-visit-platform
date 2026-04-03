"use client"

import { useState, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2 } from "lucide-react"

// Next.js polyfill configuration: wire up the PDF.js web worker securely from unpkg CDN
// This bypasses tricky Webpack configuration loaders while rendering perfectly on client.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
    url: string
}

export function PdfViewer({ url }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [containerWidth, setContainerWidth] = useState<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Mathematically calculates the container width utilizing a zero-latency native DOM ResizeObserver
    // This perfectly prevents the "right-edge data clipping" bug caused by dynamic browser scrollbars appearing.
    useEffect(() => {
        const target = containerRef.current
        if (!target) return

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0) {
                    setContainerWidth(entry.contentRect.width)
                }
            }
        })

        observer.observe(target)
        return () => observer.disconnect()
    }, [])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    return (
        <div ref={containerRef} className="w-full flex flex-col items-center overflow-hidden bg-white">
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex flex-col items-center justify-center py-20 text-indigo-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Drawing Canvas Elements...</p>
                    </div>
                }
                error={
                    <div className="p-10 text-center">
                        <p className="text-sm font-bold text-red-500">Failed to render pure canvas pipeline.</p>
                        <p className="text-xs text-slate-500 mt-1">Please ensure the Drive permissions are set to Viewer.</p>
                    </div>
                }
                className="flex justify-center w-full shadow-md"
            >
                {/* Render only the first page completely natively */}
                {containerWidth > 0 && (
                    <Page 
                        pageNumber={1} 
                        width={containerWidth} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="w-full"
                    />
                )}
            </Document>
            
            {/* If it has multiple pages, show an elegant indicator to open standard Drive link */}
            {numPages && numPages > 1 && (
                <div className="bg-slate-50 w-full py-4 text-center border-t border-slate-100 flex items-center justify-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page 1 of {numPages}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-[11px] font-medium text-indigo-500">Preview isolated. Open link to view full document.</span>
                </div>
            )}
        </div>
    )
}
