"use client";

import Link from 'next/link'
import { Users, GraduationCap, MapPin, ArrowRight, Star, MessageCircle, ThumbsUp } from 'lucide-react'
import { motion } from "framer-motion";
import Header from '@/components/Header'
import { useAuthStore } from '@/store/authStore'  
export default function Home() {
  const { isAuth } = useAuthStore()
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  

  const fadeInUp = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  }

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Header currentPage="home" />

      {/* Hero Section */}
      <motion.section 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="pt-20 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Chet elda yashayotgan
            <span className="text-blue-600 block">o'zbeklarni birlashtiring</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            UzConnect - bu chet elda yashayotgan, o'qiyotgan va o'qimoqchi bo'lgan
            barcha o'zbeklarni birlashtiruvchi platforma. Do'stlar toping, tajriba almashing va
            kelajagingizni quring.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={isAuth ? "/profile" : "/auth/register"}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Boshlash
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              Ko'proq ma'lumot
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platforma xususiyatlari
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              UzConnect sizga chet elda yashash va o'qish jarayonida yordam beradi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />,
                title: "Hamkorlik",
                description: "Chet elda yashayotgan o'zbeklar bilan bog'laning va tajriba almashing",
                color: "from-blue-50 to-blue-100"
              },
              {
                icon: <GraduationCap className="h-16 w-16 text-purple-600 mx-auto mb-4" />,
                title: "Ta'lim",
                description: "O'qish imkoniyatlari va ta'lim maslahatlarini oling",
                color: "from-purple-50 to-purple-100"
              },
              {
                icon: <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />,
                title: "Joylashuv",
                description: "Yaqin atrofda yashayotgan o'zbeklarni toping",
                color: "from-green-50 to-green-100"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`text-center p-6 rounded-xl bg-gradient-to-br ${feature.color}`}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "10,000+", label: "Faol foydalanuvchilar" },
              { number: "50+", label: "Mamlakatlar" },
              { number: "500+", label: "Universitetlar" },
              { number: "1000+", label: "Muvaffaqiyatli hikoyalar" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

            {/* Testimonials */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Foydalanuvchilarimiz fikri
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "UzConnect orqali Germaniyada o'qish imkoniyatini topdim. Platforma juda foydali!",
                name: "Aziza Karimova",
                location: "Germaniya, Berlin"
              },
              {
                text: "Bu yerda do'stlar topdim va ular orqali AQShda ish topdim.",
                name: "Jasur Toshmatov",
                location: "AQSh, New York"
              },
              {
                text: "UzConnect menga chet elda yashashda juda ko'p yordam berdi.",
                name: "Malika Yusupova",
                location: "Rossiya, Moskva"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.location}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Questions & Answers Section */}
      <motion.div 
        role='section'
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            role='div'
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Savollaringiz bormi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chet elda yashash, o'qish va ishlash haqida savollaringizni bering va boshqalarning tajribalaridan foydalaning
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Savol bering</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Chet el haqida savollaringizni bering va tajribali foydalanuvchilardan javob oling. 
                Har bir savol boshqalarga ham foydali bo'ladi.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Link href="/questions">Savol berish</Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Javob bering</h3>
              </div>
              <p className="text-gray-600 mb-6">
                O'z tajribangizni boshqalar bilan ulashing. Savollarga javob berib, 
                jamiyatga hissa qo'shing va boshqalarga yordam bering.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                <Link href="/questions">Javob berish</Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            className="grid md:grid-cols-4 gap-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { number: "156", label: "Savollar", icon: "❓" },
              { number: "89", label: "Javoblar", icon: "💬" },
              { number: "45", label: "Foydalanuvchilar", icon: "👥" },
              { number: "12", label: "Kategoriyalar", icon: "🏷️" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-xl"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Hozir qo'shiling va hamkorlikni boshlang
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Chet elda yashayotgan o'zbeklar jamiyatiga qo'shiling va yangi imkoniyatlar yarating
          </motion.p>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Bepul ro'yxatdan o'tish
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* Globe icon removed as per new Header */}
                <span className="text-xl font-bold">UzConnect</span>
              </div>
              <p className="text-gray-400">
                Chet elda yashayotgan o'zbeklarni birlashtiruvchi platforma
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Xususiyatlar</Link></li>
                <li><Link href="/questions" className="hover:text-white transition-colors">Savollar</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">Biz haqida</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Kirish</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Yordam</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#contact" className="hover:text-white transition-colors">Aloqa</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Qo'llab-quvvatlash</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ijtimoiy tarmoqlar</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Telegram</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Facebook</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UzConnect. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
