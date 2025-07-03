'use client'

import React from 'react'
import { MessageCircle, Clock, User } from 'lucide-react'
import type { Comment } from '@/payload-types'
import RichText from '@/components/RichText'

interface CommentListProps {
  comments: Comment[]
  loading: boolean
  className?: string
}

const getTimeAgo = (date: string) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return commentDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

const getAvatarGradient = (name: string) => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-yellow-500 to-orange-600',
    'from-purple-500 to-pink-600',
    'from-teal-500 to-green-600',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export const CommentList: React.FC<CommentListProps> = ({ comments, loading, className = '' }) => {
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-2xl" />
            <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/80 rounded-2xl flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-4 bg-primary/80 rounded-full"></div>
                    <div className="w-16 h-3 bg-primary/80 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 ml-16">
                <div className="w-full h-4 bg-primary/80 rounded-full"></div>
                <div className="w-4/5 h-4 bg-primary/80 rounded-full"></div>
                <div className="w-3/5 h-4 bg-primary/80 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-muted/10 rounded-2xl" />
        <div className="relative text-center py-16 px-8 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl">
          <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6">
            <MessageCircle className="h-8 w-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Start the Conversation</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No comments yet. Be the first to share your thoughts and spark meaningful discussions!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {comments.map((comment, index) => (
        <div
          key={comment.id}
          className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Comment Header */}
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div
                className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(comment.authorName)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <span className="text-white font-semibold text-lg">
                  {comment.authorName.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Author Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-foreground truncate">{comment.authorName}</h4>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <time
                      className="text-xs font-medium"
                      title={new Date(comment.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    >
                      {getTimeAgo(comment.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <div className="ml-16">
              <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
                <RichText data={comment.content} enableGutter={false} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
