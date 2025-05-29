import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { use } from 'react'

export default function CreateBlog ({ params }: { params: { slug: string}}) {
    const { slug } = params;
    return (
        <>
            <SimpleEditor slug={slug} />
        </>
    )
}