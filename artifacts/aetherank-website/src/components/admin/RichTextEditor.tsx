import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Code2,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon,
  Undo2, Redo2, Minus, Heading1, Heading2, Heading3,
  Type,
  WrapText,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const SEPARATOR = <div className="w-px h-5 bg-[#dcdcde] mx-0.5 self-center shrink-0" />;

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors shrink-0 ${
        active
          ? "bg-[#2271b1] text-white"
          : "text-[#646970] hover:bg-[#f0f0f1] hover:text-[#1d2327] disabled:opacity-30"
      }`}
    >
      {children}
    </button>
  );
}

function LinkModal({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const prev = editor.getAttributes("link").href as string ?? "";
  const [url, setUrl] = useState(prev);

  function apply() {
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl p-5 w-80 border border-[#c3c4c7]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[#1d2327] font-semibold text-sm mb-3">Insert Link</h3>
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="https://example.com"
          className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm text-[#1d2327] placeholder-[#a7aaad] focus:outline-none focus:border-[#2271b1] mb-3"
        />
        <div className="flex gap-2 justify-end">
          {prev && (
            <button
              onClick={() => { editor.chain().focus().extendMarkRange("link").unsetLink().run(); onClose(); }}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Remove
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-[#646970] hover:bg-[#f0f0f1] rounded">
            Cancel
          </button>
          <button
            onClick={apply}
            className="px-3 py-1.5 text-sm bg-[#2271b1] text-white rounded hover:bg-[#135e96]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageModal({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  function apply() {
    if (url) {
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl p-5 w-80 border border-[#c3c4c7]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[#1d2327] font-semibold text-sm mb-3">Insert Image</h3>
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="https://images.unsplash.com/…"
          className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm text-[#1d2327] placeholder-[#a7aaad] focus:outline-none focus:border-[#2271b1] mb-2"
        />
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text (optional)"
          className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm text-[#1d2327] placeholder-[#a7aaad] focus:outline-none focus:border-[#2271b1] mb-3"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-[#646970] hover:bg-[#f0f0f1] rounded">
            Cancel
          </button>
          <button
            onClick={apply}
            disabled={!url}
            className="px-3 py-1.5 text-sm bg-[#2271b1] text-white rounded hover:bg-[#135e96] disabled:opacity-50"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your post content here…",
  minHeight = 400,
}: RichTextEditorProps) {
  const [showLink, setShowLink] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Disable built-in versions so we can add configured ones below
        underline: false,
        link: false,
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextStyle,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none px-5 py-4 min-h-[inherit]",
        spellcheck: "true",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const iconSz = "w-4 h-4";

  if (!editor) return null;

  return (
    <>
      {showLink && <LinkModal editor={editor} onClose={() => setShowLink(false)} />}
      {showImage && <ImageModal editor={editor} onClose={() => setShowImage(false)} />}

      <div className="border border-[#8c8f94] rounded overflow-hidden focus-within:border-[#2271b1] focus-within:shadow-[0_0_0_1px_#2271b1] transition-shadow">
        {/* ── Toolbar ── */}
        <div className="bg-[#f6f7f7] border-b border-[#dcdcde] px-2 py-1.5 flex flex-wrap items-center gap-0.5">
          {/* Undo / Redo */}
          <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo2 className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Redo (Ctrl+Shift+Z)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo2 className={iconSz} />
          </ToolbarButton>

          {SEPARATOR}

          {/* Headings */}
          <ToolbarButton title="Normal text" onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph") && !editor.isActive("heading")}>
            <Type className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
            <Heading1 className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
            <Heading2 className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
            <Heading3 className={iconSz} />
          </ToolbarButton>

          {SEPARATOR}

          {/* Formatting */}
          <ToolbarButton title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <Bold className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <Italic className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
            <UnderlineIcon className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
            <Strikethrough className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
            <Code className={iconSz} />
          </ToolbarButton>

          {SEPARATOR}

          {/* Alignment */}
          <ToolbarButton title="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
            <AlignLeft className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
            <AlignCenter className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
            <AlignRight className={iconSz} />
          </ToolbarButton>

          {SEPARATOR}

          {/* Lists */}
          <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
            <List className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
            <ListOrdered className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
            <Quote className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
            <Code2 className={iconSz} />
          </ToolbarButton>

          {SEPARATOR}

          {/* Insert */}
          <ToolbarButton title="Insert link" onClick={() => setShowLink(true)} active={editor.isActive("link")}>
            <LinkIcon className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Insert image" onClick={() => setShowImage(true)}>
            <ImageIcon className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className={iconSz} />
          </ToolbarButton>
          <ToolbarButton title="Hard break (Shift+Enter)" onClick={() => editor.chain().focus().setHardBreak().run()}>
            <WrapText className={iconSz} />
          </ToolbarButton>
        </div>

        {/* ── Editor area ── */}
        <div style={{ minHeight }} className="bg-white">
          <EditorContent editor={editor} />
        </div>

        {/* ── Word count ── */}
        <div className="bg-[#f6f7f7] border-t border-[#dcdcde] px-3 py-1 flex items-center justify-between">
          <span className="text-[#a7aaad] text-xs">
            {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words
          </span>
          <span className="text-[#a7aaad] text-xs">
            {Math.max(1, Math.round(editor.getText().split(/\s+/).filter(Boolean).length / 200))} min read
          </span>
        </div>
      </div>
    </>
  );
}
