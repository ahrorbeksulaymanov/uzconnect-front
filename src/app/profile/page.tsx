'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  User,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Edit,
  Camera,
  MessageCircle,
  Users,
  BookOpen,
  Briefcase,
  Heart,
  Star,
  X,
  ThumbsUp,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  
  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      title: "Germaniyada o'qish tajribasi",
      content: "Germaniyada o'qish jarayonida qanday qiyinchiliklar va qulayliklar borligi haqida...",
      date: "2 soat oldin",
      likes: 12,
      comments: 3,
      category: "Ta'lim",
      tags: ["ta'lim", "germaniya", "universitet"],
      summary: "Germaniyada o'qish tajribasi haqida"
    },
    {
      id: 2,
      title: "Berlin shahri haqida",
      content: "Berlin shahrida yashash va ishlash tajribasi...",
      date: "1 kun oldin",
      likes: 8,
      comments: 1,
      category: "Sayohat",
      tags: ["berlin", "sayohat", "yashash"],
      summary: "Berlin shahrida yashash tajribasi"
    },
    {
      id: 3,
      title: "Nemischa o'rganish maslahatlari",
      content: "Nemischa tilini tez o'rganish uchun foydali maslahatlar...",
      date: "3 kun oldin",
      likes: 15,
      comments: 5,
      category: "Ta'lim",
      tags: ["nemischa", "til", "o'rganish"],
      summary: "Nemischa tilini o'rganish maslahatlari"
    }
  ])

  const [userQuestions, setUserQuestions] = useState([
    {
      id: 1,
      title: "Germaniyada universitetga qanday hujjatlar kerak?",
      content: "Germaniyada universitetga qanday hujjatlar kerak bo'ladi? IELTS yoki TOEFL kerakmi?",
      date: "1 kun oldin",
      answers: 5,
      views: 23,
      category: "Ta'lim",
      tags: ["universitet", "hujjatlar", "germaniya"]
    },
    {
      id: 2,
      title: "Berlin da ish topish qanchalik qiyin?",
      content: "Berlin da IT sohasida ish topish qanchalik qiyin? Qanday kompaniyalar bor?",
      date: "2 kun oldin",
      answers: 3,
      views: 15,
      category: "Ish",
      tags: ["berlin", "ish", "IT"]
    }
  ])

  const [userEvents, setUserEvents] = useState([
    {
      id: 1,
      title: "O'zbeklar uchrashuvi Berlin",
      content: "Berlin da o'zbek talabalar va ishchilar uchun uchrashuv",
      date: "3 kun oldin",
      location: "Berlin, Germaniya",
      time: "2024-01-15 18:00",
      participants: 25,
      maxParticipants: 50,
      price: "Bepul"
    },
    {
      id: 2,
      title: "Nemischa til kursi",
      content: "Boshlang'ich darajadagi nemischa til kursi",
      date: "1 hafta oldin",
      location: "Online",
      time: "2024-01-20 19:00",
      participants: 12,
      maxParticipants: 20,
      price: "50€"
    }
  ])

  // Liked items state
  const [likedItems, setLikedItems] = useState([
    { id: 1, type: 'post', title: "Germaniyada o'qish tajribasi", content: "Germaniyada o'qish jarayonida qanday qiyinchiliklar va qulayliklar borligi haqida so'zlab beraman. Dastlabki kunlar juda qiyin edi, lekin vaqt o'tishi bilan hammasi yaxshilandi...", likes: 24, comments: 8, date: "2 kun oldin" },
    { id: 2, type: 'post', title: "Berlin shahrida ish topish maslahatlari", content: "Berlin shahrida ish topish jarayoni va muvaffaqiyatli intervyu berish uchun maslahatlar. Qanday qilib o'z CVingizni yaxshilash va ish beruvchilarga taqdim etish...", likes: 18, comments: 12, date: "5 kun oldin" },
    { id: 1, type: 'event', title: "O'zbeklar futbol uchrashuvi", content: "Berlin shahrida yashayotgan o'zbeklar uchun futbol uchrashuvi. Barcha darajadagi o'yinchilar qatnashishi mumkin. Qiziqarli o'yin va yangi do'stlar kutmoqda!", participants: "15/20", likes: 32, date: "1 hafta oldin" },
    { id: 2, type: 'event', title: "O'zbek milliy taomlari festivali", content: "Berlin shahrida o'zbek milliy taomlari festivali. Plov, manti, samsa va boshqa an'anaviy taomlar. O'zbek madaniyatini yaqindan tanib oling!", participants: "8/15", likes: 28, date: "3 kun oldin" }
  ])

  // Remove from liked items
  const removeFromLiked = (id: number, type: string) => {
    setLikedItems(prev => prev.filter(item => !(item.id === id && item.type === type)))
  }

  // URL query parametrlaridan tab ni o'qish
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'posts', 'questions', 'liked', 'events', 'friends'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const [profileData, setProfileData] = useState({
    firstName: 'Aziza',
    lastName: 'Karimova',
    email: 'aziza.karimova@email.com',
    country: 'Germaniya',
    city: 'Berlin',
    education: 'Oliy ta\'lim',
    university: 'Berlin Technical University',
    field: 'Computer Science',
    year: '2023',
    bio: 'Germaniyada o\'qiyotgan o\'zbek talabasi. Dasturlash va sun\'iy intellekt sohasida ishlayman. Yangi do\'stlar topish va tajriba almashishni xohlayman.',
    interests: ['Dasturlash', 'Sun\'iy intellekt', 'Musiqa', 'Sayohat', 'Kitob o\'qish'],
    languages: ['O\'zbekcha', 'Ruscha', 'Inglizcha', 'Nemischa']
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData({
      ...profileData,
      [name]: value
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    // Bu yerda profile ma'lumotlarini saqlash logikasi bo'ladi
    console.log('Profile saved:', profileData)
  }

  // Post delete funksiyasi
  const handleDeletePost = (postId: number) => {
    setPostToDelete(postId)
    setShowDeleteModal(true)
  }

  const confirmDeletePost = () => {
    if (postToDelete) {
      setUserPosts(prev => prev.filter(post => post.id !== postToDelete))
      setShowDeleteModal(false)
      setPostToDelete(null)
    }
  }

  const cancelDeletePost = () => {
    setShowDeleteModal(false)
    setPostToDelete(null)
  }

  // Post edit funksiyasi
  const handleEditPost = (post: any) => {
    // Post ma'lumotlarini URL params orqali uzatish
    const params = new URLSearchParams({
      edit: 'true',
      id: post.id.toString(),
      title: post.title,
      category: post.category,
      content: post.content,
      tags: post.tags.join(','),
      summary: post.summary || ''
    })
    router.push(`/posts/create?${params.toString()}`)
  }

  const handleUpdatePost = (updatedPost: any) => {
    setUserPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ))
    setShowEditModal(false)
    setEditingPost(null)
  }

  const cancelEditPost = () => {
    setShowEditModal(false)
    setEditingPost(null)
  }

  // Question delete funksiyasi
  const handleDeleteQuestion = (questionId: number) => {
    setPostToDelete(questionId)
    setShowDeleteModal(true)
  }

  const confirmDeleteQuestion = () => {
    if (postToDelete) {
      setUserQuestions(prev => prev.filter(question => question.id !== postToDelete))
      setShowDeleteModal(false)
      setPostToDelete(null)
    }
  }

  // Question edit funksiyasi
  const handleEditQuestion = (question: any) => {
    // Question ma'lumotlarini URL params orqali uzatish
    const params = new URLSearchParams({
      edit: 'true',
      id: question.id.toString(),
      title: question.title,
      category: question.category,
      content: question.content,
      tags: question.tags.join(',')
    })
    router.push(`/questions/create?${params.toString()}`)
  }

  const handleUpdateQuestion = (updatedQuestion: any) => {
    setUserQuestions(prev => prev.map(question => 
      question.id === updatedQuestion.id ? updatedQuestion : question
    ))
    setShowEditModal(false)
    setEditingPost(null)
  }

  // Event delete funksiyasi
  const handleDeleteEvent = (eventId: number) => {
    setPostToDelete(eventId)
    setShowDeleteModal(true)
  }

  const confirmDeleteEvent = () => {
    if (postToDelete) {
      setUserEvents(prev => prev.filter(event => event.id !== postToDelete))
      setShowDeleteModal(false)
      setPostToDelete(null)
    }
  }

  // Event edit funksiyasi
  const handleEditEvent = (event: any) => {
    // Event ma'lumotlarini URL params orqali uzatish
    const params = new URLSearchParams({
      edit: 'true',
      id: event.id.toString(),
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      time: event.time,
      category: event.category,
      maxParticipants: event.maxParticipants?.toString() || '',
      price: event.price || ''
    })
    router.push(`/events/create?${params.toString()}`)
  }

  const handleUpdateEvent = (updatedEvent: any) => {
    setUserEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ))
    setShowEditModal(false)
    setEditingPost(null)
  }

  // Tab o'zgarishida URL ni yangilash
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    router.push(`/profile?tab=${tabId}`)
  }

  const stats = [
    { label: 'Do\'stlar', value: '156', icon: Users, color: 'text-blue-600' },
    { label: 'Postlar', value: '23', icon: MessageCircle, color: 'text-green-600' },
    { label: 'Kurslar', value: '8', icon: BookOpen, color: 'text-purple-600' },
    { label: 'Layklar', value: '342', icon: Heart, color: 'text-red-600' }
  ]

  const educationLevels = [
    'O\'rta ta\'lim',
    'Oliy ta\'lim',
    'Magistratura',
    'PhD',
    'Boshqa'
  ]

  const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="profile" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-600 mb-2">{profileData.field} talabasi</p>
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profileData.city}, {profileData.country}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`${stat.color} mb-1`}>
                      <stat.icon className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full"
                >
                  {isEditing ? 'Tahrirlashni tugatish' : 'Profilni tahrirlash'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/posts/create?returnTab=posts')}
                >
                  Yangi post yozish
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'profile', label: 'Profil', icon: User },
                    { id: 'posts', label: 'Postlarim', icon: MessageCircle },
                    { id: 'questions', label: 'Savollarim', icon: MessageCircle },
                    { id: 'liked', label: 'Yoqtirganlarim', icon: Heart },
                    { id: 'events', label: 'Eventlarim', icon: Calendar },
                    { id: 'friends', label: 'Do\'stlar', icon: Users },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Shaxsiy ma'lumotlar</h3>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {isEditing ? 'Bekor qilish' : 'Tahrirlash'}
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ism</label>
                          <Input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Familiya</label>
                          <Input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Elektron pochta</label>
                          <Input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mamlakat</label>
                          <Input
                            type="text"
                            name="country"
                            value={profileData.country}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Shahar</label>
                          <Input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ta'lim darajasi</label>
                          <Select
                            value={profileData.education}
                            onValueChange={(value) => handleSelectChange('education', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="text-gray-900">
                              <SelectValue placeholder="Ta'lim darajasini tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              {educationLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-4 flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Bekor qilish
                          </Button>
                          <Button
                            onClick={handleSave}
                          >
                            Saqlash
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Education Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ta'lim ma'lumotlari</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{profileData.university}</div>
                            <div className="text-sm text-gray-600">{profileData.field}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>Bitirgan yili: {profileData.year}</span>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Universitet</label>
                            <Input
                              type="text"
                              name="university"
                              value={profileData.university}
                              onChange={handleChange}
                              className="text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Yo'nalish</label>
                            <Input
                              type="text"
                              name="field"
                              value={profileData.field}
                              onChange={handleChange}
                              className="text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bitirgan yili</label>
                            <Select
                              value={profileData.year}
                              onValueChange={(value) => handleSelectChange('year', value)}
                            >
                              <SelectTrigger className="text-gray-900">
                                <SelectValue placeholder="Yilni tanlang" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">O'zingiz haqida</h3>
                      <Textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                        className="text-gray-900 resize-none"
                      />
                    </div>

                    {/* Interests */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Qiziqishlar</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Biladigan tillar</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'posts' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Postlarim</h3>
                      <Button onClick={() => router.push('/posts/create?returnTab=posts')}>
                        Yangi post
                      </Button>
                    </div>

                    {/* User posts */}
                    <div className="space-y-4">
                      {userPosts.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Hali post yozmadingiz</h3>
                          <p className="text-gray-500 mb-4">Birinchi postingizni yozing va tajribangizni boshqalar bilan ulashing</p>
                          <Button onClick={() => router.push('/posts/create?returnTab=posts')}>
                            Post yozish
                          </Button>
                        </div>
                      ) : (
                        userPosts.map((post) => (
                          <div key={post.id} className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{post.title}</h4>
                                <p className="text-sm text-gray-500">{post.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-blue-600"
                                  onClick={() => handleEditPost(post)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {post.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments} ta sharh</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{post.likes} ta like</span>
                                </span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.category === 'Ta\'lim' ? 'bg-blue-100 text-blue-800' :
                                post.category === 'Sayohat' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {post.category}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'questions' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Savollarim</h3>
                      <Button onClick={() => router.push('/questions')}>
                        Barcha savollar
                      </Button>
                    </div>

                    {/* User questions */}
                    <div className="space-y-4">
                      {userQuestions.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Hali savol bermadingiz</h3>
                          <p className="text-gray-500 mb-4">Birinchi savolingizni bering va javob oling</p>
                          <Button onClick={() => router.push('/questions')}>
                            Savol berish
                          </Button>
                        </div>
                      ) : (
                        userQuestions.map((question) => (
                          <div key={question.id} className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{question.title}</h4>
                                <p className="text-sm text-gray-500">{question.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-blue-600"
                                  onClick={() => handleEditQuestion(question)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {question.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{question.answers} ta javob</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{question.views} ta ko'rish</span>
                                </span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                question.category === 'Ta\'lim' ? 'bg-blue-100 text-blue-800' :
                                question.category === 'Ish' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {question.category}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'liked' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Yoqtirgan narsalaringiz</h3>
                    {likedItems.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Hali yoqtirgan narsangiz yo'q</h3>
                        <p className="text-gray-500">Postlar, savollar yoki tadbirlarni yoqtirish uchun ❤️ tugmasini bosing</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {likedItems.map((item, index) => (
                          <div key={`${item.type}-${item.id}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.type === 'post' ? 'bg-green-100 text-green-800' :
                                    item.type === 'question' ? 'bg-blue-100 text-blue-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {item.type === 'post' ? 'Post' : item.type === 'question' ? 'Savol' : 'Tadbir'}
                                  </span>
                                  <span className="text-sm text-gray-500">{item.date}</span>
                                </div>
                                
                                <Link href={`/${item.type}s/${item.id}`}>
                                  <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                                    {item.title}
                                  </h4>
                                </Link>
                                
                                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                                  {item.content}
                                </p>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  {item.type === 'post' ? (
                                    <>
                                      <span className="flex items-center space-x-1">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>{item.likes}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{item.comments}</span>
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>{item.participants}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Heart className="w-4 h-4" />
                                        <span>{item.likes}</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Like/Unlike Button */}
                              <button
                                onClick={() => removeFromLiked(item.id, item.type)}
                                className="ml-4 p-2 rounded-lg transition-colors bg-red-100 text-red-600 hover:bg-red-200"
                                title="Yoqtirganlarimdan olib tashlash"
                              >
                                <Heart className="w-5 h-5 fill-current" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Eventlarim</h3>
                      <Button onClick={() => router.push('/events/create')}>
                        Yangi event
                      </Button>
                    </div>

                    {/* User events */}
                    <div className="space-y-4">
                      {userEvents.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Hali event yaratmadingiz</h3>
                          <p className="text-gray-500 mb-4">Birinchi eventingizni yarating va boshqalar bilan ulashing</p>
                          <Button onClick={() => router.push('/events/create')}>
                            Event yaratish
                          </Button>
                        </div>
                      ) : (
                        userEvents.map((event) => (
                          <div key={event.id} className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <p className="text-sm text-gray-500">{event.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-blue-600"
                                  onClick={() => handleEditEvent(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {event.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{event.participants}/{event.maxParticipants} qatnashuvchi</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <MapPinIcon className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{event.time}</span>
                                </span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                event.price === 'Bepul' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {event.price}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'friends' && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Do'stlaringiz</h3>
                    <p className="text-gray-500 mb-4">156 ta do'stingiz bor</p>
                    <Button>
                      Do'stlarni ko'rish
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">O'chirishni tasdiqlang</h3>
            <p className="text-gray-600 mb-6">
              Bu narsani o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={cancelDeletePost}
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeletePost}
                className="flex-1"
              >
                O'chirish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPost.type === 'post' ? 'Postni tahrirlash' : 
               editingPost.type === 'question' ? 'Savolni tahrirlash' : 
               'Eventni tahrirlash'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sarlavha
                </label>
                <Input
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matn
                </label>
                <Textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  className="w-full min-h-[120px]"
                />
              </div>

              {editingPost.type === 'event' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manzil
                    </label>
                    <Input
                      value={editingPost.location}
                      onChange={(e) => setEditingPost({...editingPost, location: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vaqt
                    </label>
                    <Input
                      value={editingPost.time}
                      onChange={(e) => setEditingPost({...editingPost, time: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Narx
                    </label>
                    <Input
                      value={editingPost.price}
                      onChange={(e) => setEditingPost({...editingPost, price: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={cancelEditPost}
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button 
                onClick={() => {
                  if (editingPost.type === 'post') {
                    handleUpdatePost(editingPost)
                  } else if (editingPost.type === 'question') {
                    handleUpdateQuestion(editingPost)
                  } else {
                    handleUpdateEvent(editingPost)
                  }
                }}
                className="flex-1"
              >
                Saqlash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

