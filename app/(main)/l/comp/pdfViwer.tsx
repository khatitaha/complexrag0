'use client';

export default function PdfViewer({ url }: { url: string }) {
    return (
        <div className="w-full h-full">
            <embed
                src={url}
                type="application/pdf"
                className="w-full h-full rounded-md border border-neutral-700"
            />
        </div>
    );
}
