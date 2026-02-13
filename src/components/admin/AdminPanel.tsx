"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { bricolage_grotesque } from "@/lib/fonts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserRow = {
  id: string;
  username: string;
  email: string | null;
  image: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

type SessionRow = {
  id: string;
  topic: string;
  category: string;
  date: string;
  user?: {
    username?: string;
  };
};

const CATEGORY_OPTIONS = ["SELF_INTRO", "QUOTE", "PRESENTATION"] as const;

function toLocalDateTimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("SELF_INTRO");
  const [topic, setTopic] = useState("");
  const [dateValue, setDateValue] = useState(() => {
    const initial = new Date();
    initial.setHours(initial.getHours() + 1);
    initial.setSeconds(0, 0);
    return toLocalDateTimeValue(initial);
  });

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => {
      const email = (u.email ?? "").toLowerCase();
      return u.username.toLowerCase().includes(query) || email.includes(query);
    });
  }, [users, userSearch]);

  const latestSessions = useMemo(() => {
    return [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [sessions]);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const [usersRes, sessionsRes] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/section/admin"),
      ]);

      const loadedUsers: UserRow[] = usersRes.data.users ?? [];
      const loadedSessions: SessionRow[] = Array.isArray(sessionsRes.data) ? sessionsRes.data : [];

      setUsers(loadedUsers);
      setSessions(loadedSessions);
      if (loadedUsers.length > 0 && !userId) {
        setUserId(loadedUsers[0].id);
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load admin data. Verify your admin access.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!userId || !topic.trim() || !dateValue) {
      setMessage("Select a user, topic, and date.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/section/admin", {
        userId,
        category,
        topic: topic.trim(),
        date: new Date(dateValue).toISOString(),
      });

      setMessage("Session created successfully.");
      setTopic("");
      await fetchAdminData();
    } catch (error: unknown) {
      const apiError =
        axios.isAxiosError(error) && typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : null;
      setMessage(apiError ?? "Failed to create session.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-8 lg:px-14 py-24">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-neutral-200">
            Admin Panel
          </div>
          <h1 className={`${bricolage_grotesque} text-4xl md:text-5xl font-semibold`}>
            Manage Users and Sessions
          </h1>
          <p className="text-sm md:text-base text-neutral-400">
            Add upcoming sessions for users and monitor all members in one place.
          </p>
        </header>

        {message && (
          <div className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-neutral-200">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-1 border-neutral-800 bg-gradient-to-br from-neutral-950 to-black">
            <CardHeader>
              <CardTitle>Add Session</CardTitle>
              <CardDescription>Create a session for any user.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateSession}>
                <div className="space-y-2">
                  <Label>Select Presenter</Label>
                  <Select value={userId} onValueChange={setUserId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as (typeof CATEGORY_OPTIONS)[number])}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Interview Intro Practice"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Creating..." : "Create Session"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2 border-neutral-800 bg-gradient-to-br from-neutral-950 to-black">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Only admins can see this list.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by username or email"
              />

              {loading ? (
                <p className="text-sm text-neutral-400">Loading users...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-lg border border-neutral-800 bg-black/50 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{user.username}</p>
                        <span className="text-xs rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-300">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {user.email || "No email"}
                      </p>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-sm text-neutral-400">No users found.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-neutral-800 bg-gradient-to-br from-neutral-950 to-black">
          <CardHeader>
            <CardTitle>Latest Sessions</CardTitle>
            <CardDescription>Recently created sessions from admin API.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-neutral-400">Loading sessions...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {latestSessions.map((item) => (
                  <div key={item.id} className="rounded-lg border border-neutral-800 bg-black/50 p-3">
                    <p className="text-xs text-neutral-400">{item.category}</p>
                    <p className="font-medium mt-1 line-clamp-2">{item.topic}</p>
                    <p className="text-xs text-neutral-500 mt-2">
                      {new Date(item.date).toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      by {item.user?.username || "Unknown"}
                    </p>
                  </div>
                ))}
                {latestSessions.length === 0 && (
                  <p className="text-sm text-neutral-400">No sessions yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
