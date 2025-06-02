"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, UserPlus, UserCheck, Calendar, Clock } from 'lucide-react';
import io from "socket.io-client";
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { BACKEND_URL } from '@/config';

type Like = {
  userId: string
  blogId: string
};

type Author = {
  name: string;
  profilePicture: string;
  username: string;
  authorId: string;
};

type BlogCardProps = {
  title: string;
  id: string;
  content: any; 
  readTime: number;
  author: Author;
  like: Like;
  isLike: false;
  uploadedDate: string;
  initialLikes: number;
  initialComments: number;
  isFollowing: boolean;
  currentUserId: string;
  onAuthorClick?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
};

export default function BlogCard ({
  title,
  id,
  readTime,
  author,
  uploadedDate,
  initialLikes,
  initialComments,
  isFollowing,
  isLike,
  currentUserId,
  onAuthorClick = () => console.log(`Navigate to 's profile`),
  onLike = () => console.log('Like clicked'),
  onComment = () => console.log('Comment clicked'),
  onShare = () => console.log('Share clicked'),
  onFollow = () => console.log('Follow clicked')
}: BlogCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const [comments, setComments] = useState(initialComments);
  const { getToken } = useAuth();


  // if(isLike) {
  //   setIsLiked(true);
  // }

  useEffect(() => {
    if(isLike)
      setIsLiked(true);
  }, [])

  const handleLike = async() => {
    console.log("handleLike button clicked")
    const token = await getToken()
    const userId = currentUserId;
    const prevLiked = isLiked;
    const prevLikes = likes;

    setIsLiked(!prevLiked);
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);
    const delta = !prevLiked ? 1 : -1; 
    if(!prevLiked) {
      try {
      const like = await axios.post(`${BACKEND_URL}/blog/like`, {
      blogId: id
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      console.log("Received like updat befree emit", { id, userId, currentUserId });
      socketRef.current.emit("like", { blogId: id, userId, delta})
      onLike();
    } catch (err) {
          //undo if failure
          setIsLiked(prevLiked);
          setLikes(prevLikes);
          console.error("Failed to like the post:", err);
    }
  } else {
    try {
      const like = await axios.delete(`${BACKEND_URL}/blog/like`, {
      data: {
        blogId: id
      }, 
      headers: {
        Authorization: `Bearer ${token}`,
      }
      });
    } catch (err) {
      setIsLiked(prevLiked);
          setLikes(prevLikes);
          console.error("Failed to dislike the post:", err);
    }
    socketRef.current.emit("dislike", {blogId: id, userId, delta});
  }
    
  };

  const handleFollow = () => {
    setFollowing(!following);
    onFollow();
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAuthorClick = () => {
    onAuthorClick();
  };

  const socketRef = useRef<any>(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:4000")

    socketRef.current.on("like_update", ({ blogId, userId, delta }) => {
      if(userId === currentUserId) return;
      if (blogId === id) setLikes((prev) => prev + delta);
    });

    socketRef.current.on("comment_update", ({ blogId, comment }) => {
      if(blogId === id) setComments((prev) => [...prev, comment]);
    });

    return () => {
      socketRef.current.off("like_update");
      socketRef.current.off("comment_update");
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleAuthorClick}
          >
            <img
              src={author.profilePicture}
              alt={`${author.name}'s profile`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {author.name}
              </h3>
              <p className="text-sm text-gray-500">@{author.username}</p>
            </div>
          </div>

          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              following
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {following ? (
              <>
                <UserCheck size={16} />
                Following
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Follow
              </>
            )}
          </button>
        </div>


        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">

        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isLiked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Heart 
            size={20} 
            className={isLiked ? 'fill-current' : ''} 
          />
          <span className="font-medium">{likes}</span>
        </button>

        <button
          onClick={onComment}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <MessageCircle size={20} />
          <span className="font-medium">{comments}</span>
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <Share2 size={20} />
          <span className="font-medium">Share</span>
        </button>
      </div>
    </div>
  );
};
