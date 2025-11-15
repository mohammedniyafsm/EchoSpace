"use client";

import getRandomAvatar from "@/components/ui/anonymousCard";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

export default function CommentItem({ c, currentUserId, deleteComment, setEditingComment } : any) {
  const avatar = c.anonymous ? getRandomAvatar() : c.user?.image;
  const name = c.anonymous ? "Anonymous" : c.user?.username;

  return (
    <div className="p-3 border rounded-lg bg-muted/30 text-sm">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatar} className="rounded-full" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>

        {c.user?.id === currentUserId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button><DotsVerticalIcon className="w-5 h-5" /></button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingComment(c)}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => deleteComment(c.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p className="pl-8">{c.comment}</p>
    </div>
  );
}
