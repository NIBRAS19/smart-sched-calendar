import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Star, Users, ArrowRight, Mail, Phone } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function Landing() {
  const { theme, setTheme } = useTheme();
  
  // Add smooth scroll effect for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation with animation */}
      <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">SmartSched</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              Features
            </Link>
            <Link to="/benefits" className="text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              Benefits
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              Pricing
            </Link>
            <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex gap-2 items-center">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="outline" className="transition-all hover:scale-105">Log In</Button>
            </Link>
            <Link to="/calendar">
              <Button className="transition-all hover:scale-105">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with enhanced animations */}
      <section className="py-16 md:py-24 overflow-hidden relative">
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 py-1.5 px-6 mx-auto animate-fade-in">The Smart Calendar App</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Effortless Calendar
              <span className="block text-primary"> Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Smart, Simple, and Seamless scheduling solutions for your personal and professional life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/calendar">
                <Button size="lg" className="w-full sm:w-auto group transition-all hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/calendar">
                <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all hover:scale-105">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section with enhanced styling */}
      <section id="demo" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="relative max-w-6xl mx-auto">
            <div className="rounded-xl shadow-2xl overflow-hidden border border-border transition-all hover:shadow-primary/10 hover:border-primary/20">
              <img 
                src="/images/image-1.jpg" 
                alt="SmartSched Calendar App Interface" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg hidden md:block transform transition-transform hover:scale-105">
              <Badge variant="secondary" className="mb-2">Smart Feature</Badge>
              <p className="font-medium">AI-Powered Scheduling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with better cards */}
      <section id="features" className="py-16 md:py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Smart Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Calendar Management</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Experience the future of scheduling with AI-powered features</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Views</h3>
                <p className="text-muted-foreground">
                  AI-enhanced calendar views that adapt to your scheduling patterns and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
                <p className="text-muted-foreground">
                  Let AI suggest optimal meeting times and handle scheduling conflicts automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Collaboration</h3>
                <p className="text-muted-foreground">
                  AI-powered team scheduling that considers everyone's availability and preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section with motion effects */}
      <section id="benefits" className="py-16 md:py-24 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The smart way to manage your time</h2>
              <p className="text-xl mb-8 text-muted-foreground">
                Experience the power of AI-driven scheduling that adapts to your needs and helps you stay organized.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start group">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p>AI-powered scheduling suggestions based on your patterns</p>
                </div>
                <div className="flex gap-3 items-start group">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p>Smart conflict resolution and optimal time slot finding</p>
                </div>
                <div className="flex gap-3 items-start group">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p>Intelligent notifications and reminders</p>
                </div>
                <div className="flex gap-3 items-start group">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p>Seamless integration with your existing calendar</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-xl shadow-xl overflow-hidden border border-border hover:shadow-primary/10 transition-all">
                <img 
                  src="/images/image-2.png" 
                  alt="SmartSched Mobile Interface" 
                  className="w-full h-auto object-contain max-h-[600px]"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-lg shadow-lg hidden md:block transform hover:rotate-3 transition-transform">
                <Star className="h-5 w-5" />
                <span className="text-sm font-medium">Mobile Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - New Addition */}
      <section id="contact" className="py-16 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Badge variant="outline" className="mb-4">Get in Touch</Badge>
              <h2 className="text-3xl font-bold mb-4">We'd love to hear from you</h2>
              <p className="text-muted-foreground mb-6">Have questions about SmartSched? Our team is ready to assist you.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contact@smartsched.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-xl border">
              <h3 className="font-bold mb-4">Send us a message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full p-2 rounded-md border bg-background" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full p-2 rounded-md border bg-background" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea className="w-full p-2 rounded-md border bg-background h-24" placeholder="How can we help you?"></textarea>
                </div>
                <Button className="w-full">Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Enhanced */}
      <section id="pricing" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 mx-auto">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your scheduling needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border border-border relative overflow-hidden transition-transform hover:scale-105">
              <div className="absolute top-0 right-0 left-0 h-1 bg-primary/30"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <div className="text-3xl font-bold mb-4">Free</div>
                <p className="text-muted-foreground mb-6">Perfect for personal scheduling</p>
                <ul className="space-y-2 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Basic calendar views</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Event creation & management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Basic notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Dark/light mode</span>
                  </li>
                </ul>
                <Link to="/calendar">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-primary relative overflow-hidden scale-105 shadow-lg shadow-primary/10">
              <div className="absolute top-0 right-0 left-0 h-1 bg-primary"></div>
              <div className="bg-primary text-primary-foreground text-sm font-medium py-1.5 absolute top-0 right-0 left-0">
                Most Popular
              </div>
              <CardContent className="p-6 pt-10">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-4">$5<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground mb-6">For power users & professionals</p>
                <ul className="space-y-2 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Advanced calendar views</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Smart AI scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Custom event categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link to="/calendar">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border border-border relative overflow-hidden transition-transform hover:scale-105">
              <div className="absolute top-0 right-0 left-0 h-1 bg-primary/30"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-4">$9<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground mb-6">For teams & organizations</p>
                <ul className="space-y-2 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Advanced AI scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Link to="/calendar">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer with better organization */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Tutorial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link to="/not-found" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-bold">SmartSched</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SmartSched. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
