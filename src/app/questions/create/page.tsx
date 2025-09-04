'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'

function CreateQuestionPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Edit mode ni tekshirish
  const isEditMode = searchParams.get('edit') === 'true'
  const editId = searchParams.get('id')

  // Edit mode da ma'lumotlarni to'ldirish
  useEffect(() => {
    if (isEditMode) {
      const editTitle = searchParams.get('title')
      const editContent = searchParams.get('content')
      const editCategory = searchParams.get('category')
      const editTags = searchParams.get('tags')

      if (editTitle) setFormData(prev => ({ ...prev, title: editTitle }))
      if (editContent) setFormData(prev => ({ ...prev, content: editContent }))
      if (editCategory) setFormData(prev => ({ ...prev, category: editCategory }))
      if (editTags) setFormData(prev => ({ ...prev, tags: editTags }))
    }
  }, [isEditMode, searchParams])

  const categories = [
    { id: 'education', name: 'Ta\'lim' },
    { id: 'work', name: 'Ish' },
    { id: 'visa', name: 'Viza' },
    { id: 'accommodation', name: 'Yashash joyi' },
    { id: 'culture', name: 'Madaniyat' },
    { id: 'travel', name: 'Sayohat' },
    { id: 'language', name: 'Til o\'rganish' },
    { id: 'other', name: 'Boshqa' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isEditMode && editId) {
        // Update existing question
        const existingQuestions = JSON.parse(localStorage.getItem('questions') || '[]')
        const questionIndex = existingQuestions.findIndex((q: any) => q.id === parseInt(editId))
        
        if (questionIndex !== -1) {
          existingQuestions[questionIndex] = {
            ...existingQuestions[questionIndex],
            title: formData.title,
            content: formData.content,
            category: formData.category,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date().toISOString()
          }
          localStorage.setItem('questions', JSON.stringify(existingQuestions))
          alert('Savol muvaffaqiyatli yangilandi!')
        } else {
          alert('Savol topilmadi!')
          return
        }
      } else {
        // Create new question
        const newQuestion = {
          id: Date.now(),
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          author: 'Current User',
          createdAt: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          answers: 0,
          views: 0,
          isLiked: false,
          isDisliked: false,
          isFavorited: false
        }
        
        const existingQuestions = JSON.parse(localStorage.getItem('questions') || '[]')
        existingQuestions.push(newQuestion)
        localStorage.setItem('questions', JSON.stringify(existingQuestions))
        
        alert('Savol muvaffaqiyatli yuborildi!')
      }
      
      // Muvaffaqiyatli yuborilgandan keyin questions page ga qaytish
      router.push('/questions')
    } catch (error) {
      console.error('Error creating/updating question:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="questions" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Orqaga</span>
          </Button>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Savolni tahrirlash' : 'Yangi savol berish'}
          </h1>
          <p className="text-gray-600">
            O'z savolingizni bering va boshqalardan javob oling
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Savol sarlavhasi *
              </label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Savolingizni qisqacha yozing..."
                className="w-full"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya *
              </label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategoriyani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Savol matni *
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Savolingizni batafsil yozing..."
                className="w-full min-h-[200px]"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Teglar
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Teglarni vergul bilan ajrating (masalan: visa, talaba, berlin)"
                  className="w-full pl-10"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Teglar savolingizni topishni osonlashtiradi
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.content || !formData.category}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{isEditMode ? 'Yangilash' : 'Savolni yuborish'}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Yaxshi savol yozish uchun maslahatlar:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Sarlavhani aniq va tushunarli yozing</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Savol matnida barcha kerakli ma'lumotlarni bering</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>To'g'ri kategoriyani tanlang</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Teglardan foydalaning - bu savolingizni topishni osonlashtiradi</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default function CreateQuestionPage() {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Yuklanmoqda...</p>
            </div>
          </div>
        </div>
      }>
        <CreateQuestionPageContent />
      </Suspense>
    )
  }
  
