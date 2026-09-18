"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Copy,
  Edit3,
  FileText,
  FolderKanban,
  Grid2X2,
  Heart,
  Lightbulb,
  List,
  Menu,
  Moon,
  Pin,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  User,
  X,
  ArrowUp,
  Layers3,
  type LucideIcon,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type NoteColor =
  | "indigo"
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "pink";

type FilterType =
  | "All Notes"
  | "Work"
  | "Personal"
  | "Ideas"
  | "Study"
  | "Projects"
  | "Important";

type SortType = "newest" | "oldest" | "az" | "za";

type Note = {
  id: number;
  title: string;
  content: string;
  category: Exclude<FilterType, "All Notes">;
  color: NoteColor;
  pinned: boolean;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

type Toast = {
  type: "success" | "error";
  message: string;
};

/* =========================
   CONSTANTS
========================= */

const VALID_COLORS: NoteColor[] = [
  "indigo",
  "blue",
  "purple",
  "green",
  "orange",
  "pink",
];

const categories: {
  name: FilterType;
  icon: LucideIcon;
}[] = [
  { name: "All Notes", icon: FileText },
  { name: "Work", icon: Briefcase },
  { name: "Personal", icon: User },
  { name: "Ideas", icon: Lightbulb },
  { name: "Study", icon: BookOpen },
  { name: "Projects", icon: FolderKanban },
  { name: "Important", icon: CircleAlert },
];

const colorClasses: Record<
  NoteColor,
  {
    border: string;
    bg: string;
    soft: string;
    dot: string;
    text: string;
  }
> = {
  indigo: {
    border: "border-indigo-200 dark:border-indigo-500/30",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    soft: "bg-indigo-100 dark:bg-indigo-500/20",
    dot: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-300",
  },
  blue: {
    border: "border-blue-200 dark:border-blue-500/30",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    soft: "bg-blue-100 dark:bg-blue-500/20",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-300",
  },
  purple: {
    border: "border-purple-200 dark:border-purple-500/30",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    soft: "bg-purple-100 dark:bg-purple-500/20",
    dot: "bg-purple-500",
    text: "text-purple-600 dark:text-purple-300",
  },
  green: {
    border: "border-green-200 dark:border-green-500/30",
    bg: "bg-green-50 dark:bg-green-500/10",
    soft: "bg-green-100 dark:bg-green-500/20",
    dot: "bg-green-500",
    text: "text-green-600 dark:text-green-300",
  },
  orange: {
    border: "border-orange-200 dark:border-orange-500/30",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    soft: "bg-orange-100 dark:bg-orange-500/20",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-300",
  },
  pink: {
    border: "border-pink-200 dark:border-pink-500/30",
    bg: "bg-pink-50 dark:bg-pink-500/10",
    soft: "bg-pink-100 dark:bg-pink-500/20",
    dot: "bg-pink-500",
    text: "text-pink-600 dark:text-pink-300",
  },
};

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Project Launch Plan",
    content:
      "Prepare the final project documentation, review deployment settings and share the release plan with the team.",
    category: "Work",
    color: "indigo",
    pinned: true,
    favorite: true,
    createdAt: "2026-09-15T09:30:00",
    updatedAt: "2026-09-17T12:15:00",
  },
  {
    id: 2,
    title: "React Learning",
    content:
      "Study advanced React patterns, server components, hooks and performance optimization techniques.",
    category: "Study",
    color: "blue",
    pinned: false,
    favorite: true,
    createdAt: "2026-09-14T11:20:00",
    updatedAt: "2026-09-16T15:30:00",
  },
  {
    id: 3,
    title: "Portfolio Ideas",
    content:
      "Add interactive projects, better animations, a case study section and a clean contact experience.",
    category: "Ideas",
    color: "purple",
    pinned: true,
    favorite: false,
    createdAt: "2026-09-13T14:10:00",
    updatedAt: "2026-09-16T18:45:00",
  },
  {
    id: 4,
    title: "Weekly Tasks",
    content:
      "Finish dashboard UI, review API endpoints, clean unused components and update project documentation.",
    category: "Projects",
    color: "green",
    pinned: false,
    favorite: false,
    createdAt: "2026-09-12T08:45:00",
    updatedAt: "2026-09-15T17:10:00",
  },
  {
    id: 5,
    title: "Personal Goals",
    content:
      "Maintain a consistent learning routine and dedicate focused time to building useful projects.",
    category: "Personal",
    color: "orange",
    pinned: false,
    favorite: true,
    createdAt: "2026-09-10T10:00:00",
    updatedAt: "2026-09-14T13:20:00",
  },
  {
    id: 6,
    title: "Important Meeting",
    content:
      "Prepare questions, review previous notes and keep the required documents ready before the meeting.",
    category: "Important",
    color: "pink",
    pinned: true,
    favorite: false,
    createdAt: "2026-09-09T16:00:00",
    updatedAt: "2026-09-13T09:15:00",
  },
];

