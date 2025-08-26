import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

const AiSkilitonLoading = (props: Props) => {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[450px]" />
                <Skeleton className="h-4 w-[400px]" />
                <Skeleton className="h-6 w-[400px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>
        </div>
    )
}

export default AiSkilitonLoading