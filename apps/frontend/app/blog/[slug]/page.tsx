import { SimpleViewer } from "@/components/tiptap-templates/simple/simple-viewer";
import TLDRButton from "@/components/TLDRButton";

export default function ({params}: { params: { slug: string}}) {
    const {slug} = params;
    return (
        <>
            <div className="flex">
                <SimpleViewer slug={slug}/>
                <TLDRButton></TLDRButton>
            </div>
        </>
    )
}