import BlogCard  from "@/components/blogCard"
import { prismaClient } from "db/client"

export default async function HomeBlogPage ({userId} : {userId: string}) {
    const blogs = await prismaClient.blog.findMany({
        include: {
            author: true,
            likes: true,
            comments: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    function isLiked(blog: any) {
        if (blog.likes.some((like: any) => like.userId === userId))
            return true;
        return false;
    }

    return (
        <>
            {blogs.map((blog) => (
                <BlogCard 
                    key={blog.id}
                    title={blog.title}
                    id={blog.id}
                    readTime={blog.readTime}
                    author={{
                        name: blog.author.name, 
                        profilePicture: blog.author.imageUrl, 
                        username: blog.author.username,
                        authorId: blog.author.clerkUserId
                    }}
                    uploadedDate={blog.createdAt}
                    initialLikes={blog.likes.length}
                    initialComments={blog.comments.length}
                    isFollowing={false}
                    like={{
                        userId: blog.likes.userId,
                        blogId: blog.likes.blogId
                    }}
                    isLike={isLiked(blog)}
                    currentUserId={userId}
                    slug={blog.slug}
                />
            ))}
        </>
    )
}