import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Play,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description:
        "Get intelligent spending recommendations and financial insights powered by advanced AI algorithms.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Analytics",
      description:
        "Visualize your spending patterns with beautiful charts and predictive analysis.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-Level Security",
      description:
        "Your financial data is protected with enterprise-grade encryption and security.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Sharing",
      description:
        "Collaborate with family members on budgets and financial goals.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "TechCorp",
      content:
        "This app has completely transformed how I manage my finances. The AI insights are incredibly accurate!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "StartupXYZ",
      content:
        "Finally, a budgeting app that actually helps me save money. The interface is beautiful and intuitive.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      company: "Local Cafe",
      content:
        "Managing both personal and business finances has never been easier. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                ExpensiGo
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="cursor-pointer">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Take Control of Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most intelligent expense tracking app powered by AI. Get
              insights, save money, and achieve your financial goals faster than
              ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-medium cursor-pointer"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <div>
                <a
                  href="https://youtu.be/BFivZDpH8mI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg font-medium border-2"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Button>
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required — try premium features for free.
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </section>

      {/* Demo Image Section */}
      <section className="py-20  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a glimpse of the powerful dashboard and intuitive interface
              that makes managing your finances effortless.
            </p>
          </div>

          <div className="relative">
            <div className="inline-block filter drop-shadow-2xl">
              <Image
                src="/dashboard.png"
                alt="ExpensiGo Dashboard Demo"
                width={1200}
                height={800}
                className="w-full h-auto rounded-xl"
                unoptimized
                priority
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
                Professional Dashboard Interface
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ExpensiGo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technology and designed for real people
              who want to take control of their finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Hundreds
            </h2>
            <p className="text-xl text-gray-600">
              Join the community of smart savers and financial planners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Financial Insights & Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed with our latest articles on personal finance,
              budgeting tips, and money management strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <a
              href="https://fincalc-blog.in/10-essential-budgeting-tips-for-beginners/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <article className="group cursor-pointer">
                <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      BUDGETING TIPS
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      10 Essential Budgeting Tips for Beginners
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Learn the fundamentals of budgeting with these proven
                      strategies that will help you take control of your
                      finances and start saving money today.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        December 20, 2024
                      </span>
                      <span className="text-blue-600 font-medium text-sm group-hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </a>

            {/* Blog Post 2 */}
            <a
              href="https://techresearchonline.com/blog/ai-personal-finance/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <article className="group cursor-pointer">
                <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                    <Zap className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-green-600 font-medium mb-2">
                      AI INSIGHTS
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      How AI is Revolutionizing Personal Finance
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Discover how artificial intelligence is transforming the
                      way we manage money, from automated categorization to
                      predictive spending analysis.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        December 18, 2024
                      </span>
                      <span className="text-green-600 font-medium text-sm group-hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </a>

            {/* Blog Post 3 */}
            <a
              href="https://suozziforny.com/protect-financial-data/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <article className="group cursor-pointer">
                <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-purple-600 font-medium mb-2">
                      FINANCIAL SECURITY
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                      5 Ways to Secure Your Financial Data
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Essential security practices to protect your financial
                      information and ensure your money management remains safe
                      and private.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        December 15, 2024
                      </span>
                      <span className="text-purple-600 font-medium text-sm group-hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </a>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="px-8 py-3 text-lg font-medium border-2"
            >
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your journey to financial freedom today. Join thousands of
            users who are already saving more and spending smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 cursor-pointer px-8 py-4 text-lg font-medium"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">ExpensiGo</span>
              </div>
              <p className="text-gray-400">
                The intelligent way to manage your finances and achieve your
                financial goals.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/upgrade"
                    className="hover:text-white transition-colors text-blue-400 font-medium"
                  >
                    Pro Plan - AUD 2.99/month
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ExpensiGo. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
