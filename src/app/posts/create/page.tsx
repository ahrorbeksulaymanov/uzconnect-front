'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Image as ImageIcon,
    Link as LinkIcon,
    Save,
    X,
    Upload,
    FileImage,
    ArrowLeft,
    Globe,
    Settings,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/Header'

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

const categories = [
    { id: 'study', name: 'O\'qish va ta\'lim' },
    { id: 'work', name: 'Ish va martaba' },
    { id: 'life', name: 'Hayot va tajriba' },
    { id: 'culture', name: 'Madaniyat va an\'analar' },
    { id: 'travel', name: 'Sayohat va joylar' },
    { id: 'tips', name: 'Maslahat va foydali ma\'lumotlar' },
    { id: 'other', name: 'Boshqa' }
]

const tags = [
    'O\'zbekiston', 'Chet el', 'O\'qish', 'Ish', 'Hayot', 'Madaniyat', 'Sayohat', 'Maslahat'
]

function CreatePostContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [summary, setSummary] = useState('')
    const [isPublishing, setIsPublishing] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imageMapping, setImageMapping] = useState<Map<string, number>>(new Map()) // src -> index mapping
    const fileInputRef = useRef<HTMLInputElement>(null)

    // returnTab ni o'qish
    const returnTab = searchParams.get('returnTab')
    
    // Edit mode ni tekshirish
    const isEditMode = searchParams.get('edit') === 'true'
    const editId = searchParams.get('id')

    // TipTap editor
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            BulletList.configure({
                keepMarks: true,
                keepAttributes: false,
            }),
            OrderedList.configure({
                keepMarks: true,
                keepAttributes: false,
            }),
            ListItem,
            Image,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer'
                }
            }),
            Placeholder.configure({
                placeholder: 'Postingizni yozing...',
                emptyEditorClass: 'is-editor-empty'
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Underline,
            Color,
            Highlight
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4'
            }
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // Check if any images were removed from editor
            let imageCount = 0
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'image') {
                    imageCount++
                }
            })

            if (imageCount < uploadedImages.length) {
                // An image was removed from editor, update uploadedImages
                setUploadedImages(prev => prev.slice(0, imageCount))
            }
        }
    })

    // Edit mode da ma'lumotlarni to'ldirish
    useEffect(() => {
        if (isEditMode && editor) {
            const editTitle = searchParams.get('title')
            const editCategory = searchParams.get('category')
            const editContent = searchParams.get('content')
            const editTags = searchParams.get('tags')
            const editSummary = searchParams.get('summary')

            if (editTitle) setTitle(editTitle)
            if (editCategory) setCategory(editCategory)
            if (editContent) editor.commands.setContent(editContent)
            if (editTags) setSelectedTags(editTags.split(',').filter(tag => tag.trim()))
            if (editSummary) setSummary(editSummary)
        }
    }, [isEditMode, editor, searchParams])

    const addImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const newImages = Array.from(files)
            const startIndex = uploadedImages.length

            // Clear the input value to allow selecting the same files again
            event.target.value = ''

            setUploadedImages(prev => [...prev, ...newImages])

            // Add images to editor - each image as a separate node
            newImages.forEach((file, index) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result && editor) {
                        const imageSrc = e.target.result as string
                        const imageIndex = startIndex + index

                        // Store mapping between image src and file index
                        setImageMapping(prev => new Map(prev).set(imageSrc, imageIndex))

                        // Insert image at the end of the document to avoid cursor position issues
                        editor.chain().focus().insertContentAt(editor.state.doc.content.size, {
                            type: 'image',
                            attrs: {
                                src: imageSrc,
                                alt: file.name,
                                title: file.name
                            }
                        }).run()
                    }
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeImage = (index: number) => {
        const removedFile = uploadedImages[index]

        // Remove from uploadedImages array
        setUploadedImages(prev => prev.filter((_, i) => i !== index))

        // Update image mapping - shift indices for files after the removed one
        setImageMapping(prev => {
            const newMap = new Map()
            prev.forEach((fileIndex, imageSrc) => {
                if (fileIndex < index) {
                    newMap.set(imageSrc, fileIndex)
                } else if (fileIndex > index) {
                    newMap.set(imageSrc, fileIndex - 1)
                }
                // Skip the removed file (fileIndex === index)
            })
            return newMap
        })

        // Remove corresponding image from editor
        if (editor && removedFile) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    const imageSrc = e.target.result as string
                    const { state } = editor
                    const { tr } = state

                    // Find and remove the specific image by src
                    state.doc.descendants((node, pos) => {
                        if (node.type.name === 'image' && node.attrs.src === imageSrc) {
                            tr.delete(pos, pos + node.nodeSize)
                            return false // Stop traversing
                        }
                    })

                    editor.view.dispatch(tr)
                }
            }
            reader.readAsDataURL(removedFile)
        }
    }

    // Remove image from editor when it's deleted from editor
    const removeImageFromEditor = (imageSrc: string) => {
        if (editor) {
            const { state } = editor
            const { tr } = state

            // Find and remove the specific image by src
            state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.src === imageSrc) {
                    tr.delete(pos, pos + node.nodeSize)
                    return false // Stop traversing
                }
            })

            editor.view.dispatch(tr)

            // Also remove from uploadedImages array using the mapping
            const fileIndex = imageMapping.get(imageSrc)
            if (fileIndex !== undefined) {
                setUploadedImages(prev => prev.filter((_, i) => i !== fileIndex))

                // Update image mapping - shift indices for files after the removed one
                setImageMapping(prev => {
                    const newMap = new Map()
                    prev.forEach((index, src) => {
                        if (index < fileIndex) {
                            newMap.set(src, index)
                        } else if (index > fileIndex) {
                            newMap.set(src, index - 1)
                        }
                        // Skip the removed file (index === fileIndex)
                    })
                    return newMap
                })
            }
        }
    }

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    const handlePublish = async () => {
        if (!title.trim()) {
            alert('Sarlavha kiritish majburiy!')
            return
        }

        if (!category) {
            alert('Kategoriya tanlash majburiy!')
            return
        }

        if (!editor?.getHTML() || editor.getHTML() === '<p></p>') {
            alert('Post mazmuni kiritish majburiy!')
            return
        }

        setIsPublishing(true)

        try {
            // Simulate API call for publishing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Get editor content
            const content = editor?.getHTML() || ''

            if (isEditMode && editId) {
                // Update existing post
                const existingPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]')
                const postIndex = existingPosts.findIndex((post: any) => post.id === parseInt(editId))
                
                if (postIndex !== -1) {
                    existingPosts[postIndex] = {
                        ...existingPosts[postIndex],
                        title,
                        category,
                        content,
                        tags: selectedTags,
                        summary,
                        images: uploadedImages,
                        updatedAt: new Date().toISOString()
                    }
                    localStorage.setItem('publishedPosts', JSON.stringify(existingPosts))
                    alert('Post muvaffaqiyatli yangilandi!')
                } else {
                    alert('Post topilmadi!')
                    return
                }
            } else {
                // Create new post
                const publishedPost = {
                    id: Date.now(), // Simple ID generation
                    title,
                    category,
                    content,
                    tags: selectedTags,
                    summary,
                    images: uploadedImages,
                    status: 'published',
                    publishedAt: new Date().toISOString(),
                    author: 'Current User', // In real app, get from auth
                    likes: 0,
                    comments: 0,
                    views: 0
                }

                // Save to localStorage (in real app, this would be API call)
                const existingPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]')
                existingPosts.push(publishedPost)
                localStorage.setItem('publishedPosts', JSON.stringify(existingPosts))

                alert('Post muvaffaqiyatli nashr qilindi!')
            }

            // returnTab bo'lsa profile ga qaytish, yo'q bo'lsa posts ga
            if (returnTab) {
                router.push(`/profile?tab=${returnTab}`)
            } else {
                router.push('/posts')
            }
        } catch (error) {
            console.error('Post nashr qilishda xato:', error)
            alert('Post nashr qilishda xato yuz berdi!')
        } finally {
            setIsPublishing(false)
        }
    }

    const handleSaveDraft = async () => {
        if (!title.trim()) {
            alert('Sarlavha kiritish majburiy!')
            return
        }

        setIsPublishing(true)

        try {
            // Simulate API call for saving draft
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Get editor content
            const content = editor?.getHTML() || ''

            // Create draft object
            const draft = {
                title,
                category,
                content,
                tags: selectedTags,
                summary,
                images: uploadedImages,
                status: 'draft',
                createdAt: new Date().toISOString()
            }

            // Save to localStorage (in real app, this would be API call)
            const existingDrafts = JSON.parse(localStorage.getItem('postDrafts') || '[]')
            existingDrafts.push(draft)
            localStorage.setItem('postDrafts', JSON.stringify(existingDrafts))

            alert('Draft muvaffaqiyatli saqlandi!')

            // returnTab bo'lsa profile ga qaytish
            if (returnTab) {
                router.push(`/profile?tab=${returnTab}`)
            }
        } catch (error) {
            console.error('Draft saqlashda xato:', error)
            alert('Draft saqlashda xato yuz berdi!')
        } finally {
            setIsPublishing(false)
        }
    }

    if (!editor) {
        return null
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
                            {isEditMode ? 'Postni tahrirlash' : 'Yangi post yozish'}
                        </h1>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sarlavha *
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Postingizning sarlavhasini kiriting..."
                                className="text-lg"
                            />
                        </motion.div>

                        {/* Category */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategoriya *
                            </label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategoriyani tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </motion.div>

                        {/* Tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teglar
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag)
                                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                                            : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Qisqacha ma'lumot
                            </label>
                            <Textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Postingiz haqida qisqacha ma'lumot..."
                                rows={3}
                            />
                        </motion.div>

                        {/* Editor Toolbar */}
                        <motion.div
                            className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="border-b border-gray-200 p-3 bg-gray-50">
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Text formatting */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => editor?.chain().focus().toggleBold().run()}
                                        className={editor?.isActive('bold') ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <Bold className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                                        className={editor?.isActive('italic') ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <Italic className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                        className={editor?.isActive('underline') ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <UnderlineIcon className="w-4 h-4" />
                                    </Button>

                                    <div className="w-px h-6 bg-gray-300 mx-2" />

                                    {/* Lists */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            console.log('Bullet list clicked')
                                            console.log('Editor state:', editor?.state)
                                            console.log('Available commands:', editor?.commands)
                                            editor?.chain().focus().toggleBulletList().run()
                                        }}
                                        className={editor?.isActive('bulletList') ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            console.log('Ordered list clicked')
                                            console.log('Editor state:', editor?.state)
                                            console.log('Available commands:', editor?.commands)
                                            editor?.chain().focus().toggleOrderedList().run()
                                        }}
                                        className={editor?.isActive('orderedList') ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <ListOrdered className="w-4 h-4" />
                                    </Button>

                                    <div className="w-px h-6 bg-gray-300 mx-2" />

                                    {/* Alignment */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                                        className={editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <AlignLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                                        className={editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <AlignCenter className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                                        className={editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <AlignRight className="w-4 h-4" />
                                    </Button>

                                    <div className="w-px h-6 bg-gray-300 mx-2" />

                                    {/* Media */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addImage}
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const url = window.prompt('URL kiriting:')
                                            if (url) {
                                                editor?.chain().focus().setLink({ href: url }).run()
                                            }
                                        }}
                                        className={editor?.isActive('link') ? 'bg-blue-100 border-blue-300' : ''}
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Editor Content */}
                            <EditorContent
                                editor={editor}
                                className="min-h-[400px] p-4 text-gray-900 [&_.ProseMirror]:text-gray-900 [&_.ProseMirror_p]:text-gray-900 [&_.ProseMirror_h1]:text-gray-900 [&_.ProseMirror_h2]:text-gray-900 [&_.ProseMirror_h3]:text-gray-900 [&_.ProseMirror_li]:text-gray-900 [&_.ProseMirror_ul]:text-gray-900 [&_.ProseMirror_ol]:text-gray-900"
                            />
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
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Image Upload */}

                        {/* Action Button - Above images */}
                        <motion.div
                            className="bg-white p-6 rounded-lg border-2 border-gray-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="text-center">
                                <Button
                                    onClick={handlePublish}
                                    disabled={isPublishing || !title.trim()}
                                    className="px-8 py-3"
                                >
                                    {isPublishing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                            Nashr qilinmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-3" />
                                            {isEditMode ? 'Yangilash' : 'Nashr qilish'}
                                        </>
                                    )}
                                </Button>
                                <p className="text-sm text-gray-500 mt-3">
                                    {isEditMode ? '"Yangilash" - o\'zgarishlarni saqlaydi' : '"Nashr qilish" - darhol nashr qiladi'}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white p-6 rounded-lg border-2 border-gray-200"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Rasmlar</h3>

                            {/* Upload area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Rasm yuklash uchun bosing yoki sürüp tashlang
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addImage}
                                    className="flex items-center space-x-2 mx-auto"
                                >
                                    <FileImage className="w-4 h-4" />
                                    <span>Rasm tanlash</span>
                                </Button>
                            </div>

                            {/* Uploaded images */}
                            {uploadedImages.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    <h4 className="text-sm font-medium text-gray-700">Yuklangan rasmlar:</h4>
                                    {uploadedImages.map((file, index) => (
                                        <div key={`${file.name}-${file.size}-${index}`} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeImage(index)}
                                                className="p-1 h-8 w-8"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Post Preview */}
                        <motion.div
                            className="bg-white p-6 rounded-lg border-2 border-gray-200"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Post ko'rinishi</h3>

                            {title && (
                                <div className="mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Sarlavha:</h4>
                                    <p className="text-sm text-gray-900">{title}</p>
                                </div>
                            )}

                            {category && (
                                <div className="mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Kategoriya:</h4>
                                    <p className="text-sm text-gray-900">
                                        {categories.find(c => c.id === category)?.name}
                                    </p>
                                </div>
                            )}

                            {selectedTags.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Teglar:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedTags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {summary && (
                                <div className="mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Qisqacha:</h4>
                                    <p className="text-sm text-gray-900">{summary}</p>
                                </div>
                            )}

                            {uploadedImages.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Rasmlar:</h4>
                                    <p className="text-sm text-gray-500">{uploadedImages.length} ta rasm</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function CreatePost() {
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
        <CreatePostContent />
      </Suspense>
    )
  }
  
