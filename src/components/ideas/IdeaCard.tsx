"use client";

import { cn } from "@/lib/utils";
import { bricolage_grotesque } from "@/lib/fonts";
import { Lightbulb, Heart } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import getRandomAvatar from "@/components/ui/anonymousCard";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  author?: string;
  timestamp?: string;
  category?: string;
  avatar?: string;
  className?: string;
  totalLikes: number;
  currentUserLiked: boolean;
  userId: string;
  setIdeas: any;
  isAnonymous?: boolean;
}

export function IdeaCard({
  id,
  title,
  description,
  author,
  timestamp,
  category,
  avatar,
  className,
  totalLikes,
  currentUserLiked,
  userId,
  setIdeas,
  isAnonymous,
}: IdeaCardProps) {
  const [wishlisted, setWishlisted] = useState(currentUserLiked);
  const [wishlistCount, setWishlistCount] = useState(totalLikes);

  const [editingComment, setEditingComment] = useState(false);
  const [IdeaTitle, setIdeaTitle] = useState(title);
  const [IdeaDescription, setIdeaDescription] = useState(description);

  const { data: session } = useSession();

  /* ------------------------------
     FIXED: Stable random avatar
  --------------------------------*/
  const [randomAvatar] = useState(getRandomAvatar());
  const avatarI = isAnonymous ? randomAvatar : avatar;
  const name = isAnonymous ? "Anonymous" : author;

  const toggleWishlist = async (ideaId: string) => {
    try {
      if (!wishlisted) {
        await axios.post(`/api/ideas/like`, { ideaId });
        setWishlistCount((prev) => prev + 1);
        setWishlisted(true);
      } else {
        await axios.delete(`/api/ideas/like`, { data: { ideaId } });
        setWishlistCount((prev) => prev - 1);
        setWishlisted(false);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    await axios.delete(`/api/ideas/${id}`);
    setIdeas((prev: any) => prev.filter((idea: any) => idea.id !== id));
  };

  const saveEdit = async () => {
    try {
      await axios.patch(`/api/ideas/${id}`, {
        title: IdeaTitle,
        description: IdeaDescription,
      });

      setIdeas((prev: any) =>
        prev.map((ideas: any) =>
          ideas.id === id
            ? { ...ideas, title: IdeaTitle, description: IdeaDescription }
            : ideas
        )
      );

      setEditingComment(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-gray-900 via-neutral-950 to-black text-white border border-gray-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      <div className="flex justify-between items-start">
        {/* Category */}
        {category && (
          <div className="flex items-center gap-2">
            <Lightbulb className="text-yellow-400 size-5 animate-pulse" />
            <span className="text-yellow-400 font-semibold text-xs uppercase px-3 py-1 rounded-full bg-yellow-900/20">
              {category}
            </span>
          </div>
        )}

        {/* Like + Menu */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleWishlist(id)}
            className="flex items-center gap-1 p-1"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                wishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
              }`}
            />
            <span className="text-gray-300 text-xs font-medium">
              {wishlistCount}
            </span>
          </button>

          {session?.user?.id === userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <DotsVerticalIcon />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingComment(true)}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => handleDeleteComment(id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-md font-bold mt-3 ${bricolage_grotesque}`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-xs line-clamp-5 flex-1 mt-1">
        {description}
      </p>

      {/* Author Section */}
      <div className="flex items-center justify-between pt-3 mt-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarI} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>

          <span className="text-gray-400 text-xs">
            {name}
          </span>
        </div>

        <span className="text-gray-500 text-xs">{timestamp}</span>
      </div>

      {/* Edit Idea Dialog */}
      <Dialog open={editingComment} onOpenChange={setEditingComment}>
        <DialogContent className="max-w-md bg-neutral-900 border border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Your Idea</DialogTitle>
          </DialogHeader>

          <Input
            value={IdeaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
            className="mt-3"
          />

          <Textarea
            value={IdeaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            className="min-h-[90px] mt-3"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingComment(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
