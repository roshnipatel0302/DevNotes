"use client";

import { useState, useEffect } from "react";

interface Snippet {
    id: string;
    name: string;
    code: string;
    createdAt: number;
}

export default function CodeRunner() {
    const [code, setCode] = useState('// Welcome to DevNotes JS Runner!\nconsole.log("Hello, World!");\n\nconst calculateSum = (a, b) => a + b;\nconsole.log("Sum:", calculateSum(5, 7));\n');
    const [output, setOutput] = useState<string>("");

    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [snippetName, setSnippetName] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedSnippets = localStorage.getItem("devnotes-basic-snippets");
        if (savedSnippets) {
            try {
                setSnippets(JSON.parse(savedSnippets));
            } catch (e) {
                console.error("Failed to parse snippets from localStorage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("devnotes-basic-snippets", JSON.stringify(snippets));
        }
    }, [snippets, isLoaded]);

    const handleSaveSnippet = () => {
        if (!snippetName.trim()) return;

        const existingIndex = snippets.findIndex(s => s.name.toLowerCase() === snippetName.toLowerCase().trim());

        if (existingIndex >= 0) {
            const updated = [...snippets];
            updated[existingIndex].code = code;
            updated[existingIndex].createdAt = Date.now();
            setSnippets(updated);
        } else {
            const newSnippet: Snippet = {
                id: crypto.randomUUID(),
                name: snippetName.trim(),
                code: code,
                createdAt: Date.now(),
            };
            setSnippets([newSnippet, ...snippets]);
        }
    };

    const loadSnippet = (snippet: Snippet) => {
        setCode(snippet.code);
        setSnippetName(snippet.name);
        setOutput("");
    };

    const deleteSnippet = (id: string) => {
        setSnippets(prev => prev.filter(s => s.id !== id));
    };

    const handleRunCode = () => {
        const currentLogs: string[] = [];

        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        const formatArg = (a: unknown) => {
            if (a === undefined) return "undefined";
            if (a === null) return "null";
            if (typeof a === 'object') {
                try {
                    return JSON.stringify(a, null, 2);
                } catch {
                    return String(a);
                }
            }
            return String(a);
        };

        console.log = (...args) => {
            currentLogs.push(args.map(formatArg).join(' '));
            originalLog(...args);
        };

        console.error = (...args) => {
            currentLogs.push("[Error] " + args.map(formatArg).join(' '));
            originalError(...args);
        };

        console.warn = (...args) => {
            currentLogs.push("[Warn] " + args.map(formatArg).join(' '));
            originalWarn(...args);
        };

        try {
            const executeFn = new Function(code);
            const result = executeFn();

            if (result !== undefined) {
                currentLogs.push(`=> ${formatArg(result)}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                currentLogs.push(`Execution Error: ${error.message}`);
            } else {
                currentLogs.push(`Execution Error: ${String(error)}`);
            }
        } finally {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        }

        setOutput(currentLogs.join('\n'));
    };

    const handleClear = () => {
        setOutput("");
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#252526] border-b border-[#333333]">
                <h2 className="text-lg font-semibold text-gray-200 tracking-tight flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.09 1.867.245.225.685.225.92 0 1.267-1.16 3.095-1.867 5.09-1.867 1.144 0 2.227.234 3.25.66.5.21.998-.164.998-.707V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v11.975a.75.75 0 01-1.5 0V4.533z" />
                    </svg>
                    JS Runner
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleClear}
                        className="hover:bg-white/10 text-gray-400 font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center"
                    >
                        Clear Console
                    </button>
                    <button
                        onClick={handleRunCode}
                        className="bg-green-600/90 hover:bg-green-500 text-white font-medium py-1.5 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-1.5 text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                        Run Code
                    </button>
                </div>
            </div>

            {/* Snippets Toolbar */}
            {isLoaded && (
                <div className="bg-[#1a1a1a] border-b border-[#333333] px-5 py-2.5 flex flex-wrap gap-3 items-center min-h-[52px]">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                            type="text"
                            value={snippetName}
                            onChange={e => setSnippetName(e.target.value)}
                            placeholder="Snippet name..."
                            className="bg-[#252526] border border-[#404040] focus:border-blue-500 rounded-md px-3 py-1.5 text-sm text-gray-200 focus:outline-none w-44 placeholder:text-gray-500"
                        />
                        <button
                            onClick={handleSaveSnippet}
                            disabled={!snippetName.trim() || !code.trim()}
                            className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-md text-sm transition-colors border border-blue-500/20 font-medium"
                        >
                            Save Code
                        </button>
                    </div>

                    <div className="h-5 w-px bg-[#333333] hidden sm:block"></div>

                    <div className="flex-1 flex overflow-x-auto gap-2 items-center custom-scrollbar pb-1 sm:pb-0">
                        {snippets.length === 0 ? (
                            <span className="text-xs text-gray-500 italic">No saved snippets yet...</span>
                        ) : (
                            snippets.map(snippet => (
                                <div key={snippet.id} className="flex items-center gap-1 bg-[#252526] border border-[#404040] rounded-md px-2.5 py-1.5 flex-shrink-0 group hover:border-[#555555] transition-colors">
                                    <button
                                        onClick={() => loadSnippet(snippet)}
                                        className="text-[13px] text-gray-300 hover:text-white truncate max-w-[120px] font-medium"
                                        title={snippet.name}
                                    >
                                        {snippet.name}
                                    </button>
                                    <button
                                        onClick={() => deleteSnippet(snippet.id)}
                                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 focus:opacity-100"
                                        title="Delete Snippet"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Code Editor Area */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                    className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] p-5 font-mono text-[15px] resize-none focus:outline-none leading-relaxed tracking-wide custom-scrollbar"
                    placeholder="// Write your JavaScript here..."
                />

                {/* Output Area */}
                <div className="h-2/5 min-h-[180px] bg-[#0d0d0d] border-t border-[#333333] flex flex-col">
                    <div className="px-4 py-2 flex items-center justify-between border-b border-[#252526] bg-[#1a1a1a]">
                        <div className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Console Output</div>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                        <pre className="text-[13px] font-mono whitespace-pre-wrap leading-relaxed">
                            {output ? (
                                output.split('\n').map((line, i) => {
                                    if (line.startsWith('[Error]') || line.startsWith('Execution Error')) {
                                        return <span key={i} className="text-red-400 block">{line}</span>;
                                    }
                                    if (line.startsWith('[Warn]')) {
                                        return <span key={i} className="text-yellow-400 block">{line}</span>;
                                    }
                                    return <span key={i} className="text-green-400 block">{line}</span>;
                                })
                            ) : (
                                <span className="text-gray-600 italic">No output... Run some code to see results.</span>
                            )}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
