"use client";
import { BACKEND_URL } from "@/config";
import { useEffect, useState } from "react";
import axios from "axios"
import { useAuth, useUser } from "@clerk/nextjs";
import { prismaClient } from "db/client";

export default function CreateProfileModal() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(true);
  const [show, setShow] = useState(true);
  const { getToken } = useAuth();
  const { user } = useUser();

  const userId = user?.id;
  const email = user?.emailAddresses[0]?.emailAddress;
  const imageUrl = user?.imageUrl;

  async function handleSubmit() {
    const token = await getToken();
    setIsSubmitting(true);
    const userId = user?.id;

    const res = await axios.post(`${BACKEND_URL}/auth/createProfile`, {
      name: name,
      imageUrl: imageUrl,
      email: email,
      username: username
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res) {
      setDone(true);
      setShow(false);
    }

    setIsSubmitting(false);
  };

  return (
    <>
        {show && (
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Complete your profile</h2>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                 <h1>Enter your name</h1>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="border px-4 py-2 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <h1>Create usernname</h1>
                <input
                  type="text"
                  placeholder="Your Username"
                  className="border px-4 py-2 rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Submit"}
                </button>
              </form>
          </div>
        )}
    </>
  );
}
