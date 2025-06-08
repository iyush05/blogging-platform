'use client'
import React, { useState, useRef } from 'react';
import { Camera, Image, Video, FileText, Smile, X, Globe, Users, Lock } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { calculateReadTime } from '@/utils/calculateReadTime';
import { BACKEND_URL } from '@/config';
import { generateRandomSlug } from '@/utils/generateRandomSlug'; 
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

export default function CreateBlogBox({userId}: {userId: string}) {
  const [postText, setPostText] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [privacy, setPrivacy] = useState('public');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const router = useRouter();
  const handleImageUpload = () => {
    
  };

//   const handleClick = () => {
//     router.push('/');
//   }

  const getPrivacyIcon = () => {
    switch(privacy) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'connections': return <Users className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const isPostDisabled = !postText.trim() && uploadedImages.length === 0;

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
    router.push(`/createBlog/${blogSlug}`);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 font-sans" onClick={handleClick}>

      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          JD
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">John Doe</h3>
          <div className="flex items-center">
            <select 
              value={privacy} 
              onChange={(e) => setPrivacy(e.target.value)}
              className="text-sm text-gray-600 bg-transparent border-none outline-none cursor-pointer flex items-center"
            >
              <option value="public">🌍 Anyone</option>
              <option value="connections">👥 Connections only</option>
              <option value="private">🔒 Only me</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What do you want to talk about?"
          className="w-full min-h-[120px] p-4 text-lg placeholder-gray-500 border-none outline-none resize-none"
          maxLength={3000}
        />
        <div className="text-right text-sm text-gray-400 mt-1">
          {postText.length}/3000
        </div>
      </div>

      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Image className="w-5 h-5" />
            <span className="text-sm font-medium">Photo</span>
          </button>

          <button
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Video className="w-5 h-5" />
            <span className="text-sm font-medium">Video</span>
          </button>

          <button
            onClick={() => documentInputRef.current?.click()}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Document</span>
          </button>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <Smile className="w-5 h-5" />
            <span className="text-sm font-medium">Emoji</span>
          </button>
        </div>

        <button
        >
          Post
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
      />
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />
    </div>
  );
}