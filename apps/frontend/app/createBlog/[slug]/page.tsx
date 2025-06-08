import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { use } from 'react'
import Navbar from "@/components/Navbar";

export default function CreateBlog ({ params }: { params: { slug: string}}) {
    const { slug } = params;
    return (
        <>
            {/* <Navbar /> */}
            <SimpleEditor slug={slug} />
        </>
    )
}