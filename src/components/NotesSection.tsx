"use client";

import { useState, useEffect } from "react";

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: number;
}

export default function NotesSection() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedNotes = localStorage.getItem("devnotes-basic-notes");
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            } catch (e) {
                console.error("Failed to parse notes from localStorage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("devnotes-basic-notes", JSON.stringify(notes));
        }
    }, [notes, isLoaded]);

    const handleAddNote = () => {
        if (!title.trim() && !content.trim()) return;

        const newNote: Note = {
            id: crypto.randomUUID(),
            title: title.trim(),
            content: content.trim(),
            createdAt: Date.now(),
        };

        setNotes((prev) => [newNote, ...prev]);
        setTitle("");
        setContent("");
    };

    const handleDeleteNote = (id: string) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    };

    if (!isLoaded) return null;

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            {/* Dynamic Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-200">
                        <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                    </svg>
                    Quick Thoughts
                </h2>
            </div>

            <div className="flex flex-col h-full p-6">
                {/* Input Area */}
                <div className="mb-6 space-y-4 bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative z-10">
                    <input
                        id="note-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note Title..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 text-slate-200 font-medium tracking-wide"
                    />
                    <textarea
                        id="note-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your ideas here..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 text-slate-300 custom-scrollbar leading-relaxed"
                    />
                    <button
                        onClick={handleAddNote}
                        disabled={!title.trim() && !content.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-900/40 disabled:shadow-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Save Note
                    </button>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Your Notes</span>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {notes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10 opacity-60">
                            <div className="w-20 h-20 mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-slate-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <p className="font-semibold text-slate-300">Nothing here yet</p>
                            <p className="text-sm mt-1 text-slate-500">Jot down your first idea</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div key={note.id} className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl group relative hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-blue-500/30 hover:bg-slate-800 transition-all duration-300">
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                    aria-label="Delete note"
                                    title="Delete note"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {note.title && <h3 className="font-bold text-slate-100 mb-2 pr-8 text-[15px] leading-snug">{note.title}</h3>}
                                {note.content && <p className="text-slate-400 whitespace-pre-wrap text-[14px] leading-relaxed">{note.content}</p>}

                                <div className="mt-4 flex items-center justify-between text-[11px] font-medium border-t border-slate-700/80 pt-3">
                                    <span className="text-blue-400/80 bg-blue-500/10 px-2 py-1 rounded-md">
                                        {new Date(note.createdAt).toLocaleDateString(undefined, {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-slate-500">
                                        {new Date(note.createdAt).toLocaleTimeString(undefined, {
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
