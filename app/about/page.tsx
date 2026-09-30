"use client"

import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { motion, useScroll, useTransform } from "framer-motion"
import { CheckCircle2, Users, Globe2, Award, Printer, BookOpen, Building2, Scale, Briefcase, ShieldCheck, Handshake, GraduationCap, Plane, Car, CreditCard, Building, FileCheck, FileText, ArrowRight, Star, TrendingUp, Zap, Target, Shield, Users2, Globe, BarChart3, Lightbulb, Rocket, Crown, CheckSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useRef } from "react"

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const coreServices = [
    {
      icon: <Globe2 className="h-10 w-10" />,
      title: "Global Market Access",
      subtitle: "Worldwide Connectivity",
      description: "Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Connecting Nigeria's printing industry to the world, and the world to Nigeria's vibrant printing market.",
      features: [
        "Access to thousands of verified printing companies",
        "Product advertisement opportunities"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      icon: <Briefcase className="h-10 w-10" />,
      title: "Business Support Services",
      subtitle: "Comprehensive Solutions",
      description: "Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Providing tailored support for businesses looking to navigate Nigeria's printing industry.",
      features: [
        "Licensing and permit facilitation",
        "Due diligence and background checks",
        "Business advisory and training"
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Community Engagement",
      subtitle: "Network & Collaborate",
      description: "Fostering meaningful connections between Nigerian printers and industry stakeholders.",
      features: [
        "Interactive discussion forums",
        "Virtual meeting engagements",
        "Knowledge sharing and collaboration"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ]

  const marketplaceActivities = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Printing Companies",
      description: "Thousands of printing companies across Nigeria, categorized for easy search and connection."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Product Advertisement",
      description: "Reach premium and niche printers with targeted ads for printing equipment and services."
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Training & Consultancy",
      description: "Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Opportunities for professional growth and expert guidance in Nigeria's printing industry."
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Background Checks",
      description: "Due diligence on prospective companies to ensure trustworthy partnerships."
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Dispute Resolution",
      description: "Access to a tribunal established by Act 24 of 2007 for efficient conflict resolution."
    }
  ]

  const nigerianMarketHighlights = [
    {
      icon: <Users2 className="h-8 w-8" />,
      title: "Largest Population in Africa",
      description: "Over 200 million people",
      stat: "200M+"
    },
    {
      icon: <Printer className="h-8 w-8" />,
      title: "Thriving Printing Industry",
      description: "Tens of thousands of printing companies",
      stat: "10K+"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Printing Hub",
      description: "Shomolu - largest concentration of printers worldwide",
      stat: "#1"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Massive Paper Demand",
      description: "Over 3.5 million metric tons imported annually",
      stat: "3.5M"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Book Production Market",
      description: "Over 2 billion books printed annually",
      stat: "2B+"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growing Packaging Industry",
      description: "New opportunities in packaging market expansion",
      stat: "↑"
    }
  ]

  const additionalServices = [
    {
      category: "Travel & Logistics",
      icon: <Plane className="h-8 w-8" />,
      services: [
        { title: "Travels and Tours", description: "Arranging travel plans for business trips" },
        { title: "Hotels & Car Rentals", description: "Booking accommodations and transportation" },
        { title: "Local Meeting Setup", description: "Organizing meetings with potential buyers" }
      ]
    },
    {
      category: "Business Facilitation", 
      icon: <Handshake className="h-8 w-8" />,
      services: [
        { title: "Visa & Embassy Engagement", description: "Assisting with visa applications and embassy procedures" },
        { title: "Import/Export Facilitation", description: "Streamlining trade processes for printing goods" },
        { title: "Government Agency Bridge", description: "Liaising with government bodies to ease operations" }
      ]
    },
    {
      category: "Training & Advisory",
      icon: <Lightbulb className="h-8 w-8" />,
      services: [
        { title: "Executive Training Packages", description: "Offering professional development programs" },
        { title: "Financial Advisory", description: "Providing expert financial guidance" }
      ]
    }
  ]

  return (
    <div className="flex min-h-screen flex-col" ref={containerRef}>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section with Parallax */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          <div className="absolute inset-0">
            <motion.div style={{ y }}>
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Background Pattern"
              fill
              className="object-cover opacity-5"
            />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-8 text-center"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl/none text-white leading-tight">
                  About PrintMarket NG
                </h1>
                <div className="h-2 w-32 bg-gradient-to-r from-[#e94560] to-[#ff9017] mx-auto mt-6 rounded-full"></div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-[900px] text-white/95 md:text-2xl/relaxed font-medium"
              >
                The Nigerian Printing and Graphics communications Market hub (PrintMarket NG) is a platform where buyers and sellers connect to conduct seamless, mutually accountable transactions, adhering to international business laws and regulations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-semibold">Trusted Platform</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-semibold">Global Reach</span>
              </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Market Integrity & USP Section with Creative Layout */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16"
              >
                {/* Market Integrity */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight">MARKET INTEGRITY</h2>
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto lg:mx-0 mb-8"></div>
                  </div>
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        PrintMarket NG operates under the esteemed governance of the Chartered Institute of Professional Printers of Nigeria (CIPPON), established by Act No. 24 of 2007, ensuring the highest standards of integrity, professionalism, and regulatory compliance.
                      </p>
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-500 rounded-full">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-blue-700 mb-2">
                              PrintMarket NG is proudly licensed and affiliated with CIPPON
                            </p>
                            <p className="text-gray-600">
                              This partnership guarantees a secure, trustworthy, and professional marketplace for buyers and sellers in Nigeria's printing and graphic communications sector.
              </p>
            </div>
          </div>
                      </div>
                    </div>
          </div>
                </motion.div>

                {/* USP */}
              <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight">OUR UNIQUE SELLING POINT</h2>
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto lg:mx-0 mb-8"></div>
                  </div>
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-16 -translate-x-16"></div>
                    <div className="relative z-10">
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        PrintMarket NG's USP lies in its unwavering commitment to integrity, governed by the Printers Act and backed by a robust dispute resolution tribunal.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-gray-700">Trustworthy and secure platform</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-gray-700">Governed by Printers Act</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-gray-700">Robust dispute resolution</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Services Section with Advanced Cards */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto text-center mb-20"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-full">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Our Core Services</h2>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                PrintMarket NG offers a comprehensive suite of services across three key dimensions:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <CardContent className="pt-10 pb-10 relative z-10">
                      <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div 
                          className={`p-6 bg-gradient-to-br ${service.color} rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                          whileHover={{ rotate: 5 }}
                        >
                          <div className="text-white">
                            {service.icon}
                          </div>
                        </motion.div>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{service.subtitle}</p>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{service.description}</p>
                          <ul className="space-y-3 text-sm text-gray-600">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-3">
                                <div className={`p-1 bg-gradient-to-r ${service.color} rounded-full`}>
                                  <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketplace Activities with Creative Grid */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Marketplace Activities</h2>
              </div>
              <p className="text-xl text-gray-600">
                PrintMarket NG offers a range of activities to facilitate seamless business operations:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg text-left border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                          <div className="text-white">
                            {activity.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nigeria Market Opportunity with Stats */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Nigeria: Africa's Printing Powerhouse</h2>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-3xl mb-8">
                <p className="text-2xl font-bold mb-2">
                  "You are only a click away from the economy in Africa"
                </p>
                <p className="text-lg opacity-90">
                  Discover one of Africa's largest economies, Nigeria, with a click. Navigate the thriving printing market with PrintMarket NG and tap into its vast potential.
              </p>
            </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nigerianMarketHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="pt-8 pb-8 relative z-10">
                      <div className="flex flex-col items-center text-center space-y-6">
                        <motion.div 
                          className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg"
                          whileHover={{ rotate: 5 }}
                        >
                          <div className="text-white">
                            {highlight.icon}
                          </div>
                        </motion.div>
                        <div className="space-y-4">
                          <div className="text-3xl font-bold text-orange-600">{highlight.stat}</div>
                          <h3 className="text-xl font-bold">{highlight.title}</h3>
                          <p className="text-gray-600">{highlight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services with Category Cards */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Additional Support Services</h2>
              </div>
              <p className="text-xl text-gray-600">
                Comprehensive supporting services to ensure a smooth business experience in Nigeria.
              </p>
            </motion.div>

            <div className="space-y-12">
              {additionalServices.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                        <div className="text-white">
                          {category.icon}
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-purple-600">{category.category}</h3>
                    </div>
                    <div className={`grid grid-cols-1 gap-6 ${category.services.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
                      {category.services.map((service, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white p-6 rounded-2xl shadow-lg text-left border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                          <h4 className="text-lg font-bold text-purple-600 mb-3">{service.title}</h4>
                          <p className="text-gray-600">{service.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CIPPON Gateway Section with Premium Design */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden border border-gray-100">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-32 -translate-x-32"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full translate-y-32 translate-x-32"></div>
                <div className="relative z-10">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-4 mb-6">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold tracking-tight">The Gateway: CIPPON</h2>
                    </div>
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto"></div>
                  </div>
                  <div className="space-y-8 text-gray-600">
                    <p className="text-xl leading-relaxed text-center max-w-4xl mx-auto">
                      The Chartered Institute of Professional Printers of Nigeria (CIPPON), established by Act No. 24 of 2007, serves as the regulatory body for the printing industry in Nigeria. As the custodian of the printing industry, CIPPON:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ul className="space-y-4 text-lg leading-relaxed">
                        <li className="flex items-start gap-4">
                          <div className="p-2 bg-blue-500 rounded-full mt-1">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          <span>Controls, manages, and regulates printing and related activities</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="p-2 bg-blue-500 rounded-full mt-1">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          <span>Maintains a database of genuine printers</span>
                        </li>
                      </ul>
                      <ul className="space-y-4 text-lg leading-relaxed">
                        <li className="flex items-start gap-4">
                          <div className="p-2 bg-blue-500 rounded-full mt-1">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          <span>Ensures accountability among buyers and sellers</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="p-2 bg-blue-500 rounded-full mt-1">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          <span>Standardizes printing and allied businesses</span>
                        </li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4">Registration Requirements</h3>
                  <p className="text-lg leading-relaxed">
                          The Printers Act mandates registration with CIPPON for anyone engaging in printing or related services in Nigeria. Without registration, it is illegal to practice or earn income from these activities.
                  </p>
                      </div>
                      <div className="p-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                        <h3 className="text-2xl font-bold text-orange-700 mb-4">PrintMarket NG: Part of CIPPON's Collaboration Initiative</h3>
                  <p className="text-lg leading-relaxed">
                          PrintMarket NG is your trusted gateway to Nigeria's Printing and Graphics Communications Market. We are a proud collaborative partnership with CIPPON aimed at opening up the Nigerian printing industry to the world, promoting ease of doing business, and ensuring compliance with the law.
                  </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Advanced CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full"></div>
            </div>
          </div>
          <div className="container relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto text-center"
            >
              <div className="space-y-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-5xl font-bold tracking-tight text-white">
                    Ready to Connect with Nigeria's Printing and Graphics Communications Market?
                  </h2>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-2xl text-white/90 max-w-3xl mx-auto"
                >
                  Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Join thousands of verified buyers and sellers in Nigeria's most trusted printing marketplace.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                  <Button 
                    asChild
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100 px-10 py-4 font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/register" className="flex items-center gap-3">
                      Get Started <ArrowRight className="h-6 w-6" />
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 px-10 py-4 font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/marketplace" className="flex items-center gap-3">
                      Explore Marketplace <Globe className="h-6 w-6" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 