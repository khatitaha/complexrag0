"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  Lightbulb,
  MessageSquare,
  GraduationCap,
  FileText,
  Volume2,
  Zap,
  ChevronRight,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
  Star,
  Play,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Sparkles,
  Brain,
  Target,
  Clock
} from "lucide-react";

import SectionSeparator from "@/components/SectionSeparator";
import Link from "next/link";

const gradientText = "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400";
const neonBorder = "border border-cyan-500/30 shadow-lg shadow-cyan-500/10";
const neonHover = "hover:shadow-cyan-400/30 hover:border-cyan-400/50";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    boxShadow: "0 20px 40px rgba(0,255,255,0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function LandingPage() {
  const [openAccordion, setOpenAccordion] = useState(null);

  // const toggleAccordion = (index) => {
  //   setOpenAccordion(openAccordion === index ? null : index);
  // };
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Floating Navigation */}
      <motion.nav 
        className="fixed top-4 left-1/4 transform -translate-x-1/2 z-50 bg-gray-900/80 backdrop-blur-md rounded-full px-6 py-3 border border-cyan-500/20 mx-auto"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
            AzamStudying
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          </div>
          <Link href={"/home"}>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-white border-0"
          >
            Get Started
          </Button>
          </Link>
          
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-green-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-cyan-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">Powered by Advanced AI</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          </motion.div>

          <motion.h1
            className={`text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 ${gradientText}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Learn Anything.
            <br />
            <span className="text-white">Master Everything.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform any content into interactive learning experiences with AI-powered roadmaps, 
            smart flashcards, adaptive quizzes, and personal tutors. Study smarter, not harder.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 group"
            >
              <Link href={"/home"}>
              <span className="flex items-center gap-2">
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              </Link>
              
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/20 hover:text-white font-bold px-8 py-4 text-lg rounded-xl backdrop-blur-sm group"
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </span>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>1+ Active Learners</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-green-400" />
              <span>98% Success Rate</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              <span className="ml-1">4.9/5 Rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionSeparator />

      {/* Features Section */}
      <section id="features" className="py-32 px-4 bg-gray-900/50">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-20" variants={{
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
}}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 rounded-full px-4 py-2 border border-cyan-500/20 mb-6">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">AI-Powered Features</span>
            </div>
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${gradientText}`}>
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive suite of AI tools transforms how you learn, making complex subjects accessible and engaging.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Target, 
                title: "Smart Learning Paths", 
                description: "AI creates personalized roadmaps that adapt to your pace and learning style, ensuring optimal progress.",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10"
              },
              { 
                icon: Brain, 
                title: "Intelligent Explanations", 
                description: "Complex concepts broken down into digestible, easy-to-understand explanations with real-world examples.",
                color: "text-green-400",
                bg: "bg-green-500/10"
              },
              { 
                icon: Volume2, 
                title: "Audio Learning", 
                description: "Natural-sounding AI voices read your content aloud, perfect for auditory learners and multitasking.",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              { 
                icon: FileText, 
                title: "Dynamic Slides", 
                description: "Transform static content into engaging, interactive presentations with embedded quizzes and activities.",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              { 
                icon: GraduationCap, 
                title: "Memory Flashcards", 
                description: "Spaced repetition flashcards that adapt to your memory patterns, optimizing long-term retention.",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10"
              },
              { 
                icon: Zap, 
                title: "Adaptive Testing", 
                description: "Smart quizzes that adjust difficulty based on your performance, focusing on areas that need work.",
                color: "text-red-400",
                bg: "bg-red-500/10"
              },
              { 
                icon: MessageSquare, 
                title: "AI Tutoring", 
                description: "24/7 AI tutors with different personalities and teaching styles, ready to help whenever you need.",
                color: "text-indigo-400",
                bg: "bg-indigo-500/10"
              },
              { 
                icon: Clock, 
                title: "Progress Tracking", 
                description: "Detailed analytics and insights into your learning progress with actionable recommendations.",
                color: "text-pink-400",
                bg: "bg-pink-500/10"
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={{
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
}}
                initial="rest"
                whileHover="hover"
              >
                <motion.div variants={{
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    boxShadow: "0 20px 40px rgba(0,255,255,0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
}}>
                  <Card className={`bg-gray-800/50 backdrop-blur-sm text-white p-8 rounded-2xl ${neonBorder} ${neonHover} transition-all duration-300 h-full group`}>
                    <CardHeader className="pb-6">
                      <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-2xl font-bold mb-3">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <SectionSeparator />

      {/* How It Works */}
     <section id="how-it-works" className="py-32 px-4 bg-gray-950">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-20" variants={{
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
}}>
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${gradientText}`}>
              Simple. Powerful. Effective.
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started in minutes and transform your learning experience with our intuitive AI-powered platform.
            </p>
          </motion.div>

          <div className="space-y-24">
            {[
              { 
                step: "01", 
                title: "Upload & Connect", 
                description: "Simply upload your documents, paste links, or connect your learning materials. Our AI processes everything instantly, supporting PDFs, videos, articles, and more.", 
                icon: FileText,
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center"
              },
              { 
                step: "02", 
                title: "AI Magic Happens", 
                description: "Our advanced AI analyzes your content and automatically generates personalized learning materials - roadmaps, flashcards, quizzes, and detailed explanations.", 
                icon: Sparkles,
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center"
              },
              { 
                step: "03", 
                title: "Learn & Master", 
                description: "Engage with interactive content, practice with adaptive quizzes, chat with AI tutors, and track your progress as you master any subject efficiently.", 
                icon: Award,
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                variants={{
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
}}
              >
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                    <div className="text-6xl font-bold text-cyan-400/20">{item.step}</div>
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-2xl flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-white">{item.title}</h3>
                  <p className="text-xl text-gray-300 leading-relaxed">{item.description}</p>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-3xl blur-xl"></div>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="relative rounded-3xl shadow-2xl border border-cyan-500/20"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      <SectionSeparator />

      {/* Pricing */}
      <section id="pricing" className="py-32 px-4 bg-gray-900/50">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-20" variants={{
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
}}>
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${gradientText}`}>
              Choose Your Learning Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
             " pricing does not work yet so dont worry about it just use the free plan "
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                tier: "Starter",
                price: "Free",
                period: "Forever",
                description: "Perfect for trying out our platform",
                features: [
                  "5 document uploads/month",
                  "Basic AI features",
                  "Community support",
                  "Limited flashcards"
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                tier: "Pro",
                price: "$19",
                period: "/month",
                description: "Everything you need to excel",
                features: [
                  "Unlimited uploads",
                  "All AI features",
                  "Priority support",
                  "Advanced analytics",
                  "Custom AI tutors",
                  "Collaborative tools"
                ],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                tier: "Team",
                price: "$49",
                period: "/month",
                description: "For teams and organizations",
                features: [
                  "Everything in Pro",
                  "Team management",
                  "Advanced security",
                  "API access",
                  "Custom integrations",
                  "Dedicated support"
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                variants={{
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
}}
                initial="rest"
                whileHover="hover"
              >
                <motion.div variants={{
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    boxShadow: "0 20px 40px rgba(0,255,255,0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
}}>
                  <Card className={`relative bg-gray-800/50 backdrop-blur-sm text-white p-8 rounded-3xl ${neonBorder} ${neonHover} transition-all duration-300 h-full ${plan.popular ? 'ring-2 ring-cyan-500/50' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                          Most Popular
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-8">
                      <CardTitle className="text-2xl font-bold mb-2">{plan.tier}</CardTitle>
                      <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                      <div className="flex items-end gap-1 mb-4">
                        <span className={`text-5xl font-bold ${gradientText}`}>{plan.price}</span>
                        {plan.period && (
                          <span className="text-gray-400 mb-2">{plan.period}</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-300">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href={"/home"}>
                      <Button
                        className={`w-full font-bold py-3 rounded-xl text-lg transition-all duration-300 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                      </Link>
                      
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <SectionSeparator />

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-green-900/20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeInOut" } 
  },
}}
        >
          <h2 className={`text-4xl md:text-6xl font-bold mb-8 ${gradientText}`}>
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of learners who have already revolutionized their study habits with AI-powered tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            <Link href={"/home"}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-white font-bold px-12 py-4 text-xl rounded-xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300"
            >
              Start Learning Today
            </Button>
            </Link>
            
            <p className="text-sm text-gray-400">No credit card required • 14-day free trial</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-16 px-4 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className={`text-2xl font-bold ${gradientText}`}>AzamStudying</h3>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing education with AI-powered learning tools that adapt to every student's unique needs.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="/integrations" className="hover:text-cyan-400 transition-colors">Integrations</a></li>
                <li><a href="/api" className="hover:text-cyan-400 transition-colors">API</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="/blog" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="/careers" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="/docs" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} by the way its called azam as in like "as im" studying, get it ? </p>
          </div>
        </div>
      </footer>
    </div>
  );
}