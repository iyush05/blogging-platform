import { SimpleViewer } from "@/components/tiptap-templates/simple/simple-viewer";

export default function ({params}: { params: { slug: string}}) {
    const {slug} = params;
    return (
        <>
            <SimpleViewer slug={slug}/>
        </>
    )
}