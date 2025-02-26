"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Code2, Zap, Layers, ChevronDown, Github, Terminal, Star, Copy, Check } from "lucide-react"

interface DropdownProps {
  title: string
  items: string[]
}

const Dropdown: React.FC<DropdownProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-white/90 hover:text-white px-4 py-2 rounded-full hover:bg-white/5"
      >
        <span>{title}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-3 w-56 glass rounded-2xl divide-y divide-white/5 shadow-lg">
          <div className="px-1 py-1">
            {items.map((item: string) => (
              <button
                key={item}
                className="group flex w-full items-center rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

interface TestimonialItem {
  quote: string
  author: string
  role: string
}

export default function Home() {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText("npm create-previous-app")
    setCopied(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const features: FeatureItem[] = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Server Components",
      description: "Write components that render on the server for improved performance and SEO.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Updates",
      description: "Fast Refresh enables instant feedback while editing your code.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "File-based Routing",
      description: "Every component in the pages directory becomes a route automatically.",
    },
  ]

  const testimonials: TestimonialItem[] = [
    {
      quote: "Previous.js has revolutionized our development process. It's fast, intuitive, and a joy to work with.",
      author: "Jane Doe",
      role: "Senior Developer at TechCorp",
    },
    {
      quote: "The performance gains we've seen with Previous.js are incredible. Our site loads in milliseconds now.",
      author: "John Smith",
      role: "CTO at StartupX",
    },
    {
      quote: "Previous.js's server components have been a game-changer for our SEO efforts.",
      author: "Emily Johnson",
      role: "Lead Engineer at SEO Experts",
    },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link className="flex items-center space-x-2 text-white" href="/">
              <Terminal className="h-6 w-6" />
              <span className="font-medium text-lg tracking-tight">Previous.js</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Dropdown title="Features" items={["Server Components", "File-based Routing", "Edge Runtime"]} />
              <Link href="#" className="px-4 py-2 text-white/90 hover:text-white rounded-full hover:bg-white/5">
                Documentation
              </Link>
              <Link href="#" className="px-4 py-2 text-white/90 hover:text-white rounded-full hover:bg-white/5">
                Blog
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/previous-js"
                className="p-2 text-white/90 hover:text-white rounded-full hover:bg-white/5"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="hidden md:inline-flex px-4 py-2 text-sm text-white glass rounded-full hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gradient mb-8 leading-tight">
                The Framework for
                <br />
                Building the Web
              </h1>
              <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                Previous.js gives you the best developer experience with all the features you need for production:
                hybrid static & server rendering, smart bundling, and more.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="#"
                  className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-full bg-white font-medium text-black hover:bg-white/90 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-full glass glass-hover font-medium text-white"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 px-4">
            <div className="max-w-3xl mx-auto glass rounded-2xl p-4 font-mono relative">
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-full glass hover:bg-white/10 transition-colors"
                aria-label={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5 text-white/60" />}
              </button>
              <pre className="text-sm md:text-base text-white/90 pt-4">
                <code>npm create-previous-app</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="glass glass-hover rounded-2xl p-6">
                  <div className="mb-4 p-2.5 rounded-full bg-white/5 w-fit">{feature.icon}</div>
                  <h3 className="text-lg font-medium mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-black/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">What Developers Are Saying</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="glass rounded-2xl p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-4">{`"${testimonial.quote}"`}</p>
                  <div>
                    <p className="font-medium text-white">{testimonial.author}</p>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building faster, more efficient web applications with Previous.js.
            </p>
            <Link
              href="#"
              className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-white font-medium text-black hover:bg-white/90 transition-colors"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© {new Date().getFullYear()} Previous.js. MIT License.</p>
            <div className="flex items-center space-x-6">
              {["Documentation", "GitHub", "License"].map((item) => (
                <Link key={item} href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
