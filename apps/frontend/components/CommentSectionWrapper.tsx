// components/CommentSectionWrapper.tsx
'use client';

import CommentSection from './CommentSection';

interface CommentSectionWrapperProps {
  blogId: string;
  slug: string;
}

export default function CommentSectionWrapper({ blogId, slug }: CommentSectionWrapperProps) {
  return <CommentSection blogId={blogId} slug={slug} />;
}