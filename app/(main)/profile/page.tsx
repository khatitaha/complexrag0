// app/profile/page.tsx

import { createClient } from "@/lib/supabase/server"
import RoleBadge from "./RoleBade"
import SwitchPlanButton from "./SwitchPlanButton"
import { AuthButton } from "@/components/auth-button"


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
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-300 p-6">
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl p-8 w-full max-w-xl transition-colors duration-300">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-700 dark:to-purple-800 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg overflow-hidden">
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

                    <h1 className="text-3xl font-bold mb-1 text-neutral-900 dark:text-white">Your Profile</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">Manage your account information</p>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    <div className="flex items-center py-4 gap-3">
                        <span className="text-xl text-blue-500 dark:text-blue-400">👤</span>
                        <span className="text-neutral-500 dark:text-neutral-400 w-24">Name:</span>
                        <span className="text-neutral-900 dark:text-white font-medium">{profile.display_name || '—'}</span>
                    </div>
                    <div className="flex items-center py-4 gap-3">
                        <span className="text-xl text-green-500 dark:text-green-400">📧</span>
                        <span className="text-neutral-500 dark:text-neutral-400 w-24">Email:</span>
                        <span className="text-neutral-900 dark:text-white font-medium">{profile.email}</span>
                    </div>
                    <div className="flex items-center py-4 gap-3">
                        <span className="text-xl text-yellow-500 dark:text-yellow-400">📅</span>
                        <span className="text-neutral-500 dark:text-neutral-400 w-24">Joined:</span>
                        <span className="text-neutral-900 dark:text-white font-medium">{new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center py-4 gap-3">
                        <span className="text-xl text-purple-500 dark:text-purple-400">🔑</span>
                        <span className="text-neutral-500 dark:text-neutral-400 w-24">Role:</span>
                        <RoleBadge role={profile.role} />
                    </div>
                </div>
                <div className="mt-10 flex  justify-between items-center">
                    <SwitchPlanButton />
                    <AuthButton />
                </div>
            </div>
        </div>
    )
}
