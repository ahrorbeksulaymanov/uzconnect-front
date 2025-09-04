'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Share2,
  MoreVertical,
  User,
  Calendar,
  Tag,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/Header'

// Mock post data
const mockPost = {
  id: 1,
  title: 'Germaniyada o\'qish tajribasi',
  content: `Germaniyada o'qish jarayonida qanday qiyinchiliklar va qulayliklar borligi haqida so'zlab beraman.

Dastlabki kunlar juda qiyin edi, lekin vaqt o'tishi bilan hammasi yaxshilandi. Bu yerda sizga o'qish va yashash tajribamni baham ko'raman.

**Asosiy qiyinchiliklar:**
- Til muammosi (nemis tili)
- Madaniy farq
- Moliyaviy qiyinchiliklar
- Uy topish muammosi

**Qulayliklar:**
- Yaxshi ta'lim sifati
- Xalqaro tajriba
- Keng imkoniyatlar
- Yevropa sayohatlari

Agar siz ham Germaniyada o'qimoqchi bo'lsangiz, savollaringizni so'rang!`,
  author: 'Aziza Karimova',
  authorAvatar: 'AK',
  authorLocation: 'Berlin, Germaniya',
  category: 'O\'qish va ta\'lim',
  tags: ['Germaniya', 'O\'qish', 'Tajriba', 'Berlin'],
  date: '2024-01-15',
  time: '14:30',
  views: 1247,
  likes: 45,
  dislikes: 2,
  comments: 12,
  shares: 8,
  isLiked: false,
  isDisliked: false,
  isFavorited: false
}

// Mock comments data
const mockComments = [
  {
    id: 1,
    author: 'Jasur Toshmatov',
    authorAvatar: 'JT',
    content: 'Juda foydali ma\'lumot! Men ham Germaniyada o\'qimoqchi edim. Qo\'shimcha savollarim bor.',
    date: '2 soat oldin',
    likes: 8,
    dislikes: 0,
    isLiked: false,
    isDisliked: false,
    replies: [
      {
        id: 11,
        author: 'Aziza Karimova',
        authorAvatar: 'AK',
        content: 'Albatta! Savollaringizni so\'rang, javob beraman.',
        date: '1 soat oldin',
        likes: 3,
        dislikes: 0,
        isLiked: false,
        isDisliked: false
      }
    ]
  },
  {
    id: 2,
    author: 'Dilfuza Rahimova',
    authorAvatar: 'DR',
    content: 'Men ham Berlin da yashayman. Agar kerak bo\'lsa, yordam bera olaman.',
    date: '4 soat oldin',
    likes: 12,
    dislikes: 1,
    isLiked: true,
    isDisliked: false,
    replies: []
  }
]

export default function PostDetailPage() {
  const router = useRouter()
  const { isAuth } = useAuthStore()
  const [post, setPost] = useState(mockPost)
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleLike = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, like funksiyasini bajarish
      setPost(prev => {
        if (prev.isLiked) {
          return { ...prev, likes: prev.likes - 1, isLiked: false }
        } else {
          return { 
            ...prev, 
            likes: prev.likes + 1, 
            isLiked: true,
            isDisliked: prev.isDisliked ? false : prev.isDisliked,
            dislikes: prev.isDisliked ? prev.dislikes - 1 : prev.dislikes
          }
        }
      })
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleDislike = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, dislike funksiyasini bajarish
      setPost(prev => {
        if (prev.isDisliked) {
          return { ...prev, dislikes: prev.dislikes - 1, isDisliked: false }
        } else {
          return { 
            ...prev, 
            dislikes: prev.dislikes + 1, 
            isDisliked: true,
            isLiked: prev.isLiked ? false : prev.isLiked,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes
          }
        }
      })
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleFavorite = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, favorite funksiyasini bajarish
      setPost(prev => ({ ...prev, isFavorited: !prev.isFavorited }))
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleShare = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, share funksiyasini bajarish
      console.log('Post shared')
      // Bu yerda share API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleComment = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, comment funksiyasini bajarish
      if (!newComment.trim()) return
    
    const comment = {
      id: comments.length + 1,
      author: 'Siz',
      authorAvatar: 'S',
      content: newComment,
      date: 'hozir',
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      replies: []
    }
    
    setComments(prev => [comment, ...prev])
    setNewComment('')
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleCommentLike = (commentId: number) => {
    if (isAuth) {
      // Login qilingan bo'lsa, comment like funksiyasini bajarish
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          if (comment.isLiked) {
            return { ...comment, likes: comment.likes - 1, isLiked: false }
          } else {
            return { 
              ...comment, 
              likes: comment.likes + 1, 
              isLiked: true,
              isDisliked: comment.isDisliked ? false : comment.isDisliked,
              dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes
            }
          }
        }
        return comment
      }))
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleCommentDislike = (commentId: number) => {
    if (isAuth) {
      // Login qilingan bo'lsa, comment dislike funksiyasini bajarish
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          if (comment.isDisliked) {
            return { ...comment, dislikes: comment.dislikes - 1, isDisliked: false }
          } else {
            return { 
              ...comment, 
              dislikes: comment.dislikes + 1, 
              isDisliked: true,
              isLiked: comment.isLiked ? false : comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes
            }
          }
        }
        return comment
      }))
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleReply = (commentId: number) => {
    if (isAuth) {
      setReplyingTo(commentId)
      setReplyText('')
    } else {
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
      date: 'hozir',
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

    setComments(updatedComments)
    setReplyText('')
    setReplyingTo(null)
  }

  const handleCancelReply = () => {
    setReplyText('')
    setReplyingTo(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="posts" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Orqaga</span>
          </Button>
        </motion.div>

        {/* Post Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          {/* Post Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {post.authorAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{post.authorLocation}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{post.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views} ko'rish</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isLiked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isDisliked 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{post.dislikes}</span>
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isFavorited 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Saqlash</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Ulashish</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments} ta izoh</span>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Izohlar ({comments.length})
          </h2>

          {/* Add Comment */}
          <div className="mb-6">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                S
              </div>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Izohingizni yozing..."
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end mt-3">
                  <Button onClick={handleComment} disabled={!newComment.trim()}>
                    Izoh qoldirish
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {comment.authorAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-800 mb-3">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          comment.isLiked 
                            ? 'text-blue-600' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => handleCommentDislike(comment.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          comment.isDisliked 
                            ? 'text-red-600' 
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.dislikes}</span>
                      </button>
                      
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Javob berish</span>
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 ml-6 p-4 bg-gray-50 rounded-lg">
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
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {reply.authorAvatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium text-gray-900 text-sm">{reply.author}</h5>
                                <span className="text-xs text-gray-500">{reply.date}</span>
                              </div>
                              <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                              <div className="flex items-center space-x-3">
                                <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{reply.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600">
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>{reply.dislikes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ro'yxatdan o'ting
            </h3>
            <p className="text-gray-600 mb-6">
              Bu funksiyadan foydalanish uchun ro'yxatdan o'ting yoki tizimga kiring.
            </p>
            <div className="flex space-x-3">
              <Button className="flex-1" onClick={() => setShowAuthModal(false)}>
                Yopish
              </Button>
              <Button variant="outline" className="flex-1">
                Kirish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
