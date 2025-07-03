'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useComments } from '@/hooks/useComments'
import { CommentForm } from '@/components/CommentForm'
import { CommentList } from '@/components/CommentList'

interface PostCommentsProps {
  postId: string
}

export const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
  const {
    comments,
    loading,
    submitting,
    newComment,
    setNewComment,
    handleSubmit,
  } = useComments({
    parentId: postId,
    parentType: 'posts',
  })

  return (
    <div className="mt-12 space-y-8">
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={handleSubmit}
          submitting={submitting}
          className="mb-8"
        />

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </h3>

          <CommentList comments={comments} loading={loading} />
        </div>
      </div>
    </div>
  )
}