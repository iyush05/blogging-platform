import { prismaClient } from "db/client"
import CreateProfileModal from "@/components/createProfile";
import { auth } from "@clerk/nextjs/server"
import CreateBlogButton from "@/components/createBlogButton";
import { redirect } from "next/navigation";
import HomeBlogPage from "@/components/HomeBlogPage";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import CreateBlogBox from "@/components/CreateBlogBox";

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
  console.log("exeiting user",existingUser)
  // const { name, username, imageUrl, bio } = existingUser
  const name = existingUser?.name || ""
  const username = existingUser?.username
  const imageUrl = existingUser?.imageUrl;
  const bio = existingUser?.bio;
  let show = (existingUser) ? false : true;

  return (
        <>
        <Navbar />
          {show && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
            <CreateProfileModal />
          </div>
          )}
          <div className="grid grid-cols-8">
            <div className="col-span-2 p-2 hidden md:block pt-8">
              {/* <CreateBlogButton userId={userId!}/> */}
                <ProfileCard
                  profilePicture={imageUrl}
                  name={name}
                  userId={username}
                  bio={bio}
                  connectionsCount={128}
                  hide={true}
                />
            </div>
            <div className="col-span-8 md:col-span-4  p-2 overflow-auto">
              <div className="py-4 pb-6"><CreateBlogBox userId={userId}/></div>
              <HomeBlogPage userId={userId}/>
            </div>
            <div className="col-span-2 p-2 hidden md:block"> 
              
            </div>
          </div>
        </>
  );
}
