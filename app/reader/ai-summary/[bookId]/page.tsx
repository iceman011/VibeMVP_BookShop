'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles, MessageSquare, BookOpen, ArrowLeft } from 'lucide-react'
import { generateBookSummary, generateDiscussionQuestions } from '@/app/actions/ai'

export default function Page({ params, searchParams }: {
  params: { id: string };
  searchParams: { title?: string };
})  { 
  const bookId = params.id;          // "123"
  const bookTitle = searchParams.title; // "The Great Gatsby" 
  console.log('Selected Book : ', bookId,bookTitle);
  
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [summaryResult, setSummaryResult] = useState('')
  const [questionsResult, setQuestionsResult] = useState('')
  const [summaryError, setSummaryError] = useState('')
  const [questionsError, setQuestionsError] = useState('')

  const handleGenerateSummary = async () => {
    setSummaryLoading(true)
    setSummaryError('')
    setSummaryResult('')

    try {
      const response = await generateBookSummary(bookId)
      
      if (response.error) {
        setSummaryError(response.error)
      } else {
        setSummaryResult(response.summary || 'No summary generated')
      }
    } catch (err: any) {
      setSummaryError(err.message || 'Failed to generate summary')
    } finally {
      setSummaryLoading(false)
    }
  }

  const handleGenerateQuestions = async () => {
    setQuestionsLoading(true)
    setQuestionsError('')
    setQuestionsResult('')

    try {
      const response = await generateDiscussionQuestions(params.bookId)
      
      if (response.error) {
        setQuestionsError(response.error)
      } else {
        setQuestionsResult(response.questions || 'No questions generated')
      }
    } catch (err: any) {
      setQuestionsError(err.message || 'Failed to generate questions')
    } finally {
      setQuestionsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/reader">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">AI Book Analysis</h1>
            <p className="text-gray-600">Book Title: {bookTitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Generate Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGenerateSummary} 
                  disabled={summaryLoading}
                  className="w-full"
                >
                  {summaryLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {summaryLoading ? 'Generating...' : 'Generate Summary'}
                </Button>

                {summaryError && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-700 text-sm">{summaryError}</p>
                  </div>
                )}

                {summaryResult && (
                  <div className="bg-white border p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{summaryResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Questions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Discussion Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGenerateQuestions} 
                  disabled={questionsLoading}
                  className="w-full"
                  variant="outline"
                >
                  {questionsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {questionsLoading ? 'Generating...' : 'Generate Questions'}
                </Button>

                {questionsError && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-700 text-sm">{questionsError}</p>
                  </div>
                )}

                {questionsResult && (
                  <div className="bg-white border p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{questionsResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}