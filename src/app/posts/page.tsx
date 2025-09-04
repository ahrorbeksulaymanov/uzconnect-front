'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { 
  Search, 
  Filter, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Share2,
  MoreVertical,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'

// Mock posts data
const mockPosts = [
  {
    id: 1,
    title: 'Germaniyada o\'qish tajribasi',
    content: 'Germaniyada o\'qish jarayonida qanday qiyinchiliklar va qulayliklar borligi haqida so\'zlab beraman. Dastlabki kunlar juda qiyin edi, lekin vaqt o\'tishi bilan hammasi yaxshilandi...',
    author: 'Aziza Karimova',
    authorAvatar: 'AK',
    category: 'O\'qish va ta\'lim',
    tags: ['Germaniya', 'O\'qish', 'Tajriba'],
    date: '2 soat oldin',
    likes: 45,
    dislikes: 2,
    comments: 12,
    shares: 8,
    isLiked: false,
    isDisliked: false,
    isFavorited: false
  },
  {
    id: 2,
    title: 'Berlin hayoti haqida',
    content: 'Berlin shahrida yashash va ishlash tajribasi, transport va madaniyat haqida gapirib beraman. Bu shahar haqiqatan ham ajoyib joy...',
    author: 'Jasur Toshmatov',
    authorAvatar: 'JT',
    category: 'Hayot va tajriba',
    tags: ['Berlin', 'Hayot', 'Madaniyat'],
    date: '1 kun oldin',
    likes: 23,
    dislikes: 1,
    comments: 8,
    shares: 5,
    isLiked: true,
    isDisliked: false,
    isFavorited: false
  },
  {
    id: 3,
    title: 'IT sohasida ish topish',
    content: 'Germaniyada IT sohasida ish topish uchun qanday qadamlar tashlash kerak? CV va intervyu haqida batafsil ma\'lumot...',
    author: 'Dilfuza Rahimova',
    authorAvatar: 'DR',
    category: 'Ish va martaba',
    tags: ['IT', 'Ish', 'Germaniya'],
    date: '3 kun oldin',
    likes: 67,
    dislikes: 3,
    comments: 15,
    shares: 12,
    isLiked: false,
    isDisliked: false,
    isFavorited: true
  }
]

const categories = [
  { id: 'all', name: 'Barchasi' },
  { id: 'study', name: 'O\'qish va ta\'lim' },
  { id: 'work', name: 'Ish va martaba' },
  { id: 'life', name: 'Hayot va tajriba' },
  { id: 'culture', name: 'Madaniyat va an\'analar' },
  { id: 'travel', name: 'Sayohat va joylar' },
  { id: 'tips', name: 'Maslahat va foydali ma\'lumotlar' }
]

export default function PostsPage() {
  const { isAuth } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [posts, setPosts] = useState(mockPosts)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        if (post.isLiked) {
          return { ...post, likes: post.likes - 1, isLiked: false }
        } else {
          return { 
            ...post, 
            likes: post.likes + 1, 
            isLiked: true,
            isDisliked: post.isDisliked ? false : post.isDisliked,
            dislikes: post.isDisliked ? post.dislikes - 1 : post.dislikes
          }
        }
      }
      return post
    }))
  }

  const handleDislike = (postId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        if (post.isDisliked) {
          return { ...post, dislikes: post.dislikes - 1, isDisliked: false }
        } else {
          return { 
            ...post, 
            dislikes: post.dislikes + 1, 
            isDisliked: true,
            isLiked: post.isLiked ? false : post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes
          }
        }
      }
      return post
    }))
  }

  const handleFavorite = (postId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isFavorited: !post.isFavorited }
      }
      return post
    }))
  }

  const handleComment = (postId: number) => {
    setShowAuthModal(true)
  }

  const handleShare = (postId: number) => {
    setShowAuthModal(true)
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === categories.find(c => c.id === selectedCategory)?.name
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'popular':
        return b.likes - a.likes
      case 'comments':
        return b.comments - a.comments
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="posts" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Postlar</h1>
          <p className="text-gray-600">Chet elda yashayotgan o\'zbeklarning tajribalari va ma\'lumotlari</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Postlarni qidirish..."
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
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Saralash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Eng yangi</SelectItem>
                <SelectItem value="popular">Eng mashhur</SelectItem>
                <SelectItem value="comments">Ko\'p kommentlar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Create Post Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-end mb-6"
        >
          <Button 
            onClick={() => {
              if (isAuth) {
                router.push('/posts/create')
              } else {
                setShowAuthModal(true)
              }
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Yangi post yozish</span>
          </Button>
        </motion.div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">{post.title}</h2>
                </Link>
                <p className="text-gray-600 mb-3 text-sm sm:text-base line-clamp-3">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {post.category}
                  </span>
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Like */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        post.isLiked 
                          ? 'text-blue-600 bg-blue-100' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>

                    {/* Dislike */}
                    <button
                      onClick={() => handleDislike(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        post.isDisliked 
                          ? 'text-red-600 bg-red-100' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.dislikes}</span>
                    </button>

                    {/* Comment */}
                    <button
                      onClick={() => handleComment(post.id)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.shares}</span>
                    </button>
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={() => handleFavorite(post.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      post.isFavorited 
                        ? 'text-red-600 bg-red-100' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tizimga kirish kerak</h3>
            <p className="text-gray-600 mb-6">
              Post yozish, komment qoldirish va reaksiya bildirish uchun tizimga kirishingiz kerak.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowAuthModal(false)}
                variant="outline"
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button 
                onClick={() => {
                  setShowAuthModal(false)
                  // Redirect to login
                }}
                className="flex-1"
              >
                Kirish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
