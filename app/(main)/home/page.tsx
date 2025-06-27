import Link from 'next/link'
import React from 'react'
import { FiUpload, FiArrowRight, FiUser, FiBook, FiHome } from 'react-icons/fi'

type Props = {}

const HomePage = (props: Props) => {
    return (
        <div className="h-full bg-gradient-to-br from-neutral-950 to-neutral-900 relative overflow-hidden">


            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center pt-16">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 text-center px-4">
                    <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-24 bg-neutral-900 rounded-2xl shadow-lg mx-auto mb-6 flex items-center justify-center">
                            <FiUpload className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Upload Your Lesson
                    </h1>

                    <p className="text-neutral-400 mb-12 max-w-md mx-auto text-lg">
                        Transform your study materials into interactive learning content
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/uploadingfile">
                            <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <span className="relative z-10 flex items-center">
                                    <FiUpload className="w-6 h-6 mr-2" />
                                    Upload Lesson
                                    <FiArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </Link>
                        <Link href="/lessons">
                            <button className="group relative inline-flex items-center px-8 py-4 bg-neutral-900 text-neutral-100 text-lg font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                                <span className="relative z-10 flex items-center">
                                    <FiBook className="w-6 h-6 mr-2" />
                                    View Lessons
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage