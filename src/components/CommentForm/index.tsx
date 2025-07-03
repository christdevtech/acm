'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Send, MessageSquarePlus, User, Mail } from 'lucide-react'

interface CommentFormData {
  content: string
  authorName: string
  authorEmail: string
}

interface CommentFormProps {
  newComment: CommentFormData
  setNewComment: React.Dispatch<React.SetStateAction<CommentFormData>>
  onSubmit: (e: React.FormEvent) => Promise<void>
  submitting: boolean
  className?: string
}

export const CommentForm: React.FC<CommentFormProps> = ({
  newComment,
  setNewComment,
  onSubmit,
  submitting,
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl" />
      
      <form onSubmit={onSubmit} className="relative space-y-6 p-8 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 pb-2 border-b border-border/30">
          <div className="p-2 bg-primary/10 rounded-xl">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Share Your Thoughts</h3>
            <p className="text-sm text-muted-foreground">Join the conversation and make your voice heard</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="authorName" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-primary" />
              Your Name *
            </label>
            <div className="relative group">
              <input
                type="text"
                id="authorName"
                value={newComment.authorName}
                onChange={(e) => setNewComment((prev) => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 group-hover:border-border disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your name"
                required
                disabled={submitting}
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="authorEmail" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
              <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <div className="relative group">
              <input
                type="email"
                id="authorEmail"
                value={newComment.authorEmail}
                onChange={(e) =>
                  setNewComment((prev) => ({ ...prev, authorEmail: e.target.value }))
                }
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 group-hover:border-border disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your.email@example.com"
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            Your Comment *
          </label>
          <div className="relative group">
            <textarea
              id="content"
              value={newComment.content}
              onChange={(e) => setNewComment((prev) => ({ ...prev, content: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 group-hover:border-border resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Share your thoughts, ideas, or feedback..."
              required
              disabled={submitting}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-muted-foreground">
                Express yourself freely and respectfully
              </div>
              <div className={`text-xs font-medium transition-colors ${
                newComment.content.length > 900 
                  ? 'text-destructive' 
                  : newComment.content.length > 750 
                  ? 'text-yellow-500' 
                  : 'text-muted-foreground'
              }`}>
                {newComment.content.length}/1000
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={submitting || !newComment.content.trim() || !newComment.authorName.trim()}
            className="group relative px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <div className="flex items-center gap-2">
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Publish Comment</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </form>
    </div>
  )
}