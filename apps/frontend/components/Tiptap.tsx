'use client'

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function Tiptap()  {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<>Hello world</>'
    })

    return <EditorContent editor={editor} />
}

