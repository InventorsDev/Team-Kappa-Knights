"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import edit from "@/public/SVGs/edit.svg";
import Back from '@/public/dashboard/backArrow.png'
import trash from "@/public/SVGs/trash.svg";
import { JournalEntry } from "@/types/journal";
import Loader from "@/components/common/loader/Loader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, PlusCircle } from "lucide-react";

const API_BASE = "http://34.228.198.154";

const moods = [
  "motivated",
  "stressed",
  "excited",
  "okay",
  "frustrated",
  "tired",
  "scared",
] as const;

const getUserJournals = async (
  token: string,
  setError: (b: boolean) => void
): Promise<JournalEntry[] | null> => {
  try {
    const res = await fetch(`${API_BASE}/journal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch journals:", res.statusText);
      setError(true);
      return null;
    }

    const data = (await res.json()) as JournalEntry[];
    data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return data;
  } catch (err) {
    console.error(err);
    setError(true);
    return null;
  }
};

export default function MyJournalsPage() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMood, setEditMood] = useState<string>(moods[0]);

  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    (async () => {
      const entries = await getUserJournals(token, setError);
      if (entries) {
        setJournals(entries);
      }
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        {" "}
        <Loader />{" "}
      </div>
    );
  if (error) return <p className="text-red-500">Failed to load journals</p>;

  const startEdit = (j: JournalEntry) => {
    setEditingId(j.id);
    setEditTitle(j.title);
    setEditContent(j.content);
    setEditMood(j.mood || moods[0]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditMood(moods[0]);
  };

  const handleContentChange = (value: string) => {
    if (value.length > 150) {
      setEditContent(value.slice(0, 150));
    } else {
      setEditContent(value);
    }
  };

  const saveEdit = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login.");
      return;
    }

    if (!editTitle.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    if (editContent.length > 150) {
      alert(`Content too long (${editContent.length} chars). Max 150.`);
      return;
    }

    setSavingId(id);
    try {
      const res = await fetch(`${API_BASE}/journal/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          mood: editMood,
        }),
      });

      if (!res.ok) {
        toast.error("Edit failed");
        console.error(`Update failed: ${res.status}`);
      }

      toast.success("Edit Successful!");
      setJournals((prev) =>
        prev.map((j) =>
          j.id === id
            ? { ...j, title: editTitle, content: editContent, mood: editMood }
            : j
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save changes. Try again.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login.");
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/journal/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }

      setJournals((prev) => prev.filter((j) => j.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete entry. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="py-4 space-y-4" style={{ fontFamily: 'var(--font-nunito)'}}>
       <section className=" hidden md:block">
              <div className="flex items-center py-3 ">
                <div onClick={() => router.back()} className="hover:cursor-pointer">
                  <Image src={Back} alt="" />
                </div>
                <div className="w-full flex justify-center">
                  <div className="flex flex-col justify-center text-center">
                  <p className="font-semibold md:text-[24px] text-[18px]">My Journals</p>
                  <p className="text-[#4A4A4A] text-[18px]">{journals.length} {journals.length === 1 ? 'entry' : 'entries'} </p>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-[#E6FBE6] hover:cursor-pointer" onClick={() => router.push('/journals/create-journal')}>
                  <Plus className="text-[#00BFA5]"/>
                </div>
              </div>
            </section>
      {journals.map((journal, i) => {
        const isEditing = editingId === journal.id;
        const charCount = isEditing
          ? editContent.length
          : journal.content.length;

        return (
          <motion.div
            layout
            key={journal.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{
              scale: 1.01,
              boxShadow: "0px 4px 15px rgba(0,0,0,0.08)",
            }}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            {/* Title + Actions */}
            <div className="flex justify-between items-start">
              <AnimatePresence mode="wait" initial={false}>
                {isEditing ? (
                  <motion.input
                    key="edit-title"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-semibold text-lg w-2/3 border-b border-gray-300 focus:outline-none pb-1"
                  />
                ) : (
                  <motion.h2
                    key="view-title"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold md:text-[24px] text-[18px]"
                  >
                    {journal.title}
                  </motion.h2>
                )}
              </AnimatePresence>

              <div className="flex items-center space-x-2 text-gray-500">
                {!isEditing && (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      title="Edit"
                      onClick={() => startEdit(journal)}
                      className="p-1"
                    >
                      <Image src={edit} width={20} height={20} alt="Edit" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      title="Delete"
                      onClick={() => handleDelete(journal.id)}
                      className="p-1"
                    >
                      <Image src={trash} width={20} height={20} alt="Trash" />
                    </motion.button>
                  </>
                )}

                {isEditing && (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => saveEdit(journal.id)}
                      disabled={
                        savingId === journal.id ||
                        !editTitle.trim() ||
                        charCount > 150
                      }
                      className={`px-3 py-1 rounded-md text-white font-medium cursor-pointer ${
                        savingId === journal.id
                          ? "bg-[#EBFFFC] text-[#212121]"
                          : "bg-[#00BFA5] "
                      }`}
                    >
                      {savingId === journal.id ? "Saving..." : "Save"}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelEdit}
                      disabled={savingId === journal.id}
                      className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </motion.button>
                  </>
                )}

                {deletingId === journal.id && (
                  <span className="ml-2 text-sm">Deleting...</span>
                )}
              </div>
            </div>

            {/* Date + Time + Mood */}
            <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
              <span>
                {new Date(journal.created_at).toLocaleDateString("en-GB")}
              </span>
              <span>•</span>
              <span>
                {new Date(journal.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <div className="ml-2 flex items-center">
                <AnimatePresence mode="wait" initial={false}>
                  {isEditing ? (
                    <motion.select
                      key="edit-mood"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      title="mood"
                      value={editMood}
                      onChange={(e) => setEditMood(e.target.value)}
                      className="ml-2 text-sm border rounded px-2 py-1"
                    >
                      {moods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </motion.select>
                  ) : (
                    <motion.div
                      key="view-mood"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      <span className="mr-1">{journal.mood_emoji}</span>
                      <span className="ml-1">{journal.mood}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Content */}
            <div className="mt-3">
              <AnimatePresence mode="wait" initial={false}>
                {isEditing ? (
                  <motion.div
                    key="edit-content"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <textarea
                      value={editContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      rows={5}
                      maxLength={150}
                      className="w-full border border-gray-200 rounded p-3 focus:outline-none"
                      placeholder="Edit your entry (max 150 characters)"
                    />
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>{charCount}/150 characters</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(journal.id)}
                        disabled={
                          deletingId === journal.id || savingId === journal.id
                        }
                        className="px-2 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {deletingId === journal.id ? "Deleting..." : "Delete"}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="view-content"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-700 whitespace-pre-wrap text-[18px]"
                  >
                    {journal.content}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