/* =========================
   HELPERS
========================= */

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function normalizeNote(value: unknown): Note | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Partial<Note>;

  if (
    typeof item.id !== "number" ||
    typeof item.title !== "string" ||
    typeof item.content !== "string" ||
    typeof item.category !== "string"
  ) {
    return null;
  }

  const color: NoteColor = VALID_COLORS.includes(
    item.color as NoteColor
  )
    ? (item.color as NoteColor)
    : "indigo";

  const validCategories: Exclude<FilterType, "All Notes">[] = [
    "Work",
    "Personal",
    "Ideas",
    "Study",
    "Projects",
    "Important",
  ];

  const category = validCategories.includes(
    item.category as Exclude<FilterType, "All Notes">
  )
    ? (item.category as Exclude<FilterType, "All Notes">)
    : "Work";

  return {
    id: item.id,
    title: item.title,
    content: item.content,
    category,
    color,
    pinned: Boolean(item.pinned),
    favorite: Boolean(item.favorite),
    createdAt:
      typeof item.createdAt === "string"
        ? item.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof item.updatedAt === "string"
        ? item.updatedAt
        : new Date().toISOString(),
  };
}

/* =========================
   MAIN COMPONENT
========================= */

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [filter, setFilter] = useState<FilterType>("All Notes");
  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortType>("newest");

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [deleteNote, setDeleteNote] = useState<Note | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* =========================
     HYDRATION
  ========================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("noteflow-theme");

    const shouldBeDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(shouldBeDark);

    document.documentElement.classList.toggle("dark", shouldBeDark);

    const savedNotes = localStorage.getItem("noteflow-notes");

    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);

        if (Array.isArray(parsed)) {
          const cleanNotes = parsed
            .map(normalizeNote)
            .filter((note): note is Note => note !== null);

          if (cleanNotes.length > 0) {
            setNotes(cleanNotes);
          }
        }
      } catch {
        console.warn("Invalid saved notes. Using default notes.");
      }
    }

    setHydrated(true);
  }, []);

  /* =========================
     SAVE NOTES
  ========================= */

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("noteflow-notes", JSON.stringify(notes));
  }, [notes, hydrated]);

  /* =========================
     TOAST
  ========================= */

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  /* =========================
     BODY SCROLL
  ========================= */

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* =========================
     THEME
  ========================= */

  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);

    document.documentElement.classList.toggle("dark", nextTheme);

    localStorage.setItem(
      "noteflow-theme",
      nextTheme ? "dark" : "light"
    );
  };

  /* =========================
     FILTERED NOTES
  ========================= */

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = notes.filter((note) => {
      const matchesFilter =
        filter === "All Notes" || note.category === filter;

      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query);

      const matchesFavorite =
        !favoritesOnly || note.favorite;

      return matchesFilter && matchesSearch && matchesFavorite;
    });

    return [...result].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return Number(b.pinned) - Number(a.pinned);
      }

      if (sort === "newest") {
        return (
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
        );
      }

      if (sort === "oldest") {
        return (
          new Date(a.updatedAt).getTime() -
          new Date(b.updatedAt).getTime()
        );
      }

      if (sort === "az") {
        return a.title.localeCompare(b.title);
      }

      return b.title.localeCompare(a.title);
    });
  }, [notes, filter, search, sort, favoritesOnly]);

  /* =========================
     STATS
  ========================= */

  const favoriteCount = notes.filter((note) => note.favorite).length;

  const pinnedCount = notes.filter((note) => note.pinned).length;

  /* =========================
     CREATE NOTE
  ========================= */

  const openCreate = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  /* =========================
     EDIT NOTE
  ========================= */

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  /* =========================
     SAVE NOTE
  ========================= */

  const saveNote = (
    data: Pick<Note, "title" | "content" | "category" | "color">
  ) => {
    const now = new Date().toISOString();

    if (editingNote) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                ...data,
                updatedAt: now,
              }
            : note
        )
      );

      setToast({
        type: "success",
        message: "Note updated successfully.",
      });
    } else {
      const newNote: Note = {
        id: Date.now(),
        ...data,
        pinned: false,
        favorite: false,
        createdAt: now,
        updatedAt: now,
      };

      setNotes((current) => [newNote, ...current]);

      setToast({
        type: "success",
        message: "New note created.",
      });
    }

    setEditorOpen(false);
    setEditingNote(null);
  };

  /* =========================
     DELETE
  ========================= */

  const confirmDelete = () => {
    if (!deleteNote) return;

    setNotes((current) =>
      current.filter((note) => note.id !== deleteNote.id)
    );

    setDeleteNote(null);

    setToast({
      type: "success",
      message: "Note deleted successfully.",
    });
  };

  /* =========================
     PIN
  ========================= */

  const togglePin = (id: number) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  /* =========================
     FAVORITE
  ========================= */

  const toggleFavorite = (id: number) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              favorite: !note.favorite,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  /* =========================
     COPY
  ========================= */

  const copyNote = async (note: Note) => {
    try {
      await navigator.clipboard.writeText(
        `${note.title}\n\n${note.content}`
      );

      setToast({
        type: "success",
        message: "Note copied to clipboard.",
      });
    } catch {
      setToast({
        type: "error",
        message: "Could not copy the note.",
      });
    }
  };

  /* =========================
     SIDEBAR
  ========================= */

  const selectFilter = (value: FilterType) => {
    setFilter(value);
    setFavoritesOnly(false);
    setSidebarOpen(false);
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#080d18] dark:text-slate-100">
      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen
          flex-col border-r border-slate-200
          bg-white/95 backdrop-blur-xl
          transition-all duration-200
          dark:border-white/10
          dark:bg-[#0b1220]/95
          ${sidebarCollapsed ? "w-[82px]" : "w-[260px]"}
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}

        <div className="flex h-[78px] items-center justify-between border-b border-slate-200 px-5 dark:border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Layers3 size={20} />
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-lg font-black tracking-tight">
                  NoteFlow
                </h1>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Smart Workspace
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar content */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!sidebarCollapsed && (
            <p className="mb-3 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>
          )}

          <nav className="space-y-1">
            {categories.map((item) => {
              const Icon = item.icon;

              const active =
                filter === item.name && !favoritesOnly;

              return (
                <button
                  key={item.name}
                  onClick={() => selectFilter(item.name)}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`
                    flex w-full items-center gap-3 rounded-xl
                    px-3 py-3 text-left text-sm font-semibold
                    transition
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                    }
                  `}
                >
                  <Icon size={18} className="shrink-0" />

                  {!sidebarCollapsed && (
                    <span className="flex-1">{item.name}</span>
                  )}

                  {!sidebarCollapsed &&
                    item.name !== "All Notes" && (
                      <span
                        className={`
                          text-xs
                          ${
                            active
                              ? "text-white/70"
                              : "text-slate-400"
                          }
                        `}
                      >
                        {
                          notes.filter(
                            (note) =>
                              note.category === item.name
                          ).length
                        }
                      </span>
                    )}
                </button>
              );
            })}
          </nav>

          <div className="my-6 h-px bg-slate-200 dark:bg-white/10" />

          {!sidebarCollapsed && (
            <p className="mb-3 px-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
              Quick Access
            </p>
          )}

          <button
            onClick={() => {
              setFavoritesOnly(true);
              setFilter("All Notes");
              setSidebarOpen(false);
            }}
            title={sidebarCollapsed ? "Favorites" : undefined}
            className={`
              flex w-full items-center gap-3 rounded-xl
              px-3 py-3 text-left text-sm font-semibold
              transition
              ${
                favoritesOnly
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
              }
            `}
          >
            <Heart size={18} className="shrink-0" />

            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Favorites</span>
                <span className="text-xs text-slate-400">
                  {favoriteCount}
                </span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setFilter("All Notes");
              setFavoritesOnly(false);
              setSidebarOpen(false);
            }}
            title={sidebarCollapsed ? "Pinned" : undefined}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <Pin size={18} className="shrink-0" />

            {!sidebarCollapsed && (
              <>
                <span className="flex-1">Pinned Notes</span>
                <span className="text-xs text-slate-400">
                  {pinnedCount}
                </span>
              </>
            )}
          </button>

          <div className="my-6 h-px bg-slate-200 dark:bg-white/10" />

          <button
            title={sidebarCollapsed ? "Settings" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <Settings size={18} className="shrink-0" />

            {!sidebarCollapsed && <span>Settings</span>}
          </button>
        </div>

        {/* Collapse */}

        <div className="hidden border-t border-slate-200 p-3 lg:block dark:border-white/10">
          <button
            onClick={() =>
              setSidebarCollapsed((value) => !value)
            }
            className="flex w-full items-center justify-center rounded-xl bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN AREA
      ========================= */}

      <div
        className={`
          min-h-screen transition-all duration-200
          ${sidebarCollapsed ? "lg:pl-[82px]" : "lg:pl-[260px]"}
        `}
      >
        {/* =========================
            HEADER
        ========================= */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#080d18]/85">
          <div className="flex h-[78px] items-center gap-3 px-4 sm:px-6 xl:px-8">
            {/* Mobile menu */}

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-white/10"
            >
              <Menu size={22} />
            </button>

            {/* Search */}

            <div className="relative max-w-[520px] flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your notes..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-indigo-500/50 dark:focus:bg-white/[0.06]"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Theme */}

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-yellow-300 dark:hover:bg-white/[0.08]"
              >
                {darkMode ? (
                  <Sun size={19} />
                ) : (
                  <Moon size={19} />
                )}
              </button>

              {/* Notification */}

              <div className="relative">
                <button
                  onClick={() =>
                    setNotificationOpen(
                      (value) => !value
                    )
                  }
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
                >
                  <Bell size={19} />

                  <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#0b1220]" />
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 top-14 w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#101827]">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold">
                        Notifications
                      </h3>

                      <button
                        onClick={() =>
                          setNotificationOpen(false)
                        }
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-500/10">
                      <div className="flex gap-3">
                        <div className="mt-0.5 rounded-lg bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                          <Sparkles size={16} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            Welcome to NoteFlow
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Your workspace is ready.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar */}

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-black text-white shadow-lg shadow-indigo-500/20 sm:flex">
                AG
              </div>
            </div>
          </div>
        </header>

        {/* =========================
            CONTENT
        ========================= */}

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 xl:py-8">
          {/* Hero */}

          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-white/[0.035]">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Sparkles size={14} />
                    Smart Notes Workspace
                  </div>

                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Good evening, Amit 👋
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    Organize your thoughts, projects and ideas
                    in one beautiful workspace.
                  </p>
                </div>

                <button
                  onClick={openCreate}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  <Plus size={18} />
                  Create Note
                </button>
              </div>

              {/* Stats */}

              <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                  icon={<FileText size={18} />}
                  label="Total Notes"
                  value={notes.length}
                />

                <StatCard
                  icon={<Pin size={18} />}
                  label="Pinned"
                  value={pinnedCount}
                />

                <StatCard
                  icon={<Heart size={18} />}
                  label="Favorites"
                  value={favoriteCount}
                />

                <StatCard
                  icon={<Check size={18} />}
                  label="Categories"
                  value={categories.length - 1}
                />
              </div>
            </div>
          </section>

          {/* Toolbar */}

          <section className="mt-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => {
                    setFavoritesOnly(false);
                    setFilter("All Notes");
                  }}
                  className={`
                    shrink-0 rounded-xl px-4 py-2.5
                    text-sm font-bold transition
                    ${
                      filter === "All Notes" &&
                      !favoritesOnly
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-white text-slate-500 hover:bg-slate-100 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.08]"
                    }
                  `}
                >
                  All Notes
                </button>

                {(
                  [
                    "Work",
                    "Personal",
                    "Ideas",
                    "Study",
                    "Projects",
                    "Important",
                  ] as const
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setFavoritesOnly(false);
                      setFilter(item);
                    }}
                    className={`
                      shrink-0 rounded-xl px-4 py-2.5
                      text-sm font-bold transition
                      ${
                        filter === item && !favoritesOnly
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "bg-white text-slate-500 hover:bg-slate-100 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.08]"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(
                        event.target.value as SortType
                      )
                    }
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white py-0 pl-3 pr-9 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                  >
                    <option value="newest">
                      Newest
                    </option>
                    <option value="oldest">
                      Oldest
                    </option>
                    <option value="az">
                      A → Z
                    </option>
                    <option value="za">
                      Z → A
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {/* View */}

                <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.04]">
                  <button
                    onClick={() => setView("grid")}
                    className={`rounded-lg p-2 ${
                      view === "grid"
                        ? "bg-slate-100 text-indigo-600 dark:bg-white/10 dark:text-indigo-300"
                        : "text-slate-400"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid2X2 size={16} />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    className={`rounded-lg p-2 ${
                      view === "list"
                        ? "bg-slate-100 text-indigo-600 dark:bg-white/10 dark:text-indigo-300"
                        : "text-slate-400"
                    }`}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results */}

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">
                  {favoritesOnly
                    ? "Favorite Notes"
                    : filter}
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1
                    ? "note"
                    : "notes"}{" "}
                  found
                </p>
              </div>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-300"
                >
                  Clear search
                  <X size={14} />
                </button>
              )}
            </div>

            {filteredNotes.length === 0 ? (
              <EmptyState onCreate={openCreate} />
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    view={view}
                    onEdit={openEdit}
                    onDelete={setDeleteNote}
                    onPin={togglePin}
                    onFavorite={toggleFavorite}
                    onCopy={copyNote}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Footer */}

          <footer className="mt-14 border-t border-slate-200 pt-8 dark:border-white/10">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Layers3 size={19} />
                  </div>

                  <div>
                    <h3 className="font-black">
                      NoteFlow
                    </h3>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Smart Workspace
                    </p>
                  </div>
                </div>

                <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                  A clean and modern workspace for managing
                  your notes, ideas and projects.
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <FooterIconButton
                    icon={
                      <span className="text-xs font-black">
                        GH
                      </span>
                    }
                    label="GitHub"
                  />

                  <FooterIconButton
                    icon={
                      <span className="text-xs font-black">
                        in
                      </span>
                    }
                    label="LinkedIn"
                  />

                  <FooterIconButton
                    icon={
                      <span className="text-xs font-black">
                        @
                      </span>
                    }
                    label="Email"
                  />
                </div>
              </div>

              <FooterColumn
                title="Workspace"
                items={[
                  "All Notes",
                  "Favorites",
                  "Pinned Notes",
                  "Settings",
                ]}
              />

              <FooterColumn
                title="Categories"
                items={[
                  "Work",
                  "Personal",
                  "Ideas",
                  "Study",
                ]}
              />

              <div>
                <h4 className="text-sm font-black">
                  Quick Stats
                </h4>

                <div className="mt-4 space-y-3">
                  <FooterStat
                    label="Total Notes"
                    value={notes.length}
                  />

                  <FooterStat
                    label="Favorites"
                    value={favoriteCount}
                  />

                  <FooterStat
                    label="Pinned"
                    value={pinnedCount}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 text-xs font-medium text-slate-400 sm:flex-row dark:border-white/10">
              <p>
                © {new Date().getFullYear()} NoteFlow. All
                rights reserved.
              </p>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-300"
              >
                Back to top
                <ArrowUp size={14} />
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* =========================
          EDITOR MODAL
      ========================= */}

      {editorOpen && (
        <NoteEditor
          note={editingNote}
          onClose={() => {
            setEditorOpen(false);
            setEditingNote(null);
          }}
          onSave={saveNote}
        />
      )}

      {/* =========================
          DELETE MODAL
      ========================= */}

      {deleteNote && (
        <DeleteModal
          note={deleteNote}
          onCancel={() => setDeleteNote(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* =========================
          TOAST
      ========================= */}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] animate-slide-in">
          <div
            className={`
              flex min-w-[280px] items-center gap-3
              rounded-2xl border bg-white px-4 py-3
              shadow-2xl dark:bg-[#111827]
              ${
                toast.type === "success"
                  ? "border-emerald-200 dark:border-emerald-500/20"
                  : "border-red-200 dark:border-red-500/20"
              }
            `}
          >
            <div
              className={`
                flex h-9 w-9 items-center justify-center rounded-xl
                ${
                  toast.type === "success"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"
                }
              `}
            >
              {toast.type === "success" ? (
                <Check size={18} />
              ) : (
                <CircleAlert size={18} />
              )}
            </div>

            <p className="flex-1 text-sm font-bold">
              {toast.message}
            </p>

            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-white/[0.06] dark:text-indigo-300">
        {icon}
      </div>

      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-xs font-semibold text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   NOTE CARD
========================================================= */

function NoteCard({
  note,
  view,
  onEdit,
  onDelete,
  onPin,
  onFavorite,
  onCopy,
}: {
  note: Note;
  view: "grid" | "list";
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onPin: (id: number) => void;
  onFavorite: (id: number) => void;
  onCopy: (note: Note) => void;
}) {
  const styles =
    colorClasses[note.color] ??
    colorClasses.indigo;

  if (view === "list") {
    return (
      <article
        className={`
          group rounded-2xl border
          bg-white p-4 shadow-sm
          transition hover:-translate-y-0.5
          hover:shadow-lg
          dark:bg-white/[0.035]
          ${styles.border}
        `}
      >
        <div className="flex items-start gap-4">
          <div
            className={`mt-1 h-3 w-3 shrink-0 rounded-full ${styles.dot}`}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-black">
                {note.title}
              </h3>

              {note.pinned && (
                <Pin
                  size={14}
                  className="shrink-0 fill-current text-indigo-500"
                />
              )}
            </div>

            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {note.content}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
              <span
                className={`rounded-lg px-2 py-1 ${styles.soft} ${styles.text}`}
              >
                {note.category}
              </span>

              <span>
                Updated {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <NoteActionButton
              label="Favorite"
              active={note.favorite}
              onClick={() => onFavorite(note.id)}
            >
              <Heart
                size={16}
                className={
                  note.favorite ? "fill-current" : ""
                }
              />
            </NoteActionButton>

            <NoteActionButton
              label="Pin"
              active={note.pinned}
              onClick={() => onPin(note.id)}
            >
              <Pin
                size={16}
                className={
                  note.pinned ? "fill-current" : ""
                }
              />
            </NoteActionButton>

            <NoteActionButton
              label="Copy"
              onClick={() => onCopy(note)}
            >
              <Copy size={16} />
            </NoteActionButton>

            <NoteActionButton
              label="Edit"
              onClick={() => onEdit(note)}
            >
              <Edit3 size={16} />
            </NoteActionButton>

            <NoteActionButton
              label="Delete"
              danger
              onClick={() => onDelete(note)}
            >
              <Trash2 size={16} />
            </NoteActionButton>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`
        group relative flex min-h-[260px] flex-col
        overflow-hidden rounded-2xl border
        bg-white shadow-sm
        transition duration-200
        hover:-translate-y-1 hover:shadow-xl
        dark:bg-white/[0.035]
        ${styles.border}
      `}
    >
      <div
        className={`absolute left-0 top-0 h-1 w-full ${styles.dot}`}
      />

      <div className="flex items-center justify-between p-5 pb-3">
        <div
          className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold ${styles.soft} ${styles.text}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
          />
          {note.category}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onFavorite(note.id)}
            aria-label="Favorite"
            className={`rounded-lg p-2 transition ${
              note.favorite
                ? "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            }`}
          >
            <Heart
              size={17}
              className={
                note.favorite ? "fill-current" : ""
              }
            />
          </button>

          <button
            onClick={() => onPin(note.id)}
            aria-label="Pin"
            className={`rounded-lg p-2 transition ${
              note.pinned
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            }`}
          >
            <Pin
              size={17}
              className={
                note.pinned ? "fill-current" : ""
              }
            />
          </button>
        </div>
      </div>

      <div className="flex-1 px-5">
        <h3 className="line-clamp-2 text-lg font-black tracking-tight">
          {note.title}
        </h3>

        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {note.content}
        </p>
      </div>

      <div className="mt-5 border-t border-slate-100 px-5 py-4 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <CalendarDays size={14} />
            {formatDate(note.updatedAt)}
          </div>

          <div className="flex items-center gap-1 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
            <NoteActionButton
              label="Copy"
              onClick={() => onCopy(note)}
            >
              <Copy size={15} />
            </NoteActionButton>

            <NoteActionButton
              label="Edit"
              onClick={() => onEdit(note)}
            >
              <Edit3 size={15} />
            </NoteActionButton>

            <NoteActionButton
              label="Delete"
              danger
              onClick={() => onDelete(note)}
            >
              <Trash2 size={15} />
            </NoteActionButton>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function NoteActionButton({
  children,
  label,
  active,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        rounded-lg p-2 transition
        ${
          danger
            ? "text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            : active
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-white/15 dark:bg-white/[0.025]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
        <FileText size={28} />
      </div>

      <h3 className="mt-5 text-xl font-black">
        No notes found
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        Try changing your search or filter, or create a
        new note to get started.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
      >
        <Plus size={18} />
        Create Note
      </button>
    </div>
  );
}

/* =========================================================
   NOTE EDITOR
========================================================= */

function NoteEditor({
  note,
  onClose,
  onSave,
}: {
  note: Note | null;
  onClose: () => void;
  onSave: (
    data: Pick<
      Note,
      "title" | "content" | "category" | "color"
    >
  ) => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(
    note?.content ?? ""
  );

  const [category, setCategory] = useState<
    Exclude<FilterType, "All Notes">
  >(note?.category ?? "Work");

  const [color, setColor] = useState<NoteColor>(
    note?.color ?? "indigo"
  );

  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some note content.");
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0e1625]">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-white/10">
          <div>
            <h2 className="text-xl font-black">
              {note ? "Edit Note" : "Create Note"}
            </h2>

            <p className="mt-1 text-xs font-medium text-slate-400">
              Keep your ideas organized.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
              <CircleAlert size={17} />
              {error}
            </div>
          )}

          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-bold">
              Title
            </label>

            <input
              autoFocus
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError("");
              }}
              placeholder="Enter note title..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>

          {/* Content */}

          <div>
            <label className="mb-2 block text-sm font-bold">
              Content
            </label>

            <textarea
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setError("");
              }}
              placeholder="Write your note..."
              rows={7}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 font-medium dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-bold">
              Category
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(
                [
                  "Work",
                  "Personal",
                  "Ideas",
                  "Study",
                  "Projects",
                  "Important",
                ] as const
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`
                    rounded-xl border px-3 py-2.5
                    text-sm font-bold transition
                    ${
                      category === item
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:bg-white/[0.06]"
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}

          <div>
            <label className="mb-2 block text-sm font-bold">
              Note Color
            </label>

            <div className="flex items-center gap-3">
              {VALID_COLORS.map((item) => {
                const style = colorClasses[item];

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setColor(item)}
                    aria-label={`${item} color`}
                    className={`
                      flex h-9 w-9 items-center justify-center
                      rounded-full border-2
                      ${
                        color === item
                          ? "border-slate-900 dark:border-white"
                          : "border-transparent"
                      }
                    `}
                  >
                    <span
                      className={`h-6 w-6 rounded-full ${style.dot}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
            >
              {note ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteModal({
  note,
  onCancel,
  onConfirm,
}: {
  note: Note;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0e1625]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
          <Trash2 size={21} />
        </div>

        <h2 className="mt-5 text-xl font-black">
          Delete this note?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          You are about to delete{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            “{note.title}”
          </span>
          . This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FOOTER HELPERS
========================================================= */

function FooterIconButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
    >
      {icon}
    </button>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="text-sm font-black">{title}</h4>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item}>
            <button className="text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300">
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/[0.035]">
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="font-black">{value}</span>
    </div>
  );
}