'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Sparkles, MessageSquare, BookOpen, ArrowLeft } from 'lucide-react'
import { generateBookSummary, generateDiscussionQuestions } from '@/app/actions/ai'

export default function AIToolsPage() {
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [summaryResult, setSummaryResult] = useState('')
  const [questionsResult, setQuestionsResult] = useState('')
  const [summaryError, setSummaryError] = useState('')
  const [questionsError, setQuestionsError] = useState('')

  // Use sample book ID (you can make this dynamic later)
  const sampleBookId = '550e8400-e29b-41d4-a716-446655440001'

  const handleGenerateSummary = async () => {
    setSummaryLoading(true)
    setSummaryError('')
    setSummaryResult('')

    try {
      const response = await generateBookSummary(sampleBookId)
      
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
      const response = await generateDiscussionQuestions(sampleBookId)
      
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
      {/* Header */}
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
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Powered by Hugging Face AI
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI Book Tools
            </h1>
            <p className="text-xl text-gray-600">
              Generate summaries and discussion questions instantly
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Summary Generator */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Book Summary
                </CardTitle>
                <CardDescription className="text-base">
                  Get an AI-generated summary of any book in seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900">
                    <strong>Sample:</strong> The Great Adventure by Jane Smith
                  </p>
                </div>

                <Button 
                  onClick={handleGenerateSummary} 
                  disabled={summaryLoading}
                  className="w-full"
                  size="lg"
                >
                  {summaryLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating... (20-60s)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Summary
                    </>
                  )}
                </Button>

                {summaryError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm font-medium">Error:</p>
                    <p className="text-red-700 text-sm mt-1">{summaryError}</p>
                  </div>
                )}

                {summaryResult && !summaryLoading && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {summaryResult}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Discussion Questions Generator */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                  Discussion Questions
                </CardTitle>
                <CardDescription className="text-base">
                  Create thought-provoking questions for book clubs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-900">
                    <strong>Sample:</strong> The Great Adventure by Jane Smith
                  </p>
                </div>

                <Button 
                  onClick={handleGenerateQuestions} 
                  disabled={questionsLoading}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  {questionsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating... (20-60s)
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>

                {questionsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm font-medium">Error:</p>
                    <p className="text-red-700 text-sm mt-1">{questionsError}</p>
                  </div>
                )}

                {questionsResult && !questionsLoading && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {questionsResult}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Select a Tool</h3>
                  <p className="text-gray-700">
                    Choose between generating a summary or discussion questions
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">AI Processing</h3>
                  <p className="text-gray-700">
                    Our AI analyzes the book content and generates results
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Get Results</h3>
                  <p className="text-gray-700">
                    View, copy, or use the generated content instantly
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-purple-200">
                <p className="text-sm text-gray-700">
                  <strong>⚡ Speed:</strong> First generation may take 20-60 seconds as the AI model loads. 
                  Subsequent requests are much faster (5-15 seconds).
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>🔒 Privacy:</strong> Powered by Hugging Face's secure API. 
                  Your data is processed securely and not stored.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}