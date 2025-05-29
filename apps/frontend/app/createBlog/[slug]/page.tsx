import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { use } from 'react'

export default function CreateBlog ({ params }: { params: Promise<{ slug: string}>}) {
    const { slug } = use(params);
    return (
        <>
            <SimpleEditor slug={slug}/>
        </>
    )
}