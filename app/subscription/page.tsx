"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Star, Shield, Users, Video, Calendar, MessageSquare, Handshake, Building2, TrendingUp, Zap, Award, Globe } from "lucide-react"
import { motion } from "framer-motion"

const subscriptionPlans = [
  {
    id: "one-off",
    name: "One-Off Listing",
    tagline: "Perfect for occasional sellers",
    popular: false,
    pricing: {
      one: { price: 50, originalPrice: 50, discount: 0 },
      two: { price: 45, originalPrice: 50, discount: 10 },
      three: { price: 40, originalPrice: 50, discount: 20 },
      four: { price: 35, originalPrice: 50, discount: 30 },
      five: { price: 30, originalPrice: 50, discount: 40 }
    },
    runtime: "3 months minimum",
    contract: "Minimum 3 months runtime",
    features: [
      { text: "No Commission", included: true },
      { text: "Dashboard listing", included: true },
      { text: "Verified", included: true },
      { text: "10 pictures and one video per listing", included: true },
      { text: "3 months runtime", included: true },
      { text: "Optional access to discussion forum", included: true },
      { text: "Optional local meeting setup with potential buyer", included: true },
      { text: "Due diligence and background check", included: true },
      { text: "Weekly curated demonstration programme (live & scheduled)", included: true },
      { text: "Apply for featured live demonstration (homepage spotlight)", included: true }
    ],
    note: "Can list machines interchangeably when sold (within 3 months)"
  },
  {
    id: "standard",
    name: "Standard Listing",
    tagline: "Ideal for regular sellers",
    popular: true,
    pricing: {
      one: { price: 40, originalPrice: 50, discount: 10 },
      two: { price: 32, originalPrice: 50, discount: 0 },
      three: { price: 28, originalPrice: 50, discount: 0 },
      four: { price: 24, originalPrice: 50, discount: 0 },
      five: { price: 20, originalPrice: 50, discount: 0 }
    },
    runtime: "6 months minimum",
    contract: "12 months subscription required",
    features: [
      { text: "No Commission", included: true },
      { text: "Dashboard listing", included: true },
      { text: "Verified", included: true },
      { text: "10 pictures and one video per listing", included: true },
      { text: "6 months runtime", included: true },
      { text: "Free access to discussion forum", included: true },
      { text: "Optional facilitation of local open house", included: true },
      { text: "Dispute resolution", included: true },
      { text: "Weekly curated demonstration programme (live & scheduled)", included: true },
      { text: "Apply for featured live demonstration (homepage spotlight) - frequency", included: true }
    ],
    note: "Can list machines interchangeably when sold (within subscription period)"
  },
  {
    id: "premium",
    name: "Premium Listing",
    tagline: "For high-volume sellers",
    popular: false,
    pricing: {
      five: { price: 25, total: 125, label: "5 machines", perMonth: true },
      ten: { price: 15, total: 150, label: "10 machines", perMonth: true }
    },
    runtime: "12 months",
    contract: "Minimum 5 listings simultaneously for 12 months",
    features: [
      { text: "No Commission", included: true },
      { text: "Dashboard listing", included: true },
      { text: "Verified", included: true },
      { text: "10 pictures and one video per listing", included: true },
      { text: "6 months runtime", included: true },
      { text: "Free access to discussion forum", included: true },
      { text: "Optional facilitation of local open house", included: true },
      { text: "Dispute resolution", included: true },
      { text: "Weekly curated demonstration programme (live & scheduled)", included: true },
      { text: "Apply for featured live demonstration (homepage spotlight) - frequency", included: true },
      { text: "Access to premium buyers", included: true },
      { text: "Optional sales agency engagement", included: true }
    ],
    note: "Minimum 5 listings simultaneously per month for 12 months"
  },
  {
    id: "sales-agency",
    name: "Sales Agency Listing",
    tagline: "Full-service sales support",
    popular: false,
    pricing: {
      base: { price: 100, label: "Per equipment listing" },
      commission: {
        "0-10k": 20,
        "10k-50k": 15,
        "50k-100k": 12.5,
        "100k-250k": 10,
        "250k-500k": 7.5,
        "500k+": 5
      }
    },
    runtime: "3 months",
    contract: "3 months runtime per listing",
    features: [
      { text: "100 USD Per equipment listing", included: true },
      { text: "Sales Commission Based", included: true },
      { text: "Deployment of on-ground sales force per listing", included: true },
      { text: "Dashboard listing", included: true },
      { text: "Verified", included: true },
      { text: "10 pictures and one video per listing", included: true },
      { text: "6 months runtime", included: true },
      { text: "Free access to discussion forum", included: true },
      { text: "Optional facilitation of local open house", included: true },
      { text: "Dispute resolution", included: true },
      { text: "Weekly curated demonstration programme (live & scheduled)", included: true },
      { text: "Apply for featured live demonstration (homepage spotlight) for premium customers", included: true },
      { text: "Local market engagement", included: true }
    ],
    note: "Commission: 20% ($0-$10k), 15% ($10k-$50k), 12.5% ($50k-$100k), 10% ($100k-$250k), 7.5% ($250k-$500k), 5% ($500k+)"
  }
]

const keySellingPoints = [
  { icon: MessageSquare, text: "Access to discussion forum (optional)" },
  { icon: Video, text: "Curated weekly demonstrations & apply for featured spotlight" },
  { icon: Shield, text: "Verified sellers" },
  { icon: Building2, text: "Due diligence and background checks" },
  { icon: Handshake, text: "Dispute resolution" },
  { icon: Users, text: "Local sales meetings setup with potential buyers" },
  { icon: TrendingUp, text: "Sales support services" },
  { icon: Globe, text: "Facilitation of local open house" },
  { icon: Award, text: "Visa and embassy engagement" },
  { icon: Zap, text: "Dashboard & dealer profile" }
]

export default function SubscriptionPage() {
  const [planQuantities, setPlanQuantities] = useState<Record<string, number>>({
    "one-off": 1,
    "standard": 1,
    "premium": 5,
    "sales-agency": 1
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          <div className="absolute inset-0">
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Background Pattern"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Subscription Plans
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Choose the perfect plan to showcase your machines and connect with buyers in Nigeria's printing market
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-white font-semibold">No Commission</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-semibold">Verified Sellers</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-semibold">Global Reach</span>
                </div>
              </div>
            </motion.div>
            </div>
        </section>

        {/* Pricing Plans - Machineseeker Style */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionPlans.map((plan, index) => {
                const planQuantity = planQuantities[plan.id] || 1
                
                return (
                  <motion.div
                  key={plan.id} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${plan.popular ? 'border-primary shadow-lg' : 'border-gray-200'}`}>
                      {plan.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-semibold">
                        Most Popular
                    </div>
                  )}
                      <CardHeader className={`pb-6 ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                        <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{plan.tagline}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Pricing Display - Machineseeker Style */}
                        {plan.id === "sales-agency" ? (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-primary mb-1">${plan.pricing.base?.price ?? 0}</div>
                              <div className="text-sm text-muted-foreground">{plan.pricing.base?.label ?? ""}</div>
                            </div>
                            <div className="space-y-2 pt-4 border-t">
                              <p className="font-semibold text-sm text-center">Commission Structure:</p>
                              <div className="space-y-1.5 text-xs">
                                {plan.pricing.commission && Object.entries(plan.pricing.commission).map(([range, rate]) => (
                                  <div key={range} className="flex justify-between items-center">
                                    <span className="text-muted-foreground">${range.replace('-', ' - $')}</span>
                                    <Badge variant="outline" className="text-xs">{rate}%</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : plan.id === "premium" ? (
                          <div className="space-y-4">
                            <div className="text-center">
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Listings simultaneously
                              </label>
                              <select
                                value={planQuantity === 5 ? 5 : 10}
                                onChange={(e) => setPlanQuantities({ ...planQuantities, [plan.id]: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-center font-semibold text-lg focus:border-primary focus:outline-none transition-colors"
                              >
                                <option value={5}>5 machines</option>
                                <option value={10}>10 machines</option>
                              </select>
                            </div>
                            {Object.entries(plan.pricing).map(([key, value]: [string, any]) => {
                              const selectedMachines = planQuantity === 5 ? 5 : 10
                              const isSelected = (key === "five" && selectedMachines === 5) || (key === "ten" && selectedMachines === 10)
                              
                              if (isSelected) {
                                return (
                                  <div key={key} className="text-center space-y-2">
                                    <div className="text-4xl font-bold text-primary">${value.total}</div>
                                    <div className="text-sm text-muted-foreground">per month</div>
                                    <div className="text-sm font-medium text-gray-900">{value.label}</div>
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center">
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Listings simultaneously
                              </label>
                              <select
                                value={planQuantity}
                                onChange={(e) => setPlanQuantities({ ...planQuantities, [plan.id]: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-center font-semibold text-lg focus:border-primary focus:outline-none transition-colors"
                              >
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <option key={num} value={num}>{num}</option>
                                ))}
                              </select>
                            </div>
                             {(() => {
                               const quantityMap: Record<string, string> = {
                                 "1": "one",
                                 "2": "two",
                                 "3": "three",
                                 "4": "four",
                                 "5": "five"
                               }
                               const key = quantityMap[planQuantity.toString()]
                               const value = plan.pricing[key as keyof typeof plan.pricing] as any
                               
                               if (value) {
                                 const total = value.price * planQuantity
                                 return (
                                   <div className="text-center space-y-2">
                                     <div className="flex items-baseline justify-center gap-2">
                                       <span className="text-4xl font-bold text-primary">${value.price}</span>
                                       {value.discount > 0 && value.originalPrice && (
                                         <span className="text-lg text-muted-foreground line-through">${value.originalPrice}</span>
                                       )}
                                     </div>
                                     <div className="text-sm text-muted-foreground">per listing / per month</div>
                                     {value.discount > 0 && (
                                       <Badge className="bg-green-500 text-white">
                                         {value.discount}% discount
                                       </Badge>
                                     )}
                                     <div className="pt-3 border-t">
                                       <div className="text-lg font-semibold text-gray-900">
                                         equals ${total} / per month
                                       </div>
                                     </div>
                                   </div>
                                 )
                               }
                               return null
                             })()}
                    </div>
                        )}

                        {/* Features List - Machineseeker Style */}
                        <div className="space-y-3 pt-4 border-t">
                          <ul className="space-y-3">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 leading-relaxed">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                        </div>

                        {plan.note && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 leading-relaxed">
                            <strong>Note:</strong> {plan.note}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0 pb-6">
                    <Button 
                          className={`w-full py-6 text-base font-semibold ${plan.popular ? 'bg-primary hover:bg-primary/90 text-white' : ''}`}
                          variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                          asChild
                    >
                          <Link href="/register">Select plan</Link>
                    </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Key Selling Points */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Key Selling Points</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                All plans include these powerful features to help you succeed
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {keySellingPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <point.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-medium">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Background Pattern"
              fill
              className="object-cover opacity-5"
            />
              </div>
          <div className="container mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Start Selling?
                </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of verified sellers in Nigeria's most trusted printing marketplace
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                >
                  <Link href="/register">Get Started Now</Link>
                </Button>
                <Button 
                  asChild
                  size="lg"
                  variant="outline" 
                  className="border-2 border-white !text-white hover:bg-white/10 hover:!text-white px-8 py-6 text-lg font-semibold"
                >
                  <Link href="/marketplace" className="text-white">View Marketplace</Link>
                </Button>
              </div>
            </motion.div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
