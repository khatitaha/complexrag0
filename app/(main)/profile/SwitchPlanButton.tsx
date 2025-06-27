// app/profile/SwitchPlanButton.tsx
'use client'

export default function SwitchPlanButton() {
    return (
        <button
            onClick={() => alert('Redirect to plan upgrade UI')}
            className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-xl text-white font-semibold shadow"
        >
            🚀 Switch Plan
        </button>
    )
}
