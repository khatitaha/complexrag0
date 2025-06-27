// app/profile/page.tsx

import { createClient } from "@/lib/supabase/server"
import RoleBadge from "./RoleBade"
import SwitchPlanButton from "./SwitchPlanButton"


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
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6">
            <div className="bg-neutral-800 rounded-2xl shadow-xl p-8 w-full max-w-xl">
                <h1 className="text-3xl font-bold mb-6">👤 Your Profile</h1>

                <div className="space-y-4 text-lg">
                    <div><span className="text-neutral-400"> Name:</span> {profile.name || '—'}</div>
                    <div><span className="text-neutral-400">Email:</span> {profile.email}</div>
                    <div><span className="text-neutral-400">Joined:</span> {new Date(profile.created_at).toLocaleDateString()}</div>
                    <div className="flex items-center space-x-2">
                        <span className="text-neutral-400">Role:</span>
                        <RoleBadge role={profile.role} />
                    </div>
                </div>

                <div className="mt-8">
                    <SwitchPlanButton />
                </div>
            </div>
        </div>
    )
}
