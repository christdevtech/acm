import { useState, useEffect, useCallback } from 'react'
import { toast } from '@payloadcms/ui'
import type { Comment } from '@/payload-types'
import { createLexicalContent } from '@/utilities/lexicalHelpers'

interface CommentFormData {
  content: string
  authorName: string
  authorEmail: string
}

interface UseCommentsProps {
  parentId: string
  parentType: 'petitions' | 'posts' | 'projects'
}

interface UseCommentsReturn {
  comments: Comment[]
  loading: boolean
  submitting: boolean
  newComment: CommentFormData
  setNewComment: React.Dispatch<React.SetStateAction<CommentFormData>>
  handleSubmit: (e: React.FormEvent) => Promise<void>
  fetchComments: () => Promise<void>
}

export const useComments = ({ parentId, parentType }: UseCommentsProps): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState<CommentFormData>({
    content: '',
    authorName: '',
    authorEmail: '',
  })

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/comments?where[parentType][equals]=${parentType}&where[parentId][equals]=${parentId}&where[status][equals]=approved&sort=-createdAt&depth=0`,
      )
      const data = await response.json()
      setComments(data.docs || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Failed to load comments. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }, [parentId, parentType])

  const validateComment = (comment: CommentFormData): boolean => {
    if (!comment.content.trim()) {
      toast.error('Please enter a comment.')
      return false
    }
    
    if (!comment.authorName.trim()) {
      toast.error('Please enter your name.')
      return false
    }

    if (comment.content.length > 1000) {
      toast.error('Comment is too long. Please keep it under 1000 characters.')
      return false
    }

    if (comment.authorName.length > 100) {
      toast.error('Name is too long. Please keep it under 100 characters.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateComment(newComment)) {
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: createLexicalContent(newComment.content),
          authorName: newComment.authorName,
          authorEmail: newComment.authorEmail || undefined,
          parentType,
          parentId,
          status: 'pending',
        }),
      })

      if (response.ok) {
        setNewComment({ content: '', authorName: '', authorEmail: '' })
        // Refresh comments list to show any immediately approved comments
        await fetchComments()
        toast.success('Comment submitted successfully! It will be reviewed before being published.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit comment. Please try again.'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return {
    comments,
    loading,
    submitting,
    newComment,
    setNewComment,
    handleSubmit,
    fetchComments,
  }
}