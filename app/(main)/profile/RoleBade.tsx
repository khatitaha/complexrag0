// app/profile/RoleBadge.tsx
export default function RoleBadge({ role }: { role: string }) {
    const colorMap: Record<string, string> = {
        admin: 'bg-purple-600',
        user: 'bg-blue-600',
        premium: 'bg-yellow-500 text-black',
    }

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorMap[role] || 'bg-neutral-500'}`}>
            {role}
        </span>
    )
}
