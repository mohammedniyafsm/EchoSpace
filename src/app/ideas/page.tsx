"use client"

import { Button } from "@/components/ui/button";
import { FeedBackCard } from "@/components/ui/FeedBackCard";
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
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { bricolage_grotesque, inter } from "@/lib/fonts";

function IdeasPage() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState("Technical"); // default selected category

  return (
    <div className="pt-36 flex flex-col items-center gap-6 bg-black w-screen h-screen">
      <div className="text-center">
        <h1 className={`text-5xl font-bold font-zalando ${bricolage_grotesque}`}>Ideas & Suggestions</h1>
        <p className={`text-md pt-4 text-sm text-gray-400 ${inter}`}>
          Share your ideas to make SparkFlow better
        </p>
      </div>

      {/* Modal Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add New Idea</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Your Idea</DialogTitle>
            <DialogDescription>
              Share your suggestion with the team. Click save when done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Category Select */}
            <div className="grid gap-3">
              <Label htmlFor="idea-category">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val)}>
                <SelectTrigger id="idea-category">
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

            {/* Title & Description */}
            <div className="grid gap-3">
              <Label htmlFor="idea-title">Title</Label>
              <Input id="idea-title" name="title" placeholder="Enter idea title" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="idea-desc">Description</Label>
              <Textarea placeholder="Enter idea description"/>
            </div>

            {/* Switch for Anonymous / Name */}
            <div className="flex items-center gap-2 mt-2">
              <Switch
                id="anonymous-switch"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked)}
              />
              <Label htmlFor="anonymous-switch">
                {isAnonymous ? "Post as Anonymous" : "Show my name"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Cards */}
      <div className="grid grid-cols-3 gap-4 pt-8">
        <FeedBackCard
          className={`w-[450px] ${bricolage_grotesque} `}
          category="Technical"
          title="Improve load speed"
          description="The website is slow when loading large datasets. Optimize the backend queries."
          timestamp="3 hours ago"
          author="Bob"
        />
        <FeedBackCard
          className={`w-[450px]  ${bricolage_grotesque}`}
          title="Add dark mode toggle"
          description="It would be great to have a manual dark/light mode switch."
          timestamp="1 day ago"
          author="Alice"
        />
        <FeedBackCard
          className={`w-[450px] ${bricolage_grotesque}`}
          title="Add dark mode toggle"
          description="It would be great to have a manual dark/light mode switch."
          timestamp="1 day ago"
          author="Alice"
        />
      </div>
    </div>
  );
}

export default IdeasPage;
