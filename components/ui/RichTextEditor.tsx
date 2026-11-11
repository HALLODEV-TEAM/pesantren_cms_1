"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi artikel atau konten di sini...",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-700 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full my-4 mx-auto shadow-sm",
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose-pesantren min-h-[220px] p-4 focus:outline-none max-w-none text-slate-800",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Keep content synchronized if prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!isMounted || !editor) {
    return (
      <div className="w-full border border-slate-200 rounded-xl p-4 min-h-[260px] bg-white animate-pulse">
        <div className="h-8 bg-slate-100 rounded mb-4" />
        <div className="h-32 bg-slate-50 rounded" />
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL Tautan:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  return (
    <div className="w-full border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:border-emerald-600/60 focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/80 border-b border-slate-200/70">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("bold")
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Tebal (Ctrl+B)"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("italic")
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Miring (Ctrl+I)"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("strike")
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Coret"
        >
          <Strikethrough size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Judul 2 (H2)"
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Subjudul (H3)"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("bulletList")
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Daftar Poin"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("orderedList")
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Daftar Angka"
        >
          <ListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("blockquote")
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Kutipan"
        >
          <Quote size={16} />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
            editor.isActive("link")
              ? "bg-emerald-100 text-emerald-800"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
          }`}
          title="Tautan / Link"
        >
          <LinkIcon size={16} />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
          title="Sisipkan Gambar via URL"
        >
          <ImageIcon size={16} />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Urungkan (Ctrl+Z)"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Ulangi (Ctrl+Y)"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

