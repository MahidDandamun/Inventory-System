"use client";
import { useCurrentUser } from "../../hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons"
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
 
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../ui/avatar";


export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu  >
      <DropdownMenuTrigger>
        <Avatar >
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-violet-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>{user?.name || ""}</DropdownMenuLabel>
        <DropdownMenuLabel>{ "Role: (" + user?.role +") "}</DropdownMenuLabel>
        <DropdownMenuLabel className="m-0 font-thin">{user?.email || ""}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <span><Link href="/dashboard/settings"><IoSettingsOutline className="inline h-4 w-4 mr-4" />Settings</Link></span>
          </DropdownMenuItem>
        <DropdownMenuSeparator />

        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <ExitIcon className="h-4 w-4 mr-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>

    
      </DropdownMenuContent>
    </DropdownMenu>
  );
};