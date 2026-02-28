'use server'

import { generateWithHuggingFace } from '@/lib/ai'
import { generateWithHF } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function generateBookSummary(bookId: string) {
  console.log('📚 Generating summary for book:', bookId);

  try {
    const supabase = await createServerSupabaseClient()

    // Fetch book and chapters
    const { data: book, error } = await supabase
      .from('books')
      .select('title, author, chapters(content)')
      .eq('id', bookId)
      .single()

    if (error) {
      console.error('Database error:', error);
      return { error: 'Failed to fetch book from database' }
    }

    if (!book) {
      return { error: 'Book not found' }
    }

    if (!book.chapters || book.chapters.length === 0) {
      return { error: 'This book has no chapters yet' }
    }

    // Get first chapter content
    const firstChapter = book.chapters[0].content

    // Clean HTML and limit text
    const cleanText = firstChapter
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1500)

    if (!cleanText || cleanText.length < 50) {
      return { error: 'Not enough content to summarize' }
    }

    // Create prompt
    const prompt = `[INST] You are a helpful book assistant. Provide a clear, concise summary.

Book: "${book.title}" by ${book.author}

Excerpt from the book:
${cleanText}

Please write a 3-paragraph summary of this excerpt. [/INST]

Summary:`

    // Generate summary
    const summary = await generateWithHuggingFace(prompt, 400)
    /*const summary = generateWithHF({ 
          messages: [
              {
                  role: "user",
                  content: prompt,
              },
          ],
          model: "Qwen/Qwen2.5-7B-Instruct:together",
      });
*/
    console.log('✅ Summary generated successfully');
    return { summary: summary }

  } catch (error: any) {
    console.error('❌ Error:', error);
    return {
      error: error.message || 'Failed to generate summary. Please try again.'
    }
  }
}

export async function generateDiscussionQuestions(bookId: string) {
  console.log('❓ Generating discussion questions for book:', bookId);

  try {
    const supabase = await createServerSupabaseClient()

    const { data: book, error } = await supabase
      .from('books')
      .select('title, author, description')
      .eq('id', bookId)
      .single()

    if (error || !book) {
      return { error: 'Book not found' }
    }

    const prompt = `[INST] Generate 5 thought-provoking discussion questions for the book "${book.title}" by ${book.author}.

${book.description ? `Book description: ${book.description}` : ''}

Format your response as a numbered list:
1. [Question]
2. [Question]
3. [Question]
4. [Question]
5. [Question] [/INST]

Discussion Questions:
1.`

    const questions = await generateWithHuggingFace(prompt, 350)

    console.log('✅ Questions generated');
    return { questions: '1.' + questions.trim() }

  } catch (error: any) {
    console.error('❌ Error:', error);
    return {
      error: error.message || 'Failed to generate questions. Please try again.'
    }
  }
}
/*
export async function chatWithAI(message: string, bookContext?: string) {
  console.log('💬 Chat message:', message);

  try {
    const context = bookContext
      ? `You are discussing the book: ${bookContext}\n\n`
      : '';

    const prompt = `[INST] ${context}User: ${message}

Please provide a helpful, concise response. [/INST]
*/