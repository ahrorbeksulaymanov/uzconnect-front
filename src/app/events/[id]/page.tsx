'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  UserX,
  Heart,
  Share2,
  MoreVertical,
  Tag,
  DollarSign,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'

// Mock event data
const mockEvent = {
  id: 1,
  title: 'O\'zbeklar futbol uchrashuvi',
  description: `Berlin shahrida yashayotgan o'zbeklar uchun futbol uchrashuvi. Barcha darajadagi o'yinchilar qatnashishi mumkin.

Bu tadbir orqali:
- Yangi do'stlar toping
- Futbol o'ynang va kuchingizni sinab ko'ring
- O'zbeklar jamoasi bilan vaqt o'tkazing
- Berlin da o'zbeklar jamoasiga qo'shiling

**Qoidalar:**
- Barcha qatnashuvchilar o'zbek tilida gaplashadi
- Adolatli o'yin va do'stona munosabat
- O'z sport anjomlarini olib keling
- Suv va atirgul olib keling

**Qo'shimcha ma'lumot:**
Agar yomg'ir yog'sa, tadbir keyingi haftaga ko'chiriladi.`,
  type: 'Futbol',
  typeIcon: '⚽',
  date: '2024-02-15',
  time: '15:00',
  location: 'Berlin, Tempelhof Park',
  fullAddress: 'Tempelhof Park, 12101 Berlin, Germaniya',
  organizer: 'Aziza Karimova',
  organizerAvatar: 'AK',
  organizerContact: '+49 123 456 7890',
  participants: 24,
  maxParticipants: 30,
  price: 'Bepul',
  category: 'Sport',
  tags: ['Futbol', 'O\'zbeklar', 'Berlin', 'Sport', 'Jamoaviy'],
  isJoined: false,
  isFavorite: false,
  requirements: [
    'Sport anjomlari',
    'Suv',
    'Atirgul',
    'O\'zbek tilida gaplashish'
  ],
  schedule: [
    { time: '14:30', activity: 'Ro\'yxatdan o\'tish va tanishish' },
    { time: '15:00', activity: 'Jamoalarni tashkil etish' },
    { time: '15:15', activity: 'Futbol o\'yini boshlanishi' },
    { time: '16:30', activity: 'Dam olish' },
    { time: '16:45', activity: 'Ikkinchi yarim' },
    { time: '18:00', activity: 'O\'yin yakunlanishi va sovg\'alar' }
  ]
}

// Mock participants data
const mockParticipants = [
  { id: 1, name: 'Jasur Toshmatov', avatar: 'JT', joinedAt: '2 kun oldin' },
  { id: 2, name: 'Dilfuza Rahimova', avatar: 'DR', joinedAt: '1 kun oldin' },
  { id: 3, name: 'Otabek Karimov', avatar: 'OK', joinedAt: '1 kun oldin' },
  { id: 4, name: 'Malika Toshmatova', avatar: 'MT', joinedAt: '12 soat oldin' },
  { id: 5, name: 'Azizbek Qodirov', avatar: 'AQ', joinedAt: '8 soat oldin' }
]

export default function EventDetailPage() {
  const router = useRouter()
  const { isAuth } = useAuthStore()
  const [event, setEvent] = useState(mockEvent)
  const [participants, setParticipants] = useState(mockParticipants)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleJoinEvent = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, join funksiyasini bajarish
      if (event.isJoined) {
        setEvent(prev => ({ 
          ...prev, 
          participants: prev.participants - 1, 
          isJoined: false 
        }))
        setParticipants(prev => prev.slice(1))
      } else {
        setEvent(prev => ({ 
          ...prev, 
          participants: prev.participants + 1, 
          isJoined: true 
        }))
        const newParticipant = {
          id: participants.length + 1,
          name: 'Siz',
          avatar: 'S',
          joinedAt: 'hozir'
        }
        setParticipants(prev => [newParticipant, ...prev])
      }
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleFavoriteEvent = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, favorite funksiyasini bajarish
      setEvent(prev => ({ ...prev, isFavorite: !prev.isFavorite }))
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const handleShareEvent = () => {
    if (isAuth) {
      // Login qilingan bo'lsa, share funksiyasini bajarish
      console.log('Event shared')
      // Bu yerda share API ga so'rov yuborish kerak
    } else {
      // Login qilinmagan bo'lsa, modal ko'rsatish
      setShowAuthModal(true)
    }
  }

  const isEventFull = event.participants >= event.maxParticipants

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="events" />

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

        {/* Event Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          {/* Event Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">{event.typeIcon}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-600">{event.type}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <span>{event.category}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            {/* Event Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{event.date}</p>
                  <p className="text-sm text-gray-500">Sana</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{event.time}</p>
                  <p className="text-sm text-gray-500">Vaqt</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{event.location}</p>
                  <p className="text-sm text-gray-500">Joylashuv</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{event.participants}/{event.maxParticipants}</p>
                  <p className="text-sm text-gray-500">Qatnashuvchilar</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{event.price}</p>
                <p className="text-sm text-gray-500">Narx</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tadbir haqida</h2>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {event.description}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kerakli narsalar</h2>
            <ul className="space-y-2">
              {event.requirements.map((requirement, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Jadval</h2>
            <div className="space-y-3">
              {event.schedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 text-sm font-medium text-blue-600">{item.time}</div>
                  <div className="flex-1 text-gray-700">{item.activity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tashkilotchi</h2>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {event.organizerAvatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{event.organizer}</h3>
                <p className="text-sm text-gray-500">{event.organizerContact}</p>
              </div>
            </div>
          </div>

          {/* Event Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleJoinEvent}
                disabled={isEventFull && !event.isJoined}
                variant={event.isJoined ? "default" : "outline"}
                className="flex items-center space-x-2"
              >
                {event.isJoined ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Qatnashaman</span>
                  </>
                ) : isEventFull ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>To'liq</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Qatnashish</span>
                  </>
                )}
              </Button>

              <button
                onClick={handleFavoriteEvent}
                className={`p-2 rounded-lg transition-colors ${
                  event.isFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>

              <button
                onClick={handleShareEvent}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {event.participants} ta qatnashuvchi
            </div>
          </div>
        </motion.article>

        {/* Participants Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Qatnashuvchilar ({participants.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {participant.avatar}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{participant.name}</h4>
                  <p className="text-sm text-gray-500">{participant.joinedAt}</p>
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
