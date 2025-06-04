'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs'
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import io from "socket.io-client";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    imageUrl?: string;
  };
}

interface CommentSectionProps {
  blogId: string;
  slug: string;
}

export default function CommentSection({ blogId, slug }: CommentSectionProps) {
  const { user, isLoaded } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const  { getToken } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${BACKEND_URL}/blog/comment`, {
        params: {
          blogId: blogId
        }
      })

      if (response) {
        console.log("comment response:", response)
        setComments(response.data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken()
    
    if (!newComment.trim() || !user) return;

    try {
      setIsSubmitting(true);
      const content = newComment.trim();
      const response = await axios.post(`${BACKEND_URL}/blog/comment`, {
        blogId: blogId,
        slug: slug,
        content: newComment.trim()
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response) {
        setNewComment('');
        socketRef.current.emit("comment", { blogId: blogId })
        await fetchComments();
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const socketRef = useRef<any>(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:4000")

    socketRef.current.on("comment_update", () => { 
      fetchComments();
    })

    return() => {
      socketRef.current.off("comment_update");
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">

        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>


        {user ? (
          <form onSubmit={handleSubmitComment} className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={user.imageUrl || '/default-avatar.png'}
                  alt={user.firstName || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <p className="text-gray-600 text-center">
              Please sign in to leave a comment
            </p>
          </div>
        )}


        <div className="px-6 py-4">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={comment.user.imageUrl || '/default-avatar.png'}
                      alt={comment.user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {comment.user.name || 'Anonymous'}
                      </h4>
                      <span className="text-gray-500 text-sm">
                        @{comment.user.username}
                      </span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">No comments yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}