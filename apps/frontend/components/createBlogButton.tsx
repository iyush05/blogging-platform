'use client'
import axios from "axios"
import { generateRandomSlug } from "@/utils/generateRandomSlug";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { calculateReadTime } from "@/utils/calculateReadTime";

export default function CreateBlogButton({userId}: {userId: string}) {
    const { getToken } = useAuth();

  async function handleClick() {
    const blogSlug = generateRandomSlug();
    const token = await getToken();

    const content = {
                        "type": "doc",
                        "content": [
                          {
                            "type": "heading",
                            "attrs": {
                              "textAlign": null,
                              "level": 1
                            },
                            "content": [
                              {
                                "type": "text",
                                "text": "Title"
                              }
                            ]
                          },
                          {
                            "type": "paragraph",
                            "attrs": {
                              "textAlign": null
                            },
                            "content": [
                              {
                                "type": "text",
                                "text": "Tell your story..."
                              }
                            ]
                          }
                        ]
                      };
    
    const readTime = calculateReadTime(content);

    const response = await axios.post(`${BACKEND_URL}/blog/createBlog`, {
      content: content,
      authorId: userId,
      slug: blogSlug,
      title: "Title",
      readTime: readTime
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    redirect(`/createBlog/${blogSlug}`);
  }
    return(
        <>
            <button onClick={() => handleClick()}>Create a Blog</button>
        </>
    )
}