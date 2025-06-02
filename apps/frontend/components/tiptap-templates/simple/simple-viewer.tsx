"use client"

import * as React from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import axios from "axios"
import { useState } from "react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/tiptap-templates/simple/data/content.json"
import extractTitle from "../parser"
import { BACKEND_URL } from "@/config"
import { useAuth } from "@clerk/nextjs"

export function SimpleViewer({slug}: {slug: string}) {
  const [fetchedContent, setFetchedContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const {getToken} = useAuth()
  
  React.useEffect(() => {
    if (!slug) {
      setIsLoading(false)
      return
    }

    const fetchContent = async () => {
      try {
        const token = await getToken()
        const response = await axios.get(`${BACKEND_URL}/blog/getBlog`, {
          params: {slug: slug},
        })
        const content = response.data.content
        setFetchedContent(content)
      } catch (error) {
        console.error("Failed to fetch content:", error)

        setFetchedContent(content)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchContent()
  }, [slug, getToken])

  const editor = useEditor({
    immediatelyRender: false,
    editable: false, 
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, read-only view.",
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: (file) => handleImageUpload(file, { slug }),
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: fetchedContent || content, 
  }, [fetchedContent]) 

  if (isLoading) {
    return (
      <div className="simple-editor-loading">
        <p>Loading content...</p>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className="simple-editor-loading">
        <p>Initializing content...</p>
      </div>
    )
  }

  return (
    <div className="content-wrapper flex">
      <EditorContent
        editor={editor}
        role="presentation"
        className="simple-editor-content simple-editor-readonly"
      />
      {/* <div className="bg-black">
        Hello
      </div> */}
    </div>
  )
}