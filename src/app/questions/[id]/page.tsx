'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { 
  Globe, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Share2, 
  ArrowLeft,
  User,
  Clock,
  Eye
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/Header'

interface Comment {
  id: number
  author: string
  authorAvatar: string
  content: string
  createdAt: string
  likes: number
  dislikes: number
  isLiked: boolean
  isDisliked: boolean
  replies: Reply[]
}

interface Reply {
  id: number
  author: string
  authorAvatar: string
  content: string
  createdAt: string
  likes: number
  dislikes: number
  isLiked: boolean
  isDisliked: boolean
}

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuth } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [modalAction, setModalAction] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  // Mock data - real app da API dan keladi
  const question = {
    id: params.id,
    title: "Germaniyada o'qish uchun qanday hujjatlar kerak?",
    content: `Germaniyada o'qish uchun qanday hujjatlar kerak va ularni qayerdan olish mumkin? 

Men hozir O'zbekistonda o'qiyapman va Germaniyada bakalavr darajasida o'qimoqchiman. Qaysi universitetlar yaxshi va qanday hujjatlar kerakligini bilmoqchiman.

Agar tajribangiz bo'lsa, iltimos ulashing.`,
    author: "Aziza Karimova",
    authorAvatar: "AK",
    category: "education",
    tags: ["Germaniya", "O'qish", "Hujjatlar", "Bakalavr"],
    answers: 8,
    views: 245,
    likes: 23,
    dislikes: 2,
    isLiked: false,
    isDisliked: false,
    isFavorited: false,
    createdAt: "2 soat oldin",
    updatedAt: "1 soat oldin"
  }

  const comments: Comment[] = [
    {
      id: 1,
      author: "Jasur Toshmatov",
      authorAvatar: "JT",
      content: "Germaniyada o'qish uchun quyidagi hujjatlar kerak:\n\n1. Passport\n2. Diplom (notarial tasdiqlangan)\n3. IELTS yoki TestDaF sertifikati\n4. Motivatsion xat\n5. CV\n6. Moliyaviy kafolat\n\nEng yaxshi universitetlar: TUM, LMU, RWTH Aachen",
      createdAt: "1 soat oldin",
      likes: 15,
      dislikes: 0,
      isLiked: true,
      isDisliked: false,
      replies: [
        {
          id: 1,
          author: "Aziza Karimova",
          authorAvatar: "AK",
          content: "Rahmat! IELTS qanday ball kerak?",
          createdAt: "30 daqiqa oldin",
          likes: 3,
          dislikes: 0,
          isLiked: false,
          isDisliked: false
        }
      ]
    },
    {
      id: 2,
      author: "Malika Yusupova",
      authorAvatar: "MY",
      content: "Men ham Germaniyada o'qiyapman. DAAD stipendiyasini ko'rib chiqing - ular yaxshi yordam beradi. Universitet tanlashda QS reytingiga ham e'tibor bering.",
      createdAt: "45 daqiqa oldin",
      likes: 8,
      dislikes: 1,
      isLiked: false,
      isDisliked: false,
      replies: []
    }
  ]

  const handleLike = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, like funksiyasini bajarish
      console.log('Question liked')
      // Bu yerda like API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('like')
      setShowAuthModal(true)
    }
  }

  const handleDislike = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, dislike funksiyasini bajarish
      console.log('Question disliked')
      // Bu yerda dislike API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('dislike')
      setShowAuthModal(true)
    }
  }

  const handleFavorite = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, favorite funksiyasini bajarish
      console.log('Question favorited')
      // Bu yerda favorite API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('favorite')
      setShowAuthModal(true)
    }
  }

  const handleComment = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, comment funksiyasini bajarish
      console.log('Comment submitted')
      // Bu yerda comment API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('comment')
      setShowAuthModal(true)
    }
  }

  const handleReply = (commentId: number) => {
    if (isAuth) {
      setReplyingTo(commentId)
      setReplyText('')
    } else {
      setModalAction('reply')
      setShowAuthModal(true)
    }
  }

  const handleSubmitReply = (commentId: number) => {
    if (!replyText.trim()) return

    const newReply = {
      id: Date.now(),
      author: 'Siz',
      authorAvatar: 'S',
      content: replyText,
      createdAt: 'hozir',
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false
    }

    // Create a new comments array with the reply added
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        }
      }
      return comment
    })

    // In real app, this would update the state or call API
    console.log('New reply added:', newReply)
    console.log('Updated comments:', updatedComments)

    setReplyText('')
    setReplyingTo(null)
  }

  const handleCancelReply = () => {
    setReplyText('')
    setReplyingTo(null)
  }

  const handleCommentLike = (commentId: number) => {
    if (isAuth) {
      // Login qilingan bo'lsa, comment like funksiyasini bajarish
      console.log('Comment liked:', commentId)
      // Bu yerda comment like API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('commentLike')
      setShowAuthModal(true)
    }
  }

  const handleCommentDislike = (commentId: number) => {
    if (isAuth) {
      // Login qilingan bo'lsa, comment dislike funksiyasini bajarish
      console.log('Comment disliked:', commentId)
      // Bu yerda comment dislike API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setModalAction('commentDislike')
      setShowAuthModal(true)
    }
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
      case 'comment':
        return {
          title: 'Sharh qoldirish uchun ro\'yxatdan o\'ting',
          description: 'O\'z fikringizni bering va boshqalarga yordam bering.',
          icon: <MessageCircle className="h-12 w-12 text-blue-500" />
        }
      case 'reply':
        return {
          title: 'Javob berish uchun ro\'yxatdan o\'ting',
          description: 'Sharhlarga javob berib, muhokamani rivojlantiring.',
          icon: <MessageCircle className="h-12 w-12 text-purple-500" />
        }
      case 'commentLike':
        return {
          title: 'Sharhni yoqtirish uchun ro\'yxatdan o\'ting',
          description: 'Foydali sharhlarni yoqtirish va baholash uchun tizimga kiring.',
          icon: <ThumbsUp className="h-12 w-12 text-green-500" />
        }
      case 'commentDislike':
        return {
          title: 'Sharhni yoqtirmaslik uchun ro\'yxatdan o\'ting',
          description: 'Sharhlarni baholash va sifatini yaxshilashga yordam bering.',
          icon: <ThumbsDown className="h-12 w-12 text-red-500" />
        }
      default:
        return {
          title: 'Ro\'yxatdan o\'ting',
          description: 'Platformaning barcha xususiyatlaridan foydalanish uchun tizimga kiring.',
          icon: <MessageCircle className="h-12 w-12 text-blue-500" />
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="questions" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <motion.div 
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/questions"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Savollarga qaytish
          </Link>
        </motion.div>

        {/* Question */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-4 sm:p-8 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Question Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {question.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                  {question.category === 'education' ? 'Ta\'lim' : question.category}
                </span>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Question Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{question.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{question.createdAt}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{question.views} ko'rish</span>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="prose max-w-none mb-4 sm:mb-6">
            <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">{question.content}</p>
          </div>

          {/* Question Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Like/Dislike */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
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
                  onClick={handleDislike}
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
                onClick={handleFavorite}
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
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Add Comment Form */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-4 pb-0 sm:p-8 sm:pb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Javob bering
          </h2>
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm sm:text-base">
              ?
            </div>
            <div className="flex-1">
              {isAuth ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Javobingizni yozing..."
                    className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                  />
                  <div className="flex justify-end">
                    <Button className="px-6 py-2">
                      Javob berish
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Textarea
                    placeholder="Javobingizni yozing..."
                    className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                    disabled
                  />
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                    Javob berish uchun <button onClick={handleComment} className="text-blue-600 hover:text-blue-700">tizimga kiring</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-4 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {comments.length} javob
            </h2>
          </div>

          {/* Comments List */}
          <div className="space-y-4 sm:space-y-6">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Comment */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm sm:text-base">
                      {comment.authorAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{comment.author}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{comment.createdAt}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">{comment.content}</p>
                    </div>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center space-x-2 sm:space-x-4 mt-3 sm:mt-4 ml-10 sm:ml-13">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center space-x-1 text-xs sm:text-sm ${
                        comment.isLiked 
                          ? 'text-green-600' 
                          : 'text-gray-500 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCommentDislike(comment.id)}
                      className={`flex items-center space-x-1 text-xs sm:text-sm ${
                        comment.isDisliked 
                          ? 'text-red-600' 
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{comment.dislikes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 hover:text-blue-600"
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Javob berish</span>
                    </Button>
                  </div>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 ml-6 sm:ml-13 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-3">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Javobingizni yozing..."
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelReply}
                        >
                          Bekor qilish
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyText.trim()}
                        >
                          Javob berish
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-6 sm:ml-13 space-y-3 sm:space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-gray-200 pl-3 sm:pl-4">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-xs sm:text-sm">
                            {reply.authorAvatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                              <span className="font-semibold text-gray-900 text-xs sm:text-sm">{reply.author}</span>
                              <span className="text-xs text-gray-500">{reply.createdAt}</span>
                            </div>
                            <p className="text-gray-700 text-xs sm:text-sm">{reply.content}</p>
                            
                            {/* Reply Actions */}
                            <div className="flex items-center space-x-2 sm:space-x-4 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCommentLike(reply.id)}
                                className={`flex items-center space-x-1 text-xs ${
                                  reply.isLiked 
                                    ? 'text-green-600' 
                                    : 'text-gray-500 hover:text-green-600'
                                }`}
                              >
                                <ThumbsUp className="h-3 w-3" />
                                <span>{reply.likes}</span>
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCommentDislike(reply.id)}
                                className={`flex items-center space-x-1 text-xs ${
                                  reply.isDisliked 
                                    ? 'text-red-600' 
                                    : 'text-gray-500 hover:text-red-600'
                                }`}
                              >
                                <ThumbsDown className="h-3 w-3" />
                                <span>{reply.dislikes}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

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
