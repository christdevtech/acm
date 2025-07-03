# Comment System Components

This directory contains reusable components for the comment system, designed to provide a clean and maintainable way to handle user comments across the application.

## Components

### CommentForm

A modern, reusable form component for submitting comments with enhanced UI/UX.

**Location:** `src/components/CommentForm/index.tsx`

**Props:**
- `newComment`: CommentFormData - The current form data
- `setNewComment`: React.Dispatch<React.SetStateAction<CommentFormData>> - State setter for form data
- `onSubmit`: (e: React.FormEvent) => Promise<void> - Form submission handler
- `submitting`: boolean - Loading state during submission
- `className?`: string - Optional additional CSS classes

**Modern Features:**
- **Glass-morphism Design**: Semi-transparent background with backdrop blur effects
- **Gradient Backgrounds**: Subtle gradient overlays for visual depth
- **Enhanced Typography**: Improved heading and descriptive text
- **Icon Integration**: Lucide React icons for visual context (User, Mail, MessageSquarePlus)
- **Smart Validation**: Real-time character count with color-coded warnings
- **Micro-interactions**: Hover effects, focus states, and smooth transitions
- **Loading States**: Animated spinner and disabled states during submission
- **Responsive Design**: Optimized for mobile and desktop experiences
- **Accessibility**: Proper ARIA labels, semantic HTML, and keyboard navigation

**Usage:**
```tsx
import { CommentForm } from '@/components/CommentForm'

const MyComponent = () => {
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
    authorEmail: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    // Handle form submission
  }

  return (
    <CommentForm
      newComment={newComment}
      setNewComment={setNewComment}
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  )
}
```

### CommentList

A modern, visually appealing component for displaying comment threads with enhanced UX.

**Location:** `src/components/CommentList/index.tsx`

**Props:**
- `comments`: Comment[] - Array of comment objects
- `loading`: boolean - Loading state
- `className?`: string - Optional additional CSS classes

**Modern Features:**
- **Dynamic Avatars**: Gradient-based user avatars with color variations
- **Smart Timestamps**: Relative time display ("2h ago", "Just now") with full date on hover
- **Glass-morphism Cards**: Semi-transparent comment cards with backdrop blur
- **Staggered Animations**: Sequential loading animations for visual appeal
- **Hover Interactions**: Scale effects and gradient reveals on hover
- **Enhanced Loading States**: Sophisticated skeleton screens with gradient backgrounds
- **Improved Empty State**: Engaging empty state with call-to-action messaging
- **Rich Typography**: Better text hierarchy and readability
- **Interaction Hints**: Reply buttons and engagement indicators
- **Responsive Layout**: Optimized spacing and layout for all screen sizes

**Usage:**
```tsx
import { CommentList } from '@/components/CommentList'

const MyComponent = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  return (
    <CommentList
      comments={comments}
      loading={loading}
    />
  )
}
```

## Utilities

### Lexical Helpers

**Location:** `src/utilities/lexicalHelpers.ts`

Utility functions for working with Lexical editor content:

- `createLexicalContent(text: string): LexicalContent` - Converts plain text to Lexical format
- `createMultiParagraphLexicalContent(paragraphs: string[]): LexicalContent` - Creates multi-paragraph content
- `extractTextFromLexicalContent(content: LexicalContent): string` - Extracts plain text from Lexical content

**Usage:**
```tsx
import { createLexicalContent } from '@/utilities/lexicalHelpers'

const lexicalContent = createLexicalContent('Hello, world!')
// Use lexicalContent in API calls
```

### PostComments

A complete comment system component specifically designed for blog posts.

**Location:** `src/components/PostComments/index.tsx`

**Props:**
- `postId`: string - The ID of the post
- `className?`: string - Optional additional CSS classes

**Features:**
- Integrates with the `useComments` hook for posts collection
- Displays comment count in header
- Includes both comment form and comment list
- Responsive design with proper spacing
- Glass-morphism design consistent with other components

**Usage:**
```tsx
import { PostComments } from '@/components/PostComments'

const BlogPost = ({ post }: { post: Post }) => {
  return (
    <div>
      {/* Post content */}
      <PostComments postId={post.id} />
    </div>
  )
}
```

### ProjectComments

A complete comment system component specifically designed for project pages.

**Location:** `src/components/ProjectComments/index.tsx`

**Props:**
- `projectId`: string - The ID of the project
- `className?`: string - Optional additional CSS classes

**Features:**
- Integrates with the `useComments` hook for projects collection
- Displays comment count in header
- Includes both comment form and comment list
- Full-width layout suitable for project pages
- Glass-morphism design consistent with other components

**Usage:**
```tsx
import { ProjectComments } from '@/components/ProjectComments'

const ProjectPage = ({ project }: { project: Project }) => {
  return (
    <div>
      {/* Project content */}
      <ProjectComments projectId={project.id} />
    </div>
  )
}
```

## Hooks

### useComments

**Location:** `src/hooks/useComments.ts`

A custom hook for managing comment state and operations.

**Parameters:**
- `parentId`: string - The ID of the parent entity (post, project, or petition)
- `parentType`: string - The type of parent entity ('posts', 'projects', or 'petitions')

**Returns:**
- `comments`: Comment[] - Array of comments
- `loading`: boolean - Loading state
- `submitting`: boolean - Submission state
- `newComment`: CommentFormData - Form data state
- `setNewComment`: State setter for form data
- `handleSubmit`: Form submission handler
- `fetchComments`: Function to refresh comments

**Features:**
- Automatic comment fetching on mount
- Form validation with toast notifications
- Lexical content conversion
- Error handling with user feedback
- Auto-refresh after successful submission
- Supports different parent types (posts, projects, petitions)

**Usage:**
```tsx
import { useComments } from '@/hooks/useComments'

const CustomComments = ({ entityId, entityType }: { entityId: string, entityType: string }) => {
  const {
    comments,
    loading,
    submitting,
    newComment,
    setNewComment,
    handleSubmit
  } = useComments(entityId, entityType)

  return (
    <div>
      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
      <CommentList comments={comments} loading={loading} />
    </div>
  )
}
```

## Toast Notifications

The comment system uses `@payloadcms/ui` toast notifications for user feedback:

- Success messages for successful submissions
- Error messages for validation failures
- Info messages for various states

## Implementation

The comment system has been implemented on:
- **Single Post Pages**: `/posts/[slug]` - Uses `PostComments` component
- **Single Project Pages**: `/projects/[slug]` - Uses `ProjectComments` component
- **Petition Pages**: `/petitions/[slug]` - Uses custom implementation with `useComments` hook

## Best Practices

1. **Validation**: Always validate form data before submission
2. **Error Handling**: Provide clear error messages to users
3. **Loading States**: Show loading indicators during async operations
4. **Accessibility**: Use proper labels, ARIA attributes, and semantic HTML
5. **Performance**: Use the custom hook to avoid prop drilling and improve reusability
6. **Type Safety**: Leverage TypeScript interfaces for better development experience
7. **Component Selection**: Use specific components (PostComments, ProjectComments) when available for better integration

## Future Enhancements

- Comment pagination for large comment lists
- Reply functionality for nested comments
- Comment moderation features
- Real-time updates with WebSockets
- Comment reactions (likes, dislikes)
- Rich text editor for comment content
- Comment search and filtering