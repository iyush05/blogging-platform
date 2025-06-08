import CommentSection from "@/components/CommentSection";
import { SimpleViewer } from "@/components/tiptap-templates/simple/simple-viewer";
import TLDRButton from "@/components/TLDRButton";
import { BACKEND_URL } from "@/config";
import { auth } from "@clerk/nextjs/server";
import { includes } from "lodash";
import axios from "axios";
import CommentSectionWrapper from "@/components/CommentSectionWrapper";
import ProfileCard from "@/components/ProfileCard"

export default async function ({params}: { params: { slug: string}}) {
    const {slug} = await params;
    const { getToken } = await auth();
    const token = await getToken() || "";
    const response = await axios.get(`${BACKEND_URL}/blog/getBlog`, {
        params: {
            slug
        }
    })
    console.log("getVlogs:", response.data);
    const {
        author: { imageUrl: profilePicture, name, username, connections, bio },
        id: blogId,
    } = response.data;
    console.log(blogId)
    return (
        <>
            <div className="grid grid-cols-8 overflow-auto h-screen pb-32">
                <div className="col-span-2 h-screen overflow-auto p-4">
                    <ProfileCard
                        profilePicture={profilePicture}
                        name={name}
                        userId={username}
                        bio={bio}
                        connectionsCount={128}
                        hide={false}
                    />
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