"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 rounded-md bg-white shadow-sm">
        <button
          className="p-1"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold
            className={`w-4 h-4 ${
              editor.isActive("bold") ? "text-blue-500" : ""
            }`}
          />
        </button>
        <button
          className="p-1"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic
            className={`w-4 h-4 ${
              editor.isActive("italic") ? "text-blue-500" : ""
            }`}
          />
        </button>
        <button
          className="p-1"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon
            className={`w-4 h-4 ${
              editor.isActive("underline") ? "text-blue-500" : ""
            }`}
          />
        </button>
        <button
          className={`p-1 ${
            editor.isActive("heading", { level: 1 }) ? "text-blue-500" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          className={`p-1 ${
            editor.isActive("heading", { level: 2 }) ? "text-blue-500" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          className={`p-1 ${
            editor.isActive("heading", { level: 3 }) ? "text-blue-500" : ""
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>

        <button
          className="p-1"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List
            className={`w-4 h-4 ${
              editor.isActive("bulletList") ? "text-blue-500" : ""
            }`}
          />
        </button>
        <button
          className="p-1"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered
            className={`w-4 h-4 ${
              editor.isActive("orderedList") ? "text-blue-500" : ""
            }`}
          />
        </button>
        <button
          className="p-1"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote
            className={`w-4 h-4 ${
              editor.isActive("blockquote") ? "text-blue-500" : ""
            }`}
          />
        </button>
        <button
          className="p-1"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code
            className={`w-4 h-4 ${
              editor.isActive("codeBlock") ? "text-blue-500" : ""
            }`}
          />
        </button>
      </div>

      <div className="prose max-w-full border p-4 rounded-md bg-white shadow [&_.ProseMirror]:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
