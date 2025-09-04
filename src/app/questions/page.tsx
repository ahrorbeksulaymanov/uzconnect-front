'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  Globe,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  User,
  Clock,
  Eye,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'

export default function QuestionsPage() {
  const { isAuth } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [modalAction, setModalAction] = useState('')
  const router = useRouter()

  const categories = [
    { id: 'all', name: 'Barcha kategoriyalar', count: 156 },
    { id: 'education', name: 'Ta\'lim', count: 45 },
    { id: 'work', name: 'Ish', count: 32 },
    { id: 'visa', name: 'Viza', count: 28 },
    { id: 'accommodation', name: 'Yashash joyi', count: 23 },
    { id: 'culture', name: 'Madaniyat', count: 18 },
    { id: 'language', name: 'Til', count: 15 },
    { id: 'other', name: 'Boshqa', count: 12 }
  ]

  const mockQuestions = [
    {
      id: 1,
      title: "Germaniyada o'qish uchun qanday hujjatlar kerak?",
      content: "Germaniyada o'qish uchun qanday hujjatlar kerak va ularni qayerdan olish mumkin? Men hozir O'zbekistonda o'qiyapman va Germaniyada bakalavr darajasida o'qimoqchiman.",
      author: "Aziza Karimova",
      category: "education",
      tags: ["Germaniya", "O'qish", "Hujjatlar"],
      answers: 8,
      views: 245,
      likes: 23,
      dislikes: 2,
      isLiked: false,
      isDisliked: false,
      isFavorited: false,
      createdAt: "2 soat oldin"
    },
    {
      id: 2,
      title: "AQShda ish topish uchun qanday CV yozish kerak?",
      content: "AQShda ish topish uchun CV qanday yozilishi kerak? Qaysi format va qanday ma'lumotlar muhim?",
      author: "Jasur Toshmatov",
      category: "work",
      tags: ["AQSh", "Ish", "CV"],
      answers: 12,
      views: 189,
      likes: 31,
      dislikes: 1,
      isLiked: true,
      isDisliked: false,
      isFavorited: false,
      createdAt: "5 soat oldin"
    },
    {
      id: 3,
      title: "Rossiyada viza olish jarayoni qanday?",
      content: "Rossiyada viza olish jarayoni qanday? Qanday hujjatlar kerak va qancha vaqt ketadi?",
      author: "Malika Yusupova",
      category: "visa",
      tags: ["Rossiya", "Viza", "Hujjatlar"],
      answers: 6,
      views: 156,
      likes: 18,
      dislikes: 3,
      isLiked: false,
      isDisliked: false,
      isFavorited: true,
      createdAt: "1 kun oldin"
    },
    {
      id: 4,
      title: "Buyuk Britaniyada yashash joyi topish",
      content: "Buyuk Britaniyada yashash joyi qanday topiladi? Qanday joylar yaxshi va qancha pul ketadi?",
      author: "Dilshod Rahimov",
      category: "accommodation",
      tags: ["Buyuk Britaniya", "Yashash joyi", "Ijara"],
      answers: 9,
      views: 203,
      likes: 27,
      dislikes: 2,
      isLiked: false,
      isDisliked: false,
      isFavorited: false,
      createdAt: "3 soat oldin"
    },
    {
      id: 5,
      title: "Fransiyada madaniyat va odatlar",
      content: "Fransiyada qanday madaniyat va odatlar bor? Qanday xatolarni qilmaslik kerak?",
      author: "Nodira Karimova",
      category: "culture",
      tags: ["Fransiya", "Madaniyat", "Odatlar"],
      answers: 15,
      views: 178,
      likes: 42,
      dislikes: 1,
      isLiked: true,
      isDisliked: false,
      isFavorited: false,
      createdAt: "6 soat oldin"
    }
  ]

  const [questions, setQuestions] = useState(mockQuestions)

  const handleLike = (questionId: number) => {
    if (isAuth) {
      // Login qilingan bo'lsa, like funksiyasini bajarish
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          if (q.isLiked) {
            return { ...q, likes: q.likes - 1, isLiked: false }
          } else {
            return { 
              ...q, 
              likes: q.likes + 1, 
              isLiked: true,
              isDisliked: q.isDisliked ? false : q.isDisliked,
              dislikes: q.isDisliked ? q.dislikes - 1 : q.dislikes
            }
          }
        }
        return q
      }))
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('like')
      setShowAuthModal(true)
    }
  }

  const handleDislike = (questionId: number) => {
    setModalAction('dislike')
    setShowAuthModal(true)
  }

  const handleFavorite = (questionId: number) => {
    setModalAction('favorite')
    setShowAuthModal(true)
  }

  const handleAskQuestion = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, create page ga o'tish
      router.push('/questions/create')
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('ask')
      setShowAuthModal(true)
    }
  }

  const handleAnswer = (questionId: number) => {
    setModalAction('answer')
    setShowAuthModal(true)
  }

  const handleAuthAction = () => {
    setShowAuthModal(false)
    router.push('/auth/login')
  }

  const getModalContent = () => {
    switch (modalAction) {
      case 'like':
        return {
          title: 'Savolni yoqtirish uchun ro\'yxatdan o\'ting',
          description: 'Savollarni yoqtirish va boshqalarga foydali bo\'lganini ko\'rsatish uchun tizimga kiring.',
          icon: <ThumbsUp className="h-12 w-12 text-green-500" />
        }
      case 'dislike':
        return {
          title: 'Savolni yoqtirmaslik uchun ro\'yxatdan o\'ting',
          description: 'Savollarni baholash va sifatini yaxshilashga yordam bering.',
          icon: <ThumbsDown className="h-12 w-12 text-red-500" />
        }
      case 'favorite':
        return {
          title: 'Savolni saqlash uchun ro\'yxatdan o\'ting',
          description: 'Foydali savollarni saqlab qo\'ying va keyinroq ko\'rish uchun tizimga kiring.',
          icon: <Heart className="h-12 w-12 text-pink-500" />
        }
      case 'ask':
        return {
          title: 'Savol berish uchun ro\'yxatdan o\'ting',
          description: 'O\'z savollaringizni bering va boshqalarning tajribalaridan foydalaning.',
          icon: <Plus className="h-12 w-12 text-blue-500" />
        }
      case 'answer':
        return {
          title: 'Javob berish uchun ro\'yxatdan o\'ting',
          description: 'O\'z tajribangizni boshqalar bilan ulashing va jamiyatga hissa qo\'shing.',
          icon: <MessageCircle className="h-12 w-12 text-purple-500" />
        }
      default:
        return {
          title: 'Ro\'yxatdan o\'ting',
          description: 'Platformaning barcha xususiyatlaridan foydalanish uchun tizimga kiring.',
          icon: <AlertCircle className="h-12 w-12 text-blue-500" />
        }
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return b.likes - a.likes
      case 'answers':
        return b.answers - a.answers
      case 'views':
        return b.views - a.views
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="questions" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chet el haqida savollar va javoblar
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chet elda yashash, o'qish va ishlash haqida savollaringizni bering va boshqalarning tajribalaridan foydalaning
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Savollarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategoriya tanlang" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Tartiblash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Eng yangi</SelectItem>
                <SelectItem value="popular">Eng mashhur</SelectItem>
                <SelectItem value="answers">Ko'p javoblar</SelectItem>
                <SelectItem value="views">Ko'p ko'rilgan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Create Question Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-end mb-6"
        >
          <Button onClick={handleAskQuestion} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Savol berish</span>
          </Button>
        </motion.div>

        {/* Questions List */}
        <div className="space-y-4 sm:space-y-6">
          {sortedQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <Link href={`/questions/${question.id}`}>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                      {question.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base line-clamp-3">{question.content}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Question Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{question.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{question.createdAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{question.answers} javob</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{question.views} ko'rish</span>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="sm:ml-4 self-start">
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                    {categories.find(cat => cat.id === question.category)?.name}
                  </span>
                </div>
              </div>

              {/* Question Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* Like/Dislike */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(question.id)}
                      className={`flex items-center space-x-1 text-xs sm:text-sm ${
                        question.isLiked 
                          ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{question.likes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDislike(question.id)}
                      className={`flex items-center space-x-1 text-xs sm:text-sm ${
                        question.isDisliked 
                          ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{question.dislikes}</span>
                    </Button>
                  </div>

                  {/* Favorite */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavorite(question.id)}
                    className={`flex items-center space-x-1 text-xs sm:text-sm ${
                      question.isFavorited 
                        ? 'text-pink-600 bg-pink-50 hover:bg-pink-100' 
                        : 'text-gray-600 hover:text-pink-600'
                    }`}
                  >
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Saqlash</span>
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnswer(question.id)}
                    className="flex items-center space-x-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
                  >
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Javob berish</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedQuestions.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Savollar topilmadi</h3>
            <p className="text-gray-600 mb-4">
              Qidiruv so'rovingizga mos savollar topilmadi. Boshqa kalit so'zlar bilan sinab ko'ring.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-4">Savolingiz bormi?</h3>
          <p className="text-blue-100 mb-6">Chet el haqida savollaringizni bering va boshqalarning tajribalaridan foydalaning</p>
          <Button onClick={handleAskQuestion} variant="secondary" size="lg">
            Savol berish
          </Button>
        </motion.div>
      </div>

      {/* Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getModalContent().icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getModalContent().title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {getModalContent().description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleAuthAction} className="flex-1">
                    Tizimga kirish
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1"
                  >
                    Bekor qilish
                  </Button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Hisobingiz yo'qmi?{' '}
                  <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Ro'yxatdan o'ting
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
