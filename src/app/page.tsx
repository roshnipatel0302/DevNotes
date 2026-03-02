import NotesSection from "@/components/NotesSection";
import CodeRunner from "@/components/CodeRunner";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col font-sans relative overflow-hidden">

      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1600px] w-full mx-auto mb-10 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-baseline gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
              DevNotes
            </span>
            <span className="text-slate-300 font-light text-2xl md:text-3xl bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700/50 shadow-sm backdrop-blur-md">
              Pro
            </span>
          </h1>
        </div>
        <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed ml-1">
          Your premium, distraction-free workspace for jotting down notes and executing JavaScript snippets securely.
        </p>
      </div>

      <div className="max-w-[1600px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px] pb-8 relative z-10">
        {/* Left Side: Notes Component */}
        <section className="h-[750px] lg:h-[800px] min-h-[500px]">
          <NotesSection />
        </section>

        {/* Right Side: Code Runner Component */}
        <section className="h-[750px] lg:h-[800px] min-h-[500px] shadow-2xl rounded-2xl border border-gray-800 overflow-hidden">
          <CodeRunner />
        </section>
      </div>
    </main>
  );
}
