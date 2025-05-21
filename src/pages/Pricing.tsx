import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Users, Brain, Zap } from "lucide-react";

export default function Pricing() {
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
            <Link to="/benefits" className="text-foreground hover:text-primary transition-colors">Benefits</Link>
            <Link to="/pricing" className="text-primary font-medium">Pricing</Link>
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
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that works best for your scheduling needs
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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
                <h4 className="text-center">Most Popular</h4>
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

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-4">What's included in the free plan?</h3>
              <p className="text-muted-foreground">
                The free plan includes basic calendar functionality, event management, and essential features to get you started with smart scheduling.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Is there a team discount?</h3>
              <p className="text-muted-foreground">
                Yes, we offer special pricing for teams. Contact our sales team for custom enterprise solutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards and PayPal. Enterprise customers can also pay via invoice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
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