import { IconLoader2 } from "@tabler/icons-react"

export default function DashboardLoading() {
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Loading...</p>
            </div>
        </div>
    )
}
