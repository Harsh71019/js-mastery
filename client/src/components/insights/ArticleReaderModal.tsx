import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  BookOpen,
  Code2,
  HelpCircle,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
  Copy,
  Check,
  Edit3,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react'
import type { Article, ArticleDomain } from '@/types/article'
import { useArticleDetail } from '@/hooks/useArticles'
import { useProgressStore } from '@/store/useProgressStore'

interface ArticleReaderModalProps {
  articleId: string | null
  initialArticle?: Article | null
  onClose: () => void
}

type ReaderTab = 'deep-dive' | 'code' | 'interview' | 'quiz' | 'notes'

const DOMAIN_LABELS: Record<ArticleDomain, string> = {
  'javascript-v8': 'JavaScript & V8 Internals',
  'distributed-systems': 'Distributed Systems & Scale',
  'frontend-performance': 'Frontend & Web Performance',
  'architecture-design': 'System Design & Architecture',
  'databases-caching': 'Databases, Caching & Storage',
  'reliability-security': 'Resilience, Reliability & Security',
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  articleId,
  initialArticle,
  onClose,
}) => {
  const { data: detailData, isLoading } = useArticleDetail(articleId)
  const article = detailData?.article || initialArticle

  const readArticles = useProgressStore(state => state.readArticles || [])
  const bookmarkedArticles = useProgressStore(state => state.bookmarkedArticles || [])
  const articleNotes = useProgressStore(state => state.articleNotes || {})
  const articleQuizScores = useProgressStore(state => state.articleQuizScores || {})

  const completeArticle = useProgressStore(state => state.completeArticle)
  const toggleBookmarkArticle = useProgressStore(state => state.toggleBookmarkArticle)
  const saveArticleNote = useProgressStore(state => state.saveArticleNote)
  const submitArticleQuiz = useProgressStore(state => state.submitArticleQuiz)

  const [activeTab, setActiveTab] = useState<ReaderTab>('deep-dive')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<{
    score: number
    total: number
    percentage: number
    passed: boolean
    results: any[]
  } | null>(null)
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false)

  // Personal Notes State
  const initialNote = (articleId ? articleNotes[articleId] : '') || detailData?.userNote || ''
  const [noteContent, setNoteContent] = useState(initialNote)
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Interview Accordion State
  const [expandedInterviewIdx, setExpandedInterviewIdx] = useState<number | null>(0)

  // Code Copy State
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null)

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (detailData?.userNote !== undefined) {
      setNoteContent(detailData.userNote)
    }
  }, [detailData?.userNote])

  useEffect(() => {
    // Reset state on article change
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizResult(null)
    setActiveTab('deep-dive')
    setScrollProgress(0)
  }, [articleId])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleScroll = () => {
    if (!contentContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentContainerRef.current
    const total = scrollHeight - clientHeight
    if (total > 0) {
      setScrollProgress(Math.min(100, Math.max(0, Math.round((scrollTop / total) * 100))))
    }
  }

  const handleNoteChange = (text: string) => {
    setNoteContent(text)
    setIsSavingNote(true)
    setNoteSavedFeedback(false)

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      if (articleId) {
        await saveArticleNote(articleId, text)
        setIsSavingNote(false)
        setNoteSavedFeedback(true)
        setTimeout(() => setNoteSavedFeedback(false), 2500)
      }
    }, 800)
  }

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code)
    setCopiedSnippetIdx(idx)
    setTimeout(() => setCopiedSnippetIdx(null), 2000)
  }

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return
    setSelectedAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }))
  }

  const handleQuizSubmit = async () => {
    if (!articleId || !article?.knowledgeCheck) return
    const answers = article.knowledgeCheck.map((_, idx) => selectedAnswers[idx] ?? -1)
    if (answers.some(a => a === -1)) {
      alert('Please answer all knowledge check questions before submitting.')
      return
    }

    setIsSubmittingQuiz(true)
    try {
      const res = await submitArticleQuiz(articleId, answers)
      setQuizResult(res)
      setQuizSubmitted(true)
    } catch (err: unknown) {
      console.error('Quiz submission error:', err)
    } finally {
      setIsSubmittingQuiz(false)
    }
  }

  if (!articleId) return null

  const isRead = articleId ? readArticles.includes(articleId) : false
  const isBookmarked = articleId ? bookmarkedArticles.includes(articleId) : false
  const existingQuizScore = articleId ? articleQuizScores[articleId] : null
  const knowledgeQuestions = article?.knowledgeCheck || []
  const codeSnippets = article?.codeSnippets || []
  const interviewQuestions = article?.interviewQuestions || []
  const takeaways = article?.takeaways || []
  const domainKey = article?.domain || 'architecture-design'
  const domainLabel = DOMAIN_LABELS[domainKey] || 'Engineering Architecture'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col bg-[#0e0e11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-text-primary">
        
        {/* Reading Progress Bar */}
        <div className="w-full bg-white/5 h-1">
          <div
            className="h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-green transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0 bg-[#121217]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider font-geist px-2 py-0.5 rounded bg-accent-purple/10 border border-accent-purple/20 shrink-0">
              {article?.company || 'Engineering'}
            </span>
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider font-geist px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 hidden sm:inline-block truncate">
              {domainLabel}
            </span>
            <h2 className="text-sm sm:text-base font-bold font-geist text-white truncate">
              {article?.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => articleId && toggleBookmarkArticle(articleId)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'text-accent-purple bg-accent-purple/10 border-accent-purple/30'
                  : 'text-text-tertiary border-white/5 hover:text-white hover:bg-white/5'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
            </button>

            {!isRead ? (
              <button
                onClick={() => articleId && completeArticle(articleId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-geist font-bold uppercase tracking-wider bg-accent-green/10 text-accent-green border border-accent-green/20 hover:bg-accent-green/20 transition-all cursor-pointer active:scale-95"
              >
                <CheckCircle2 size={14} />
                <span className="hidden sm:inline">Mark Read</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-geist font-bold text-accent-green bg-accent-green/10 border border-accent-green/20">
                <CheckCircle2 size={14} />
                <span className="hidden sm:inline">Read</span>
              </div>
            )}

            {article?.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-tertiary hover:text-white border border-white/5 hover:bg-white/5 transition-colors"
                title="Open Original External Blog"
              >
                <ExternalLink size={15} />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-tertiary hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              title="Close Reader (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.06] bg-[#0c0c0f] overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('deep-dive')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'deep-dive'
                ? 'bg-accent-purple/20 text-white font-bold border border-accent-purple/30 shadow-sm'
                : 'text-text-tertiary hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Deep Dive</span>
          </button>

          {codeSnippets.length > 0 && (
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-accent-blue/20 text-white font-bold border border-accent-blue/30 shadow-sm'
                  : 'text-text-tertiary hover:text-white'
              }`}
            >
              <Code2 size={14} />
              <span>Code & Patterns ({codeSnippets.length})</span>
            </button>
          )}

          {interviewQuestions.length > 0 && (
            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'interview'
                  ? 'bg-accent-amber/20 text-white font-bold border border-accent-amber/30 shadow-sm'
                  : 'text-text-tertiary hover:text-white'
              }`}
            >
              <HelpCircle size={14} />
              <span>Interview Q&A ({interviewQuestions.length})</span>
            </button>
          )}

          {knowledgeQuestions.length > 0 && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-accent-green/20 text-white font-bold border border-accent-green/30 shadow-sm'
                  : 'text-text-tertiary hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              <span>Knowledge Check</span>
              {(existingQuizScore || quizResult) && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent-green/30 text-white font-bold font-geist">
                  {quizResult ? `${quizResult.score}/${quizResult.total}` : `${existingQuizScore?.score}/${existingQuizScore?.total}`}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-all cursor-pointer whitespace-nowrap ml-auto ${
              activeTab === 'notes'
                ? 'bg-accent-purple/20 text-white font-bold border border-accent-purple/30 shadow-sm'
                : 'text-text-tertiary hover:text-white'
            }`}
          >
            <Edit3 size={14} />
            <span>My Notes</span>
            {noteContent.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
            )}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={contentContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6"
        >
          {isLoading && !article ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-8 bg-white/5 rounded-lg w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
              <div className="h-40 bg-white/5 rounded-xl mt-4" />
            </div>
          ) : (
            <>
              {/* TAB 1: DEEP DIVE */}
              {activeTab === 'deep-dive' && (
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                  
                  {/* Article Hero Banner */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 relative overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold font-geist uppercase tracking-wider px-2 py-0.5 rounded bg-accent-purple/15 text-accent-purple border border-accent-purple/30">
                        {article?.company}
                      </span>
                      <span className="text-[10px] font-bold font-geist uppercase tracking-wider px-2 py-0.5 rounded bg-accent-blue/15 text-accent-blue border border-accent-blue/30">
                        {domainLabel}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-geist text-text-tertiary ml-auto">
                        <Clock size={12} />
                        <span>{article?.estimatedReadingTime} min deep-dive</span>
                      </div>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-bold font-geist text-white tracking-tight mb-3">
                      {article?.title}
                    </h1>

                    <p className="text-sm text-text-secondary leading-relaxed font-geist">
                      {article?.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                      {article?.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-geist text-text-tertiary px-2 py-0.5 rounded bg-white/[0.02] border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Takeaways Section */}
                  {takeaways.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-accent-purple/[0.04] border border-accent-purple/20">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] font-geist text-accent-purple flex items-center gap-2 mb-4">
                        <Flame size={15} />
                        Executive Engineering Takeaways
                      </h3>
                      <ul className="space-y-2.5">
                        {takeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                            <span className="w-5 h-5 rounded-md bg-accent-purple/15 text-accent-purple flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Main In-Depth Markdown Content */}
                  <div className="prose prose-invert max-w-none text-text-secondary font-geist leading-relaxed space-y-5 text-sm sm:text-base">
                    {article?.content ? (
                      article.content.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="text-lg font-bold text-white tracking-tight pt-4 border-t border-white/5 font-geist">
                              {paragraph.replace('### ', '')}
                            </h3>
                          )
                        }
                        if (paragraph.startsWith('## ')) {
                          return (
                            <h2 key={idx} className="text-xl font-bold text-white tracking-tight pt-6 font-geist flex items-center gap-2">
                              <Layers size={18} className="text-accent-blue" />
                              {paragraph.replace('## ', '')}
                            </h2>
                          )
                        }
                        if (paragraph.startsWith('```')) {
                          const lines = paragraph.split('\n')
                          const code = lines.slice(1, -1).join('\n')
                          return (
                            <pre key={idx} className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-text-secondary overflow-x-auto">
                              <code>{code}</code>
                            </pre>
                          )
                        }
                        return (
                          <p key={idx} className="text-text-secondary text-sm sm:text-[15px] leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      })
                    ) : (
                      <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-text-tertiary">
                        <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">
                          Refer to the external engineering source or switch to the Code & Interview tabs to master this system design pattern.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Next Step Prompts */}
                  <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    {codeSnippets.length > 0 && (
                      <button
                        onClick={() => setActiveTab('code')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-geist font-bold bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-all cursor-pointer"
                      >
                        <Code2 size={14} />
                        <span>Inspect Code Patterns ({codeSnippets.length})</span>
                      </button>
                    )}
                    {knowledgeQuestions.length > 0 && (
                      <button
                        onClick={() => setActiveTab('quiz')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-geist font-bold bg-accent-green/10 text-accent-green border border-accent-green/20 hover:bg-accent-green/20 transition-all cursor-pointer ml-auto"
                      >
                        <Sparkles size={14} />
                        <span>Take Knowledge Check Quiz</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CODE & PATTERNS */}
              {activeTab === 'code' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-geist">
                        Production Implementation & Code Patterns
                      </h3>
                      <p className="text-xs text-text-tertiary font-geist">
                        Engineered JavaScript / TypeScript implementations derived from this architecture.
                      </p>
                    </div>
                  </div>

                  {codeSnippets.map((snippet, idx) => (
                    <div key={idx} className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden shadow-lg">
                      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Code2 size={14} className="text-accent-blue" />
                          <span className="text-xs font-bold text-white font-geist">{snippet.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-text-tertiary">
                            {snippet.language}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(snippet.code, idx)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-geist text-text-tertiary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          {copiedSnippetIdx === idx ? (
                            <>
                              <Check size={12} className="text-accent-green" />
                              <span className="text-accent-green">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-text-primary overflow-x-auto bg-[#08080a]">
                        <code>{snippet.code}</code>
                      </pre>

                      <div className="p-4 bg-white/[0.015] border-t border-white/5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-accent-blue font-geist mb-1">
                          Architectural Breakdown
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-geist">
                          {snippet.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: INTERVIEW Q&A */}
              {activeTab === 'interview' && (
                <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-white font-geist">
                      System Design & Senior Interview Questions
                    </h3>
                    <p className="text-xs text-text-tertiary font-geist">
                      Real-world architectural questions frequently asked in Big Tech and Staff Engineer rounds.
                    </p>
                  </div>

                  <div className="space-y-3 mt-4">
                    {interviewQuestions.map((q, idx) => {
                      const isExpanded = expandedInterviewIdx === idx
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => setExpandedInterviewIdx(isExpanded ? null : idx)}
                            className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-5 h-5 rounded-md bg-accent-amber/15 text-accent-amber flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                Q{idx + 1}
                              </span>
                              <span className="text-sm font-bold text-white font-geist leading-snug">
                                {q.question}
                              </span>
                            </div>
                            <span className="text-text-tertiary shrink-0 mt-1">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-accent-amber/[0.015]">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-accent-amber font-geist mb-2 flex items-center gap-1.5">
                                <Sparkles size={12} />
                                Staff Engineer Model Answer & Trade-offs
                              </div>
                              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-geist whitespace-pre-line">
                                {q.sampleAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: KNOWLEDGE CHECK QUIZ */}
              {activeTab === 'quiz' && (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-green/10 to-transparent border border-accent-green/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white font-geist flex items-center gap-2">
                          <Sparkles size={16} className="text-accent-green" />
                          Knowledge Retention Check
                        </h3>
                        <p className="text-xs text-text-secondary font-geist mt-1">
                          Test your understanding of the architectural decisions and principles in this article.
                        </p>
                      </div>
                      {(existingQuizScore || quizResult) && (
                        <div className="text-right">
                          <span className="text-lg font-bold font-geist text-accent-green">
                            {quizResult ? `${quizResult.percentage}%` : `${Math.round((existingQuizScore!.score / existingQuizScore!.total) * 100)}%`}
                          </span>
                          <div className="text-[9px] uppercase font-bold text-text-tertiary font-geist">Score</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {knowledgeQuestions.map((q, qIdx) => {
                      const userSelection = selectedAnswers[qIdx]
                      const showResult = quizSubmitted || quizResult !== null

                      return (
                        <div
                          key={qIdx}
                          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-md bg-accent-purple/15 text-accent-purple flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {qIdx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-white font-geist leading-snug">
                              {q.question}
                            </h4>
                          </div>

                          <div className="space-y-2 pt-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = userSelection === optIdx
                              const isCorrect = optIdx === q.correctIndex

                              let optClasses = 'border-white/10 bg-white/[0.02] text-text-secondary hover:border-white/25'
                              if (showResult) {
                                if (isCorrect) {
                                  optClasses = 'border-accent-green/50 bg-accent-green/10 text-white font-bold'
                                } else if (isSelected && !isCorrect) {
                                  optClasses = 'border-accent-red/50 bg-accent-red/10 text-white line-through opacity-80'
                                } else {
                                  optClasses = 'border-white/5 bg-transparent text-text-tertiary opacity-50'
                                }
                              } else if (isSelected) {
                                optClasses = 'border-accent-purple/60 bg-accent-purple/15 text-white font-bold shadow-sm'
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(qIdx, optIdx)}
                                  disabled={showResult}
                                  className={`w-full p-3 rounded-xl border text-left text-xs font-geist flex items-center justify-between gap-3 transition-all cursor-pointer ${optClasses}`}
                                >
                                  <span>{opt}</span>
                                  {showResult && isCorrect && (
                                    <CheckCircle2 size={15} className="text-accent-green shrink-0" />
                                  )}
                                  {showResult && isSelected && !isCorrect && (
                                    <AlertTriangle size={15} className="text-accent-red shrink-0" />
                                  )}
                                </button>
                              )
                            })}
                          </div>

                          {showResult && (
                            <div className="p-3.5 rounded-xl bg-accent-purple/[0.05] border border-accent-purple/20 text-xs text-text-secondary font-geist leading-relaxed">
                              <span className="font-bold text-accent-purple uppercase tracking-wider text-[10px] block mb-1">
                                Concept Explanation:
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {!quizSubmitted && !quizResult && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleQuizSubmit}
                        disabled={isSubmittingQuiz}
                        className="px-6 py-2.5 rounded-xl text-xs font-geist font-bold uppercase tracking-wider bg-accent-green hover:bg-accent-green/90 text-black transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {isSubmittingQuiz ? 'Evaluating...' : 'Submit Answers & Record Score'}
                      </button>
                    </div>
                  )}

                  {quizResult && (
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-2">
                      <h4 className="text-base font-bold text-white font-geist">
                        {quizResult.passed ? '🎉 Concept Mastered!' : 'Keep Reviewing'}
                      </h4>
                      <p className="text-xs text-text-secondary font-geist">
                        You scored {quizResult.score} out of {quizResult.total} ({quizResult.percentage}%).
                        {quizResult.passed ? ' Reading streak updated and marked as complete.' : ' Review the explanations above to reinforce the concept.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PERSONAL NOTES */}
              {activeTab === 'notes' && (
                <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-geist">
                        Personal Study Notes & Key Insights
                      </h3>
                      <p className="text-xs text-text-tertiary font-geist">
                        Capture your architectural takeaways, interview reminders, and personal insights. Automatically synced.
                      </p>
                    </div>
                    <div className="text-[11px] font-geist flex items-center gap-1.5">
                      {isSavingNote && <span className="text-accent-amber">Saving...</span>}
                      {noteSavedFeedback && (
                        <span className="text-accent-green flex items-center gap-1">
                          <Check size={12} /> Saved to cloud
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={noteContent}
                      onChange={e => handleNoteChange(e.target.value)}
                      placeholder="Write your personal notes, key architecture tradeoffs, or interview tips for this article..."
                      className="w-full h-80 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-white font-geist text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.03] transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-tertiary font-geist pt-2">
                    <span>{noteContent.length} characters</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(noteContent)
                        alert('Notes copied to clipboard!')
                      }}
                      disabled={!noteContent.trim()}
                      className="text-text-secondary hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Copy Notes to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#121217] flex items-center justify-between text-xs text-text-tertiary font-geist shrink-0">
          <div className="flex items-center gap-2">
            <span>Reading Mode</span>
            <span className="opacity-40">•</span>
            <span>Esc to exit</span>
          </div>

          <div className="flex items-center gap-3">
            {article?.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-purple transition-colors flex items-center gap-1 text-[11px]"
              >
                <span>Read Original Blog</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
