import { useState } from 'react'
import { AlertCircle, Trash2, RefreshCw, ChevronDown, ChevronUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { questions } from '../data/questions'
import { useExamStore } from '../store/examStore'

function WrongBookPage() {
  const wrongBook = useExamStore((state) => state.wrongBook)
  const removeWrongQuestion = useExamStore((state) => state.removeWrongQuestion)
  const clearWrongBook = useExamStore((state) => state.clearWrongBook)
  const addWrongQuestion = useExamStore((state) => state.addWrongQuestion)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === wrongBook.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(wrongBook.map((w) => w.questionId))
    }
  }

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => removeWrongQuestion(id))
    setSelectedIds([])
  }

  const handleRetry = () => {
    wrongBook.forEach((w) => {
      addWrongQuestion(w.questionId, w.userAnswer)
    })
    alert('已重新记录所有错题，你可以在题库练习中重新练习这些题目')
  }

  const getQuestion = (questionId: string) => {
    return questions.find((q) => q.id === questionId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index)
  }

  if (wrongBook.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center animate-fade-in">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">暂无错题</h2>
        <p className="text-gray-500">继续保持，你做得很棒！</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-lg">错题本</span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-sm">
              {wrongBook.length} 题
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRetry}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">重新练习</span>
            </button>
            <button
              onClick={clearWrongBook}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">清空</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.length === wrongBook.length && wrongBook.length > 0}
              onChange={toggleSelectAll}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-600 text-sm">全选</span>
          </label>
          {selectedIds.length > 0 && (
            <button
              onClick={handleRemoveSelected}
              className="text-red-500 hover:text-red-600 text-sm flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>删除选中 ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {wrongBook.map((wrong) => {
          const question = getQuestion(wrong.questionId)
          const isExpanded = expandedId === wrong.questionId

          if (!question) return null

          return (
            <div key={wrong.questionId} className="p-4 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(wrong.questionId)}
                  onChange={() => toggleSelect(wrong.questionId)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                />

                <div className="flex-1">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : wrong.questionId)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">
                        {question.chapter}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                        错误 {wrong.wrongCount} 次
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">
                        {formatDate(wrong.lastWrongDate)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-gray-800 font-medium">
                    {question.content}
                  </p>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                      <div className="space-y-2">
                        {question.options.map((option, index) => {
                          const isCorrect = index === question.correctIndex
                          const isUserAnswer = index === wrong.userAnswer
                          const showWrong = isUserAnswer && !isCorrect

                          return (
                            <div
                              key={index}
                              className={`p-3 rounded-lg flex items-center space-x-3 ${
                                isCorrect
                                  ? 'bg-green-50 border border-green-200'
                                  : showWrong
                                  ? 'bg-red-50 border border-red-200'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <span
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  isCorrect
                                    ? 'bg-green-500 text-white'
                                    : showWrong
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {getOptionLabel(index)}
                              </span>
                              <span className="flex-1">{option}</span>
                              {isCorrect && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                              {showWrong && (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-amber-500" />
                          <span className="font-medium text-amber-800">答案解析</span>
                        </div>
                        <p className="text-amber-900">{question.analysis}</p>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">
                          你的答案: {getOptionLabel(wrong.userAnswer)}
                        </span>
                        <span className="text-green-600 text-sm">
                          正确答案: {getOptionLabel(question.correctIndex)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WrongBookPage