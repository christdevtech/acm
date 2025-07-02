'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send } from 'lucide-react'
import type { Comment } from '@/payload-types'
import RichText from '@/components/RichText'

interface PetitionCommentsProps {
  petitionId: string
}

export const PetitionComments: React.FC<PetitionCommentsProps> = ({ petitionId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
    authorEmail: '',
  })

  useEffect(() => {
    fetchComments()
  }, [petitionId])

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/comments?where[parentType][equals]=petitions&where[parentId][equals]=${petitionId}&where[status][equals]=approved&sort=-createdAt&depth=0`,
      )
      const data = await response.json()
      setComments(data.docs || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.content.trim() || !newComment.authorName.trim()) return

    setSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: [
            {
              type: 'paragraph',
              children: [{ text: newComment.content }],
            },
          ],
          authorName: newComment.authorName,
          authorEmail: newComment.authorEmail,
          parentType: 'petitions',
          parentId: petitionId,
          petition: petitionId,
          status: 'pending',
        }),
      })

      if (response.ok) {
        setNewComment({ content: '', authorName: '', authorEmail: '' })
        alert('Comment submitted successfully! It will be reviewed before being published.')
      } else {
        throw new Error('Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 p-6 bg-card border rounded-lg">
          <h3 className="font-semibold">Leave a comment</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium mb-1">
                Name *
              </label>
              <input
                type="text"
                id="authorName"
                value={newComment.authorName}
                onChange={(e) => setNewComment((prev) => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label htmlFor="authorEmail" className="block text-sm font-medium mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                id="authorEmail"
                value={newComment.authorEmail}
                onChange={(e) =>
                  setNewComment((prev) => ({ ...prev, authorEmail: e.target.value }))
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Comment *
            </label>
            <textarea
              id="content"
              value={newComment.content}
              onChange={(e) => setNewComment((prev) => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          <Button type="submit" disabled={submitting} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </Button>
        </form>

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{comment.authorName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {comment.content && <RichText data={comment.content} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
