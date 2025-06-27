"use client"

import Link from 'next/link'
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

type Props = {}

const UploadPage = (props: Props) => {
    const router = useRouter()
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const [generating, setGenerating] = useState<boolean>(false);



    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
        }
    })

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        const formData = new FormData()
        files.forEach(file => {
            formData.append('files', file)
        })

        try {
            setGenerating(true);
            const response = await fetch('/api/uploadedFile', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                setGenerating(false);

                throw new Error('Upload failed')

            }

            const data = await response.json()
            console.log(data);
            if (data.fileRoute) {

                await new Promise((res) => setTimeout(res, 10000));
                setGenerating(false);

                router.push(`/WB0/${data.fileRoute}`)
                console.log(" the data akhsakhsakhas : : : : : :", data.fileRoute)
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            // Handle error appropriately
        }
    }

    return (
        <div className="min-h-screen bg-neutral-900 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-neutral-100 mb-8">Upload Study Materials</h1>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                    <Link href="/whiteBoard">
                        go to whiteBoard
                    </Link>
                </button>

                {/* Upload Area */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-neutral-700 hover:border-blue-400'}`}
                >
                    <input {...getInputProps()} />
                    <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg text-neutral-200 mb-2">
                        {isDragActive ? "Drop your files here" : "Drag & drop files here, or click to select"}
                    </p>
                    <p className="text-sm text-neutral-500">
                        Supports PDF, Word, Excel, PowerPoint, TXT, and Markdown files
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {generating && (
                    <div className="mt-4 p-4 bg-red-50 text-blue-600 rounded-lg">
                        we are generting g just wait a sec
                    </div>
                )}



                {/* File List */}
                {files.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Selected Files</h2>
                        <div className="space-y-3">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-neutral-800 p-4 rounded-lg shadow-sm">
                                    <div className="flex items-center space-x-3">
                                        <FiFile className="w-5 h-5 text-neutral-200" />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-100">{file.name}</p>
                                            <p className="text-xs text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-neutral-600 hover:text-red-500 transition-colors"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={uploading || uploadComplete}
                            className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                                ${uploading || uploadComplete
                                    ? 'bg-green-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : uploadComplete ? (
                                <span className="flex items-center justify-center">
                                    <FiCheck className="mr-2" />
                                    Upload Complete!
                                </span>
                            ) : (
                                'Upload Files'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UploadPage