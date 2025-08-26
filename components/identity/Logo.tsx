import Link from 'next/link'
import React from 'react'

type Props = {}

const WebsiteLogo = (props: Props) => {
    return (
        <Link className="text-2xl  tracking-tight" href={'/home'}>
            <span className="bg-gradient-to-r from-cyan-500 text-3xl font-extrabold to-green-400 bg-clip-text text-transparent">
                Azam
            </span>
            <span className="text-gray-800 dark:text-white font-semibold">Studying</span>
        </Link>
    )
}

export default WebsiteLogo