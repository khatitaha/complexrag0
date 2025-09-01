'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX, FiCheck, FiLink } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const UploadPage = () => {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generating, setGenerating] = useState<boolean>(false);

    const [url, setUrl] = useState('');
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
        }
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        try {
            setError(null);
            setUploading(true);
            setUploadComplete(false);
            setGenerating(false);

            const response = await fetch("/api/uploadedFile", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            if (data.fileRoute) {
                setUploading(false);
                setUploadComplete(true);
                setGenerating(true);
                await new Promise((res) => setTimeout(res, 1500));
                router.push(`/l/${data.fileRoute}`);
            }
        } catch (err) {
            setError("Something went wrong during upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUrlLoading(true);
        setUrlError(null);

        try {
            const response = await fetch('/api/lesson-from-urls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create lesson from URL');
            }

            const { lessonId } = await response.json();
            router.push(`/l/${lessonId}`);
        } catch (err: any) {
            setUrlError(err.message);
        } finally {
            setIsUrlLoading(false);
        }
    };

    return (
        <div className="min-h-screen dark:bg-neutral-900 bg-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto mt-12">
                <h1 className="text-3xl font-bold dark:text-neutral-100 text-neutral-900 mb-8 text-center">Create a New Lesson</h1>

                {/* Upload Area */}
                <Card className="w-full shadow-lg mb-12">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FiUpload /> Upload a File</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-400'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-lg dark:text-neutral-200 text-neutral-800 mb-2">
                                {isDragActive ? "Drop your files here" : "Drag & drop files, or click to select"}
                            </p>
                            <p className="text-sm text-neutral-500">Supports PDF, DOCX, and TXT</p>
                        </div>

                        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                        {uploading && !uploadComplete && <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-lg">Uploading...</div>}
                        {generating && <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">Generating your lesson... ✨</div>}
                        {uploadComplete && !generating && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">Upload Complete!</div>}

                        {files.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Selected Files:</h3>
                                <div className="space-y-3">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between dark:bg-neutral-800 bg-neutral-100 p-3 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <FiFile className="w-5 h-5 text-neutral-500" />
                                                <div>
                                                    <p className="text-sm font-medium dark:text-neutral-100 text-neutral-900">{file.name}</p>
                                                    <p className="text-xs dark:text-neutral-400 text-neutral-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFile(index)} className="text-neutral-500 hover:text-red-500"><FiX /></button>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={handleUpload} disabled={uploading || uploadComplete} className="mt-6 w-full" size="lg">
                                    {uploading ? 'Uploading...' : uploadComplete ? <><FiCheck className="mr-2" /> Uploaded</> : 'Upload & Generate'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Divider */}
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-neutral-700"></div>
                    <span className="flex-shrink mx-4 text-gray-400 dark:text-neutral-500">OR</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-neutral-700"></div>
                </div>

                {/* URL Creation Area */}
                <Card className="w-full shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FiLink /> Create from URL</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://example.com/article"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    disabled={isUrlLoading}
                                />
                            </div>
                            <Button type="submit" disabled={isUrlLoading} className="w-full" size="lg">
                                {isUrlLoading ? 'Generating Lesson...' : 'Generate from URL'}
                            </Button>
                            {urlError && <p className="text-sm text-red-500 text-center pt-2">{urlError}</p>}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default UploadPage;
