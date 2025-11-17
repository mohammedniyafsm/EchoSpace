"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { bricolage_grotesque, inter } from "@/lib/fonts";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import CardSkeleton from "@/components/ideas/CardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

export default function IdeasPage() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState("Technical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ideas, setIdeas] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 21;
  const [showPagination, setshowPagination] = useState(false);

  const { data : session } = useSession();

  const fetchIdeas = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/ideas?page=${page}&pageSize=${pageSize}`
      );
      console.log(response.data.ideas)
      setIdeas(response.data.ideas);
      setshowPagination(true);
      setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas(page);
  }, [page]);

  const handleAddIdeas = async () => {
    const response = await axios.post(`/api/ideas`, { category: category.toUpperCase(), title: title, description, anonymous: isAnonymous })
    const newUser = {
      ...response.data,
      user: {
        id: session?.user.id,
        username: session?.user.username,
        image: session?.user.image
      },
      likes :[],
      _count :  { likes : 0 },
      currentUserLiked: false
    }
    setIdeas((prev: any) => [newUser,...prev])
  }

  return (
    <div className="pt-24 flex flex-col items-center gap-8 bg-black w-screen min-h-screen px-6">

      {/* Header */}
      <div className="text-center max-w-2xl">
        <h1 className={`text-5xl font-bold ${bricolage_grotesque} text-white`}>
          Ideas & Suggestions
        </h1>
        <p className={`text-sm pt-3 text-gray-400 ${inter}`}>
          Share your ideas to make SparkFlow better
        </p>
      </div>

      {/* Add Idea Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} className=" text-white">
            Add New Idea
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px] bg-neutral-900 text-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Add Your Idea</DialogTitle>
            <DialogDescription>
              Share your suggestion with the team.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                  <SelectItem value="Issue">Issue</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input onChange={(e) => setTitle(e.target.value)} placeholder="Enter idea title" />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea onChange={(e) => setDescription(e.target.value)} placeholder="Enter idea description" />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label>
                {isAnonymous ? "Post as Anonymous" : "Show my name"}
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleAddIdeas} className="bg-black text-white hover:bg-gray-950">Submit</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))
          : ideas.map((idea) => (
            <IdeaCard
              id={idea.id}
              key={idea.id}
              userId={idea.user.id}
              category={idea.category}
              title={idea.title}
              description={idea.description}
              timestamp={new Date(idea.createdAt).toLocaleString()}
              author={idea.anonymous ? "Anonymous" : idea.user.username}
              avatar={idea.user.image}
              totalLikes={idea._count.likes}
              currentUserLiked={idea.currentUserLiked}
              setIdeas={setIdeas}
              isAnonymous={idea.anonymous}
            />
          ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex gap-3 pt-2 pb-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`w-6 h-6 rounded-full border text-xs border-gray-700 flex items-center justify-center ${page === i + 1
                  ? "bg-neutral-900 text-white"
                  : "bg-black text-gray-400"
                }`}
              onClick={() => setPage(i + 1)}
              disabled={loading}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
