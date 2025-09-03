// app/profile/page.tsx

import { createClient } from "@/lib/supabase/server"
import RoleBadge from "./RoleBade"
import SwitchPlanButton from "./SwitchPlanButton"
import { AuthButton } from "@/components/auth-button"
import { FiUser, FiMail, FiCalendar, FiKey, FiTrendingUp, FiBookOpen, FiTarget, FiClock, FiSettings, FiLogOut, FiEdit3, FiCamera, FiFileText } from 'react-icons/fi'
import Link from "next/link"


export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div className="text-white p-10">Not logged in</div>
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return <div className="text-white p-10">Profile not found</div>
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-16 px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full px-4 py-2 border border-blue-500/20 mb-6">
                        <FiUser className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Profile Dashboard</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent mb-4">
                        Welcome Back!
                    </h1>

                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
                        Manage your account, view your progress, and customize your learning experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Profile Card */}
                        <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-neutral-200 dark:border-neutral-700">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                                {/* Avatar Section */}
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden">
                                    {profile.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt={profile.display_name || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        profile.display_name
                                            ? profile.display_name
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                                .toUpperCase()
                                            : "👤"
                                    )}
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                                        {profile.display_name || 'Anonymous User'}
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                        Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <RoleBadge role={profile.role} />
                                        <span className="text-sm text-neutral-500 dark:text-neutral-400">•</span>
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Active Learner</span>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                            <FiUser className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Full Name</div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                {profile.display_name || 'Not set'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <FiMail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Email Address</div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                {profile.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <FiKey className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Account Role</div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                <RoleBadge role={profile.role} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                            <FiCalendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Member Since</div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                {new Date(profile.created_at).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Account Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SwitchPlanButton />
                                <AuthButton />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3 flex flex-col">
                                <Link href="/uploadingfile">
                                    <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 hover:scale-105">
                                        <FiBookOpen className="w-5 h-5" />
                                        <span className="font-medium">Create New Lesson</span>
                                    </button>
                                </Link>

                                <Link href="/exams">
                                    <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 hover:scale-105">
                                        <FiTarget className="w-5 h-5" />
                                        <span className="font-medium">Take Practice Exam</span>
                                    </button>
                                </Link>

                                <Link href="/uploadingfile">
                                    <button className="w-full flex items-center gap-3 p-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-lg transition-all duration-200">
                                        <FiFileText className="w-5 h-5" />
                                        <span className="font-medium">Upload Document</span>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Account Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Status</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Last Login</span>
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">Today</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Plan</span>
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">Free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' h-20'></div>
        </div>
    )
}
