/**
 * Utility functions for working with Lexical editor content
 */

export interface LexicalTextNode {
  detail: number
  format: number
  mode: 'normal' | 'token' | 'segmented'
  style: string
  text: string
  type: 'text'
  version: number
}

export interface LexicalParagraphNode {
  children: LexicalTextNode[]
  direction: 'ltr' | 'rtl'
  format: string
  indent: number
  type: 'paragraph'
  version: number
  textFormat: number
  textStyle: string
}

export interface LexicalRootNode {
  children: LexicalParagraphNode[]
  direction: 'ltr' | 'rtl'
  format: string
  indent: number
  type: 'root'
  version: number
}

export interface LexicalContent {
  root: LexicalRootNode
}

/**
 * Creates a properly formatted Lexical content structure from plain text
 * @param text - The plain text content to convert
 * @returns Lexical content structure
 */
export const createLexicalContent = (text: string): LexicalContent => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1
          }
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: ''
      }
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1
  }
})

/**
 * Creates a Lexical content structure with multiple paragraphs
 * @param paragraphs - Array of text strings, each becoming a paragraph
 * @returns Lexical content structure
 */
export const createMultiParagraphLexicalContent = (paragraphs: string[]): LexicalContent => ({
  root: {
    children: paragraphs.map(text => ({
      children: [
        {
          detail: 0,
          format: 0,
          mode: 'normal' as const,
          style: '',
          text,
          type: 'text' as const,
          version: 1
        }
      ],
      direction: 'ltr' as const,
      format: '',
      indent: 0,
      type: 'paragraph' as const,
      version: 1,
      textFormat: 0,
      textStyle: ''
    })),
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1
  }
})

/**
 * Extracts plain text from Lexical content structure
 * @param content - Lexical content structure
 * @returns Plain text string
 */
export const extractTextFromLexicalContent = (content: LexicalContent): string => {
  return content.root.children
    .map(paragraph => 
      paragraph.children
        .filter(child => child.type === 'text')
        .map(child => child.text)
        .join('')
    )
    .join('\n')
}