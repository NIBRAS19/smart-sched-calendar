import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Zap, Brain, Users, CheckCircle } from "lucide-react";

export default function Benefits() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">SmartSched</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-foreground hover:text-primary transition-colors">Features</Link>
            <Link to="/benefits" className="text-primary font-medium">Benefits</Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link to="/calendar">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The Smart Way to Manage Your Time</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the power of AI-driven scheduling that adapts to your needs and helps you stay organized
          </p>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI-Powered Efficiency</h3>
                  <p className="text-muted-foreground">
                    Save hours every week with intelligent scheduling that learns from your patterns and preferences.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Time Optimization</h3>
                  <p className="text-muted-foreground">
                    Maximize productivity with smart scheduling that considers your energy levels and priorities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Instant Setup</h3>
                  <p className="text-muted-foreground">
                    Get started in minutes with seamless integration and intuitive interface.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/image-2.png" 
                alt="SmartSched Benefits" 
                className="rounded-xl shadow-xl w-full h-[400px] object-contain"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                <Badge variant="secondary" className="mb-2">Smart Benefit</Badge>
                <p className="font-medium">Save 5+ Hours Weekly</p>
              </div>
            </div>
          </div>

          {/* Benefit Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Streamline team scheduling with AI-powered coordination and real-time updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Notifications</h3>
                <p className="text-muted-foreground">
                  Get intelligent reminders and updates that adapt to your schedule and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
                <p className="text-muted-foreground">
                  Connect with your existing calendar and tools for a unified scheduling experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to save time?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already saving time with our AI-powered calendar.
          </p>
          <Link to="/calendar">
            <Button size="lg" className="group">
              Get Started
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
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