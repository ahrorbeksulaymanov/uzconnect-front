'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Heart,
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'O\'zbeklar futbol uchrashuvi',
    description: 'Berlin shahrida yashayotgan o\'zbeklar uchun futbol uchrashuvi. Barcha darajadagi o\'yinchilar qatnashishi mumkin.',
    type: 'Futbol',
    typeIcon: '⚽',
    date: '2024-02-15',
    time: '15:00',
    location: 'Berlin, Tempelhof Park',
    organizer: 'Aziza Karimova',
    participants: 24,
    maxParticipants: 30,
    price: 'Bepul',
    category: 'Sport',
    tags: ['Futbol', 'O\'zbeklar', 'Berlin'],
    isJoined: false,
    isFavorite: false
  },
  {
    id: 2,
    title: 'O\'zbek musiqasi kechasi',
    description: 'Gelatiya va an\'anaviy o\'zbek musiqasi bilan o\'tkaziladigan kecha. Qatnashuvchilar o\'z ijodlarini ham namoyish qilishlari mumkin.',
    type: 'Musiqiy tadbir',
    typeIcon: '🎵',
    date: '2024-02-20',
    time: '19:00',
    location: 'Berlin, Kulturhaus Mitte',
    organizer: 'Jasur Toshmatov',
    participants: 45,
    maxParticipants: 60,
    price: '15€',
    category: 'Madaniyat',
    tags: ['Musiqa', 'O\'zbek musiqasi', 'Kechasi'],
    isJoined: true,
    isFavorite: true
  },
  {
    id: 3,
    title: 'O\'zbek taomlari master-klassi',
    description: 'O\'zbek taomlarini tayyorlash bo\'yicha master-klass. Plov, somsa va boshqa an\'anaviy taomlar.',
    type: 'Kongilochar tadbir',
    typeIcon: '❤️',
    date: '2024-02-25',
    time: '14:00',
    location: 'Berlin, Cooking Studio',
    organizer: 'Dilfuza Rahimova',
    participants: 18,
    maxParticipants: 25,
    price: '25€',
    category: 'Ta\'lim',
    tags: ['Oshpazlik', 'O\'zbek taomlari', 'Master-klass'],
    isJoined: false,
    isFavorite: false
  },
  {
    id: 4,
    title: 'IT konferentsiya',
    description: 'Germaniyada ishlayotgan IT mutaxassislari uchun konferentsiya. Yangi texnologiyalar va tajriba almashish.',
    type: 'Konferentsiya',
    typeIcon: '💻',
    date: '2024-03-01',
    time: '10:00',
    location: 'Berlin, Tech Hub',
    organizer: 'Otabek Karimov',
    participants: 67,
    maxParticipants: 100,
    price: 'Bepul',
    category: 'Ta\'lim',
    tags: ['IT', 'Texnologiya', 'Konferentsiya'],
    isJoined: false,
    isFavorite: false
  },
  {
    id: 5,
    title: 'O\'zbeklar uchrashuvi',
    description: 'Berlin da yashayotgan o\'zbeklar uchun oylik uchrashuv. Do\'stlar topish va tajriba almashish.',
    type: 'Ijtimoiy tadbir',
    typeIcon: '🤝',
    date: '2024-03-05',
    time: '18:00',
    location: 'Berlin, Community Center',
    organizer: 'Malika Toshmatova',
    participants: 89,
    maxParticipants: 120,
    price: '5€',
    category: 'Ijtimoiy',
    tags: ['Uchrashuv', 'Do\'stlar', 'Ijtimoiy'],
    isJoined: true,
    isFavorite: false
  }
]

const eventTypes = [
  { id: 'all', name: 'Barchasi', icon: '⭐' },
  { id: 'football', name: 'Futbol', icon: '⚽' },
  { id: 'music', name: 'Musiqiy tadbir', icon: '🎵' },
  { id: 'entertainment', name: 'Kongilochar tadbir', icon: '❤️' },
  { id: 'conference', name: 'Konferentsiya', icon: '💻' },
  { id: 'social', name: 'Ijtimoiy tadbir', icon: '🤝' }
]

const categories = [
  { id: 'all', name: 'Barchasi' },
  { id: 'sport', name: 'Sport' },
  { id: 'culture', name: 'Madaniyat' },
  { id: 'education', name: 'Ta\'lim' },
  { id: 'social', name: 'Ijtimoiy' },
  { id: 'business', name: 'Biznes' }
]

export default function EventsPage() {
  const { isAuth } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [events, setEvents] = useState(mockEvents)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleJoinEvent = (eventId: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        if (event.isJoined) {
          return { ...event, participants: event.participants - 1, isJoined: false }
        } else {
          return { ...event, participants: event.participants + 1, isJoined: true }
        }
      }
      return event
    }))
  }

  const handleFavoriteEvent = (eventId: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return { ...event, isFavorite: !event.isFavorite }
      }
      return event
    }))
  }

  const handleCreateEvent = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, create page ga o'tish
      router.push('/events/create')
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || event.type.toLowerCase().includes(selectedType)
    const matchesCategory = selectedCategory === 'all' || event.category === categories.find(c => c.id === selectedCategory)?.name
    return matchesSearch && matchesType && matchesCategory
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'popular':
        return b.participants - a.participants
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="events" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tadbirlar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            O'zbeklar uchun turli tadbirlar va uchrashuvlar. Qatnashing va yangi do'stlar toping!
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tadbir qidirish..."
                className="pl-10"
              />
            </div>

            {/* Event Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tadbir turi" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategoriya" />
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
                <SelectItem value="date">Sana bo'yicha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Create Event Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-end mb-6"
        >
          <Button onClick={handleCreateEvent} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Yangi tadbir yaratish</span>
          </Button>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Event Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {event.typeIcon}
                    </div>
                    <span className="text-sm font-medium text-blue-600">{event.type}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <Link href={`/events/${event.id}`}>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                    {event.title}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{event.participants}/{event.maxParticipants} qatnashuvchi</span>
                  </div>
                </div>

                {/* Price and Organizer */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-green-600">{event.price}</span>
                  <span className="text-sm text-gray-500">Tashkilotchi: {event.organizer}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleJoinEvent(event.id)}
                      variant={event.isJoined ? "default" : "outline"}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      {event.isJoined ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Qatnashaman</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4" />
                          <span>Qatnashish</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <button
                    onClick={() => handleFavoriteEvent(event.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      event.isFavorite 
                        ? 'bg-red-100 text-red-600' 
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Events Message */}
        {sortedEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tadbirlar topilmadi
            </h3>
            <p className="text-gray-500">
              Qidiruv mezonlariga mos tadbirlar mavjud emas.
            </p>
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ro'yxatdan o'ting
            </h3>
            <p className="text-gray-600 mb-6">
              Tadbir yaratish uchun ro'yxatdan o'ting yoki tizimga kiring.
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