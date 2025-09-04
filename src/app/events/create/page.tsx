'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/Header'

const eventTypes = [
  { id: 'football', name: 'Futbol', icon: '⚽', description: 'Futbol uchrashuvlari va mashg\'ulotlar' },
  { id: 'music', name: 'Musiqiy tadbir', icon: '🎵', description: 'Konsertlar, musiqiy kechalar va ijodiy uchrashuvlar' },
  { id: 'entertainment', name: 'Kongilochar tadbir', icon: '❤️', description: 'Master-klasslar, oshpazlik va boshqa qiziqarli tadbirlar' },
  { id: 'sport', name: 'Sport', icon: '⭐', description: 'Boshqa sport turlari va mashg\'ulotlar' },
  { id: 'culture', name: 'Madaniyat', icon: '⭐', description: 'Madaniy tadbirlar va an\'analar' },
  { id: 'education', name: 'Ta\'lim', icon: '⭐', description: 'O\'quv va ta\'lim tadbirlari' }
]

const categories = [
  { id: 'sport', name: 'Sport' },
  { id: 'culture', name: 'Madaniyat' },
  { id: 'education', name: 'Ta\'lim' },
  { id: 'social', name: 'Ijtimoiy' },
  { id: 'business', name: 'Biznes' },
  { id: 'other', name: 'Boshqa' }
]

const priceTypes = [
  { id: 'free', name: 'Bepul' },
  { id: 'paid', name: 'Pulli' },
  { id: 'donation', name: 'Xayriya' }
]

function CreateEventPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isCreating, setIsCreating] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Edit mode ni tekshirish
  const isEditMode = searchParams.get('edit') === 'true'
  const editId = searchParams.get('id')

  // returnTab ni o'qish
  const returnTab = searchParams.get('returnTab')

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    priceType: 'free',
    price: '',
    tags: [] as string[],
    contactInfo: '',
    additionalInfo: ''
  })

  // Edit mode da ma'lumotlarni to'ldirish
  useEffect(() => {
    if (isEditMode) {
      const editTitle = searchParams.get('title')
      const editDescription = searchParams.get('description')
      const editLocation = searchParams.get('location')
      const editDate = searchParams.get('date')
      const editTime = searchParams.get('time')
      const editCategory = searchParams.get('category')
      const editMaxParticipants = searchParams.get('maxParticipants')
      const editPrice = searchParams.get('price')

      setEventData(prev => ({
        ...prev,
        title: editTitle || prev.title,
        description: editDescription || prev.description,
        location: editLocation || prev.location,
        date: editDate || prev.date,
        time: editTime || prev.time,
        category: editCategory || prev.category,
        maxParticipants: editMaxParticipants || prev.maxParticipants,
        price: editPrice || prev.price
      }))
    }
  }, [isEditMode, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setEventData({
      ...eventData,
      [name]: value
    })
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (!eventData.tags.includes(newTag)) {
        setEventData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }))
      }
      e.currentTarget.value = ''
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEventData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files)
      setUploadedImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleCreateEvent = async () => {
    if (!eventData.title || !eventData.description || !eventData.type || !eventData.date || !eventData.time || !eventData.location) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring')
      return
    }

    setIsCreating(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (isEditMode && editId) {
        // Update existing event
        const existingEvents = JSON.parse(localStorage.getItem('events') || '[]')
        const eventIndex = existingEvents.findIndex((event: any) => event.id === parseInt(editId))
        
        if (eventIndex !== -1) {
          existingEvents[eventIndex] = {
            ...existingEvents[eventIndex],
            title: eventData.title,
            description: eventData.description,
            type: eventData.type,
            category: eventData.category,
            date: eventData.date,
            time: eventData.time,
            location: eventData.location,
            maxParticipants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : null,
            price: eventData.price,
            tags: eventData.tags,
            contactInfo: eventData.contactInfo,
            additionalInfo: eventData.additionalInfo,
            updatedAt: new Date().toISOString()
          }
          localStorage.setItem('events', JSON.stringify(existingEvents))
          alert('Tadbir muvaffaqiyatli yangilandi!')
        } else {
          alert('Tadbir topilmadi!')
          return
        }
      } else {
        // Create new event
        const newEvent = {
          id: Date.now(),
          title: eventData.title,
          description: eventData.description,
          type: eventData.type,
          category: eventData.category,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          maxParticipants: eventData.maxParticipants ? parseInt(eventData.maxParticipants) : null,
          price: eventData.price,
          tags: eventData.tags,
          contactInfo: eventData.contactInfo,
          additionalInfo: eventData.additionalInfo,
          author: 'Current User',
          createdAt: new Date().toISOString(),
          participants: 0,
          likes: 0,
          views: 0,
          isLiked: false,
          isJoined: false
        }
        
        const existingEvents = JSON.parse(localStorage.getItem('events') || '[]')
        existingEvents.push(newEvent)
        localStorage.setItem('events', JSON.stringify(existingEvents))
        
        alert('Tadbir muvaffaqiyatli yaratildi!')
      }
      
      // returnTab bo'lsa profile ga qaytish, yo'q bo'lsa events ga
      if (returnTab) {
        router.push(`/profile?tab=${returnTab}`)
      } else {
        router.push('/events')
      }
    } catch (error) {
      console.error('Error creating/updating event:', error)
      alert('Xatolik yuz berdi!')
    } finally {
      setIsCreating(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsCreating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsCreating(false)
    alert('Draft saqlandi!')
    
    // returnTab bo'lsa profile ga qaytish
    if (returnTab) {
      router.push(`/profile?tab=${returnTab}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="create" isAuth={true} />

      {/* Orqaga link */}
      <motion.div 
        className="bg-gray-50 border-b border-gray-200 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (returnTab) {
                  router.push(`/profile?tab=${returnTab}`)
                } else {
                  router.back()
                }
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </Button>
            <div className="w-px h-4 bg-gray-300" />
            <h1 className="text-lg font-medium text-gray-900">
              {isEditMode ? 'Tadbirni tahrirlash' : 'Yangi tadbir yaratish'}
            </h1>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Event Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tadbir turini tanlang</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelectChange('type', type.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    eventData.type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {type.icon}
                    </div>
                    <span className="font-medium text-gray-900">{type.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Asosiy ma'lumotlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tadbir nomi *
                </label>
                <Input
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="Tadbiringizning nomini kiriting..."
                  className="text-lg"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif *
                </label>
                <Textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  placeholder="Tadbiringiz haqida batafsil ma'lumot..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriya
                </label>
                <Select value={eventData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimal qatnashuvchilar
                </label>
                <Input
                  name="maxParticipants"
                  type="number"
                  value={eventData.maxParticipants}
                  onChange={handleChange}
                  placeholder="50"
                />
              </div>
            </div>
          </motion.div>

          {/* Date, Time & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sana, vaqt va joylashuv</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sana *
                </label>
                <Input
                  name="date"
                  type="date"
                  value={eventData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaqt *
                </label>
                <Input
                  name="time"
                  type="time"
                  value={eventData.time}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joylashuv *
                </label>
                <Input
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  placeholder="Tadbiringiz o\'tkaziladigan joy..."
                />
              </div>
            </div>
          </motion.div>

          {/* Price & Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Narx va teglar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Narx turi
                </label>
                <Select value={eventData.priceType} onValueChange={(value) => handleSelectChange('priceType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {eventData.priceType === 'paid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Narxi
                  </label>
                  <Input
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    placeholder="25€"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teglar
                </label>
                <Input
                  placeholder="Teg qo'shish uchun Enter bosing..."
                  onKeyPress={handleTagInput}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rasmlar</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Tadbir rasmlarini yuklash uchun bosing yoki sürüp tashlang
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={addImage}
                className="flex items-center space-x-2 mx-auto"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Rasm tanlash</span>
              </Button>
            </div>

            {/* Uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Yuklangan rasmlar:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Event ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Qo'shimcha ma'lumotlar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aloqa ma'lumotlari
                </label>
                <Input
                  name="contactInfo"
                  value={eventData.contactInfo}
                  onChange={handleChange}
                  placeholder="Telefon yoki email..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qo'shimcha ma'lumotlar
                </label>
                <Textarea
                  name="additionalInfo"
                  value={eventData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Qo'shimcha ma'lumotlar, talablar yoki eslatmalar..."
                  rows={3}
                />
              </div>
            </div>
          </motion.div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-end"
          >
            <Button
              onClick={handleCreateEvent}
              disabled={isCreating}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (isEditMode ? 'Yangilanmoqda...' : 'Yaratilmoqda...') : (isEditMode ? 'Yangilash' : 'Tadbirni yaratish')}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function CreateEventPage() {
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
        <CreateEventPageContent />
      </Suspense>
    )
  }
  