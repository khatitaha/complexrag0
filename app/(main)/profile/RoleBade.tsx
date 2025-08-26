// app/profile/RoleBadge.tsx
export default function RoleBadge({ role }: { role: string }) {
    const colorMap: Record<string, string> = {
        admin: 'bg-purple-600 dark:bg-purple-500 text-white',
        user: 'bg-blue-600 dark:bg-blue-500 text-white',
        premium: 'bg-yellow-400 dark:bg-yellow-300 text-black',
    }

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border border-neutral-200 dark:border-neutral-700 shadow-sm transition-colors duration-300 ${colorMap[role] || 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    )
}
