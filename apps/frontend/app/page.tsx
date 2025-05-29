import { prismaClient } from "db/client"
import CreateProfileModal from "@/components/createProfile";
import { auth } from "@clerk/nextjs/server"
import CreateBlogButton from "@/components/createBlogButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();    // clerkUserId
  if(!userId) {
    // redirect("/sign-in")
    return 
  }
  console.log("userId: ", userId)
  const existingUser = await prismaClient.user.findUnique({
    where: {
      clerkUserId: userId as string
    }
  })
  let show = (existingUser) ? false : true;

  return (
        <>
          hello mf
          {show && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
            <CreateProfileModal />
          </div>
          )}
          <CreateBlogButton userId={userId!}/>
        </>
  );
}
