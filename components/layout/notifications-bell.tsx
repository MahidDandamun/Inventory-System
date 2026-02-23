"use client"

import { useTransition } from "react"
import { IconBell } from "@tabler/icons-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/app/(dashboard)/_actions/notification"
import { type NotificationDTO } from "@/lib/dal/notifications"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function NotificationsBell({ initialNotifications }: { initialNotifications: NotificationDTO[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const unreadCount = initialNotifications.filter(n => !n.isRead).length

    const handleMarkAsRead = (id: string) => {
        startTransition(async () => {
            const result = await markNotificationAsRead(id)
            if (result?.error) toast.error(result.error)
            else router.refresh()
        })
    }

    const handleMarkAllAsRead = () => {
        startTransition(async () => {
            const result = await markAllNotificationsAsRead()
            if (result?.error) toast.error(result.error)
            else router.refresh()
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <IconBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <p className="font-semibold text-sm">Notifications</p>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-auto text-xs px-2 py-1" onClick={handleMarkAllAsRead} disabled={isPending}>
                            Mark all read
                        </Button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {initialNotifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</p>
                    ) : (
                        initialNotifications.map(n => (
                            <div key={n.id} className={`flex flex-col p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${!n.isRead ? 'bg-muted/20' : ''}`} onClick={() => !n.isRead && handleMarkAsRead(n.id)}>
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-medium text-sm">{n.title}</p>
                                    {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500 mt-1.5" />}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
