import Link from "next/link"
import { signOut } from "@/auth"
import { getCurrentUser } from "@/lib/auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconUser, IconLogout, IconSettings } from "@tabler/icons-react"

export async function UserButton() {
    const user = await getCurrentUser()

    if (!user) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary">
                    <IconUser className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Settings */}
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                        <IconSettings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Log out */}
                <form
                    action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/login" })
                    }}
                >
                    <DropdownMenuItem asChild>
                        <button type="submit" className="w-full justify-start cursor-pointer flex items-center">
                            <IconLogout className="mr-2 h-4 w-4" />
                            Log out
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
