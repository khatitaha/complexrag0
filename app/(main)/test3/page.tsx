import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <div className=' bg-neutral-800 flex justify-between h-screen'>
            <div className=' bg-green-950 flex-1'>
                screen 2
            </div>
            <div className='bg-red-950 flex-1 relative'>
                screen one
                <div className=' w-[40%] bg-white p-3 absolute'></div>
            </div>
        </div>
    )
}

export default page