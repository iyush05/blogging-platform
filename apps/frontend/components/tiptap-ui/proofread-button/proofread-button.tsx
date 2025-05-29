"use client"

import * as React from "react"
import { isNodeSelection, type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { BoldIcon } from "@/components/tiptap-icons/bold-icon"
import { Code2Icon } from "@/components/tiptap-icons/code2-icon"
import { ItalicIcon } from "@/components/tiptap-icons/italic-icon"
import { StrikeIcon } from "@/components/tiptap-icons/strike-icon"
import { SubscriptIcon } from "@/components/tiptap-icons/subscript-icon"
import { SuperscriptIcon } from "@/components/tiptap-icons/superscript-icon"
import { UnderlineIcon } from "@/components/tiptap-icons/underline-icon"

// --- Lib ---
import { isMarkInSchema } from "@/lib/tiptap-utils"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

export type Mark =
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "underline"
  | "superscript"
  | "subscript"


export interface MarkButtonProps extends Omit<ButtonProps, "type"> {
  /**
   * The type of mark to toggle
   */
  type: Mark
  /**
   * Optional editor instance. If not provided, will use editor from context
   */
  editor?: Editor | null
  /**
   * Display text for the button (optional)
   */
  text?: string
  /**
   * Whether this button should be hidden when the mark is not available
   */
  hideWhenUnavailable?: boolean
}

export const ProofReadButton = React.forwardRef<HTMLButtonElement, MarkButtonProps>(
  (
    {
      editor: providedEditor,
      type,
      text,
      hideWhenUnavailable = false,
      className = "",
      disabled,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const editor = useTiptapEditor(providedEditor)

    const handleClick = async() => {
        /* TODO
        button click hone pe gemini ko content send krna and then result fetch krke text editor refresh krna 
        -- will do it the last prob - 7th june
        */
    }

    return (
      <Button 
        onClick={handleClick}>
        Proofread
      </Button>
    )
  }
)

ProofReadButton.displayName = "MarkButton"

export default ProofReadButton


