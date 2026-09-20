import { Skeleton } from "@/components/ui/skeleton"

export function DataTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="rounded-md border">
                <div className="border-b px-4 py-3 flex gap-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
                <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-8 w-1/4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
