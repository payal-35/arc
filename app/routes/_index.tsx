import { useState, useEffect, useRef } from "react"
import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"

import { ModeToggle } from "~/components/mode-toggle"

import { ARCLogo } from "~/components/arc-logo"

import {
  CheckCircle2,
  Shield,
  FileText,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Globe,
  Building2,
  Database,
  UserCog,
  FileCheck,
  User,
} from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import { AnimatedShield } from "~/components/animated-shield"
import { AnimatedConsent } from "~/components/animated-consent"
import { AnimatedChart } from "~/components/animated-chart"
import { AnimatedFeature } from "~/components/animated-feature"
import  AnimatedProcess  from "~/components/animated-process"
import { LanguageSelector } from "~/components/LanguageSelector";
import { motion } from "framer-motion"

export default function Index() {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})

  // Intersection Observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -100px 0px", threshold: 0.1 },
    )

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      Object.values(sectionsRef.current).forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  // Register section refs
  const registerSection = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionsRef.current[id] = ref
    }
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
   <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ARCLogo />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {["features", "how-it-works", "compliance", "pricing", "faq"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`text-sm font-medium transition-colors ${
                activeSection === section
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" asChild className="group relative overflow-hidden">
              <Link to="/auth" className="flex items-center gap-1">
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  Sign In
                </span>
                <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </Button>
            <Button
              asChild
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white"
            >
              <Link to="/auth" className="flex items-center gap-1">
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  Get Started
                </span>
                <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <LanguageSelector />
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t py-4 px-6 bg-background"
        >
          <nav className="flex flex-col space-y-4">
            {["features", "how-it-works", "compliance", "pricing", "faq"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-sm font-medium transition-colors ${
                  activeSection === section
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {section
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </a>
            ))}

            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" asChild className="w-full justify-center">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white"
              >
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
      <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-background dark:to-purple-950/30">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-pink-200/20 to-purple-300/20 dark:from-pink-900/20 dark:to-purple-800/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-indigo-200/20 to-blue-300/20 dark:from-indigo-900/20 dark:to-blue-800/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="container px-4 py-20 md:py-32 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col items-center text-center space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200 dark:border-indigo-800"
            >
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-3 py-0.5 text-xs font-semibold mr-2">
                NEW
              </span>
              <span className="text-muted-foreground">DPDP Act 2023 Compliance Tools Now Available</span>
              <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <ARCLogo size="large" />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mt-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  Automate Regulations & Consents
                </span>
              </h1>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl">
              Streamline your DPDP Act 2023 compliance with our comprehensive consent management platform. Built for
              organizations that take data privacy seriously.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                size="lg"
                className="w-full group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                asChild
              >
                <Link to="/auth">
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full group relative overflow-hidden transition-all duration-300 hover:shadow-md border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                <Link to="#demo" className="relative z-10 flex items-center justify-center gap-1">
                  Watch Demo
                </Link>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-indigo-500" />
              <span>DPDP Act 2023 Compliant</span>
              <span className="mx-2">•</span>
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
              <span>14-day free trial</span>
              <span className="mx-2">•</span>
              <CheckCircle2 className="h-4 w-4 text-pink-500" />
              <span>Cancel anytime</span>
            </motion.div>
          </motion.div>
        </div>

{/* Hero Animation */}
          <div className="px-4 pb-16 max-w-6xl mx-auto">
            <div className="rounded-[2rem] p-6 md:p-10 bg-[#f4e8ff]/60 dark:bg-[#1a0f2e]/60 backdrop-blur-xl shadow-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden border shadow-xl rounded-xl bg-white/60 dark:bg-gray-900/50 backdrop-blur-lg"
              >
                <div className="relative aspect-video w-full">
                  <AnimatedConsent />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-950/80 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
       <section className="border-t border-b bg-secondary/30 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Heading */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center text-base sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 tracking-wide mb-12"
    >
      Trusted by Leading Indian Companies for DPDP Act 2023 Compliance
    </motion.p>

    {/* Logos */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 justify-items-center"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          variants={fadeIn}
          className="h-8 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300 transform hover:scale-105"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/025/721/606/original/drone-service-related-company-logo-design-illustration-vector.jpg"
            alt={`Company logo ${i}`}
            className="h-20 w-40 mb-12 object-contain"
          />

        </motion.div>
      ))}
    </motion.div>
  </div>
</section>


        {/* Features Section */}
        <section
          id="features"
          ref={(el) => registerSection("features", el)}
          className="py-20 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-background dark:to-purple-950/30"
        >
          <div className="container px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium mb-4">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                DPDP Act 2023 Compliance Made Easy
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools you need to comply with India's Digital Personal Data Protection Act
                2023.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Shield className="h-10 w-10 text-indigo-500" />,
                  animatedIcon: <AnimatedShield />,
                  title: "Data Protection by Design",
                  description:
                    "Built from the ground up with privacy by design principles to ensure compliance with DPDP Act 2023.",
                  color: "from-indigo-500 to-blue-500",
                  borderColor: "border-indigo-200 dark:border-indigo-900",
                  hoverColor: "group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20",
                },
                {
                  icon: <FileText className="h-10 w-10 text-purple-500" />,
                  animatedIcon: <AnimatedFeature icon="form" />,
                  title: "Consent Management System",
                  description:
                    "Create and manage valid consent notices that comply with DPDP Act requirements for data processing.",
                  color: "from-purple-500 to-violet-500",
                  borderColor: "border-purple-200 dark:border-purple-900",
                  hoverColor: "group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20",
                },
                {
                  icon: <UserCog className="h-10 w-10 text-blue-500" />,
                  animatedIcon: <AnimatedFeature icon="settings" />,
                  title: "Data Principal Rights",
                  description:
                    "Automated tools to handle data principal requests for access, correction, and erasure of personal data.",
                  color: "from-blue-500 to-cyan-500",
                  borderColor: "border-blue-200 dark:border-blue-900",
                  hoverColor: "group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20",
                },
                {
                  icon: <BarChart3 className="h-10 w-10 text-pink-500" />,
                  animatedIcon: <AnimatedChart />,
                  title: "Compliance Dashboard",
                  description:
                    "Track consent rates, data processing activities, and compliance metrics with detailed dashboards.",
                  color: "from-pink-500 to-rose-500",
                  borderColor: "border-pink-200 dark:border-pink-900",
                  hoverColor: "group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20",
                },
                {
                  icon: <Database className="h-10 w-10 text-cyan-500" />,
                  animatedIcon: <AnimatedFeature icon="refresh" />,
                  title: "Data Processing Records",
                  description: "Maintain comprehensive records of processing activities as required by DPDP Act 2023.",
                  color: "from-cyan-500 to-teal-500",
                  borderColor: "border-cyan-200 dark:border-cyan-900",
                  hoverColor: "group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20",
                },
                {
                  icon: <FileCheck className="h-10 w-10 text-emerald-500" />,
                  animatedIcon: <AnimatedFeature icon="compliance" />,
                  title: "Automated Compliance",
                  description: "Stay compliant with automated updates when DPDP Act regulations change.",
                  color: "from-emerald-500 to-green-500",
                  borderColor: "border-emerald-200 dark:border-emerald-900",
                  hoverColor: "group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card
                    className={`border-2 ${feature.borderColor} transition-all duration-300 shadow-sm hover:shadow-md h-full group overflow-hidden`}
                  >
                    <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}></div>
                    <CardContent className="pt-6">
                      <div className="mb-4 h-16 flex items-center justify-center">
                        <div className="opacity-100 group-hover:opacity-0 transition-opacity duration-300 absolute">
                          {feature.icon}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150">
                          {feature.animatedIcon}
                        </div>
                      </div>
                      <h3
                        className={`text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${feature.color}`}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-0 group-hover:h-1 transition-all duration-300 bg-gradient-to-r ${feature.color}`}
                      ></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          ref={(el) => registerSection("how-it-works", el)}
          className="py-20 md:py-32 bg-secondary/30 overflow-hidden"
        >
          <div className="container px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium mb-4">
                Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                How ARC Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform simplifies DPDP Act 2023 compliance across your entire organization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="space-y-8">
                  {[
                    {
                      number: "01",
                      title: "Seamless Integration",
                      description:
                        "Integrate our solution with your websites and apps using our SDK or API. Implementation takes minutes, not days.",
                      color: "bg-indigo-500",
                    },
                    {
                      number: "02",
                      title: "DPDP Act Compliant Consent",
                      description:
                        "Configure consent forms that meet DPDP Act 2023 requirements for clear, specific, and informed consent.",
                      color: "bg-purple-500",
                    },
                    {
                      number: "03",
                      title: "Data Principal Rights Management",
                      description:
                        "Our system automatically handles data principal requests for access, correction, and erasure of personal data.",
                      color: "bg-pink-500",
                    },
                    {
                      number: "04",
                      title: "Compliance Reporting",
                      description:
                        "Access detailed reports to demonstrate DPDP Act 2023 compliance during audits by the Data Protection Board.",
                      color: "bg-blue-500",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold`}
                      >
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <div className="relative rounded-xl overflow-hidden border shadow-xl">
                  <div className="aspect-square md:aspect-video w-full">
                    <AnimatedProcess />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section
          id="compliance"
          ref={(el) => registerSection("compliance", el)}
          className="py-20 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-background dark:to-purple-950/30"
        >
          <div className="container px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium mb-4">
                Compliance
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                DPDP Act 2023 Compliance Coverage
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stay compliant with India's data protection regulations with our comprehensive solution.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              {[
                {
                  title: "Valid Consent Management",
                  description: "Collect and manage valid consent as per Section 7 of DPDP Act 2023",
                  color: "from-indigo-500 to-blue-500",
                },
                {
                  title: "Data Principal Rights",
                  description: "Handle rights to information, access, correction, and erasure of personal data",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Data Fiduciary Obligations",
                  description: "Fulfill obligations for reasonable security safeguards and breach notifications",
                  color: "from-cyan-500 to-teal-500",
                },
                {
                  title: "Processing of Children's Data",
                  description: "Special protections for processing personal data of children under 18 years",
                  color: "from-teal-500 to-green-500",
                },
                {
                  title: "Significant Data Fiduciaries",
                  description: "Additional compliance requirements for significant data fiduciaries",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  title: "Data Protection Board",
                  description: "Prepare for inquiries and demonstrate compliance to the Data Protection Board",
                  color: "from-emerald-500 to-lime-500",
                },
                {
                  title: "Cross-Border Data Transfers",
                  description: "Manage compliant transfers of personal data outside India",
                  color: "from-lime-500 to-yellow-500",
                },
                {
                  title: "Penalties & Enforcement",
                  description: "Avoid penalties of up to ₹250 crore for non-compliance",
                  color: "from-yellow-500 to-amber-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-2 shadow-sm h-full hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${item.color}`}></div>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Need help with DPDP Act 2023 compliance?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our team of privacy experts can help you navigate India's data protection requirements and implement
                best practices.
              </p>
              <Button
                size="lg"
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                asChild
              >
                <Link to="/auth">
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    Schedule a Consultation
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-secondary/30 overflow-hidden">
          <div className="container px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Trusted by Privacy Leaders
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what privacy professionals are saying about our DPDP Act 2023 compliance platform.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  quote:
                    "ARC has transformed how we handle DPDP Act compliance. The platform is intuitive, powerful, and has significantly reduced our compliance workload.",
                  author: "Priya Sharma",
                  title: "Chief Privacy Officer",
                  company: "TechSolutions India",
                  avatar: "https://static.vecteezy.com/system/resources/previews/046/458/721/original/smiling-woman-in-green-shirt-on-transparent-background-headshot-png.png",
                  color: "from-indigo-500 to-blue-500",
                },
                {
                  quote:
                    "The DPDP Act compliance dashboard is exceptional. We can now demonstrate compliance with confidence during audits and optimize our consent flows.",
                  author: "Rajesh Patel",
                  title: "Data Protection Officer",
                  company: "FinServe Solutions",
                  avatar: "https://static.vecteezy.com/system/resources/previews/028/144/531/original/asian-businessman-isolated-png.png",
                  color: "from-purple-500 to-violet-500",
                },
                {
                  quote:
                    "Implementation was seamless, and the support team is incredibly knowledgeable about DPDP Act requirements. ARC has become an essential part of our privacy program.",
                  author: "Ananya Gupta",
                  title: "VP of Legal & Compliance",
                  company: "Healthcare Systems India",
                  avatar: "https://thumbs.dreamstime.com/b/pretty-young-mixed-race-young-adult-woman-portrait-29196867.jpg",
                  color: "from-pink-500 to-rose-500",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-2 shadow-sm h-full hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${testimonial.color}`}></div>
                    <CardContent className="pt-6">
                      <div className="mb-4 text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                        "
                      </div>
                      <p className="mb-6 italic">{testimonial.quote}</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.title}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          ref={(el) => registerSection("pricing", el)}
          className="py-20 md:py-32 overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30"
        >
          <div className="container px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium mb-4">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Transparent Pricing Model
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Free for data principals, custom pricing for organizations implementing our DPDP Act compliance
                solution.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "Data Principals",
                  price: "Always Free",
                  description: "For individuals managing their data rights under DPDP Act 2023",
                  features: [
                    "Seamless consent experience",
                    "Control over personal data",
                    "Easy preference management",
                    "Transparent data usage information",
                    "Simple opt-in/opt-out options",
                    "Access to consent history",
                  ],
                  cta: "Learn More",
                  ctaLink: "#faq",
                  color: "from-indigo-500 to-blue-500",
                  iconColor: "text-indigo-500",
                  borderColor: "border-indigo-200 dark:border-indigo-900",
                  hoverColor: "group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20",
                },
                {
                  name: "Data Fiduciaries",
                  price: "Price on Request",
                  description: "For organizations that need to comply with DPDP Act 2023",
                  features: [
                    "Full DPDP Act 2023 compliance",
                    "Custom branding and UI integration",
                    "Data principal rights management",
                    "Compliance reporting dashboard",
                    "API access and developer tools",
                    "Dedicated support and training",
                    "Custom implementation services",
                  ],
                  cta: "Request Pricing",
                  ctaLink: "#contact",
                  color: "from-purple-500 to-pink-500",
                  iconColor: "text-purple-500",
                  borderColor: "border-purple-200 dark:border-purple-900",
                  hoverColor: "group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20",
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className={`border-2 h-full ${plan.borderColor} shadow-lg group transition-all duration-300`}>
                    <div
                      className={`absolute top-0 right-0 left-0 h-2 rounded-t-lg bg-gradient-to-r ${plan.color}`}
                    ></div>
                    <CardContent className="pt-8">
                      <div className="mb-4 w-16 h-16 rounded-full mx-auto bg-gradient-to-r from-background to-secondary flex items-center justify-center">
                        {index === 0 ? (
                          <User className={`h-8 w-8 ${plan.iconColor}`} />
                        ) : (
                          <Building2 className={`h-8 w-8 ${plan.iconColor}`} />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-center">{plan.name}</h3>
                      <div className="mb-4 text-center">
                        <span
                          className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}
                        >
                          {plan.price}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-6 text-center">{plan.description}</p>
                      <div className={`p-4 rounded-lg mb-6 transition-colors duration-300 ${plan.hoverColor}`}>
                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className={`h-5 w-5 ${plan.iconColor} flex-shrink-0 mt-0.5`} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className={`w-full group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-r ${plan.color} hover:opacity-90`}
                        asChild
                      >
                        <Link to={plan.ctaLink}>
                          <span className="relative z-10 flex items-center justify-center gap-1 text-white">
                            {plan.cta}
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-xl max-w-3xl mx-auto"
            >
              <h3 className="text-xl font-bold mb-2">Need a custom enterprise solution for DPDP Act compliance?</h3>
              <p className="text-muted-foreground mb-4">
                Our team will work with you to create a tailored solution that meets your specific DPDP Act 2023
                requirements.
              </p>
              <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white">
                <Link to="#contact">
                  <span className="flex items-center justify-center gap-1">
                    Contact Our Compliance Team
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          ref={(el) => registerSection("faq", el)}
          className="py-20 md:py-32 bg-secondary/30 overflow-hidden"
        >
          <div className="container px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our DPDP Act 2023 compliance platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does ARC help with DPDP Act 2023 compliance?",
                    answer:
                      "ARC provides a comprehensive suite of tools to help organizations comply with India's Digital Personal Data Protection Act 2023. This includes consent management, data principal rights handling, data processing records, compliance reporting, and automated updates when regulations change. Our platform is designed to make DPDP Act compliance straightforward and efficient.",
                  },
                  {
                    question: "How long does it take to implement ARC?",
                    answer:
                      "Implementation typically takes less than a day. Our platform offers simple integration options including a JavaScript snippet, WordPress plugin, or API integration. Most customers are up and running within hours, with full DPDP Act 2023 compliance features activated.",
                  },
                  {
                    question: "How does ARC handle data principal rights under DPDP Act?",
                    answer:
                      "ARC provides automated tools to handle data principal requests for information, access, correction, and erasure of personal data as required by the DPDP Act 2023. The platform includes customizable workflows, verification processes, and response templates to ensure timely and compliant handling of all data principal requests.",
                  },
                  {
                    question: "Can I customize the consent notices to match my brand?",
                    answer:
                      "Absolutely. ARC offers extensive customization options to match your brand's look and feel while ensuring compliance with DPDP Act 2023 requirements for valid consent. You can customize colors, fonts, layouts, and messaging while still maintaining compliance with regulatory requirements.",
                  },
                  {
                    question: "What kind of compliance reporting does ARC provide?",
                    answer:
                      "Our platform provides comprehensive analytics and reporting specifically designed for DPDP Act 2023 compliance. This includes consent rates, data principal rights request metrics, processing activities, and compliance status. You can generate custom reports for specific time periods or data categories, and export data for audit purposes or submissions to the Data Protection Board.",
                  },
                  {
                    question: "How does ARC stay updated with DPDP Act regulations?",
                    answer:
                      "We continuously monitor regulatory changes to the DPDP Act 2023 and update our platform accordingly. Our team of privacy experts ensures that ARC remains compliant with the latest requirements, and we provide regular updates to adapt to new regulations, rules, or guidance from the Data Protection Board of India.",
                  },
                  {
                    question: "What support options are available for DPDP Act compliance?",
                    answer:
                      "We offer multiple support tiers depending on your plan. All customers receive access to our knowledge base and email support. Business and Enterprise plans include priority support with DPDP Act compliance experts, and Enterprise customers receive a dedicated compliance account manager and 24/7 premium support.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">Still have questions about DPDP Act compliance?</p>
              <Button
                asChild
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
              >
                <Link to="#contact">
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    Contact Our Compliance Team
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 md:py-32 overflow-hidden">
          <div className="container px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              {/* Animated background elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-pink-500/20 rounded-full"></div>
                <div className="absolute bottom-1/3 left-1/3 w-15 h-15 bg-blue-500/15 rounded-full"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Ready for DPDP Act 2023 Compliance?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Join leading Indian organizations that trust ARC for their DPDP Act compliance needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button
                    size="lg"
                    className="w-full group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                    asChild
                  >
                    <Link to="/auth">
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        Start Free Trial
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full group relative overflow-hidden transition-all duration-300 hover:shadow-md border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                  >
                    <Link to="#demo" className="relative z-10 flex items-center justify-center gap-1">
                      Schedule Demo
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-secondary/30">
        <div className="container px-4 py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <ARCLogo />
              </div>
              <p className="text-muted-foreground mb-4">
                Automate Regulations & Consents for DPDP Act 2023 compliance.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-300"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-300"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-300"
                  aria-label="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Changelog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    DPDP Act Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Compliance Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Webinars
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transform duration-300"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} ARC - Automate Regulations & Consents. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              
              <ModeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
