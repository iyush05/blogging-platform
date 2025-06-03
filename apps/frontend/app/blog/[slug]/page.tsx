import CommentSection from "@/components/CommentSection";
import { SimpleViewer } from "@/components/tiptap-templates/simple/simple-viewer";
import TLDRButton from "@/components/TLDRButton";
import { BACKEND_URL } from "@/config";
import { auth } from "@clerk/nextjs/server";
import { includes } from "lodash";
import axios from "axios";
import CommentSectionWrapper from "@/components/CommentSectionWrapper";

export default async function ({params}: { params: { slug: string}}) {
    const {slug} = params;
    const { getToken } = await auth();
    const token = await getToken() || "";
    const response = await axios.get(`${BACKEND_URL}/blog/getBlog`, {
        params: {
            slug
        }
    })
    const blogId = response.data.id;
    console.log(blogId)
    return (
        <>
            <div className="grid grid-cols-8 overflow-auto h-screen pb-32">
                <div className="col-span-2 h-screen overflow-auto">
                    hi there
                </div>
                <div className="col-span-4 overflow-auto h-full border-2 rounded-2xl">
                    <div className="overflow-auto"><SimpleViewer slug={slug} /></div>
                    <div className="h-screen"><CommentSectionWrapper blogId={blogId} slug={slug}/></div>
                </div>
                <div className="col-span-2">
                    <TLDRButton slug={slug}></TLDRButton>
                </div>
            </div>
        </>
    )
}