import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, BarChart3, ArrowRight, Building2, GraduationCap, LogIn } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">SmartEd Recruit</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-6 mb-12">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground">
              Smart Talent
              <span className="gradient-primary bg-clip-text text-transparent"> Discovery</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with top talent through our intelligent recruiting platform. 
              Access verified student profiles with AI-powered insights and streamlined hiring workflows.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/">
              <Button size="lg" className="px-8 py-6 text-lg">
                Explore Talent Pool
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-foreground mb-4">
              Built for Modern Recruiting
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your hiring process with powerful tools designed for HR professionals and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bento-card bento-card-hover">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">Talent Discovery</CardTitle>
                <CardDescription>
                  Access curated student profiles with verified skills, projects, and academic achievements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI-powered matching</li>
                  <li>• Skill verification</li>
                  <li>• Portfolio reviews</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bento-card bento-card-hover">
              <CardHeader>
                <Shield className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-xl">Admin Control</CardTitle>
                <CardDescription>
                  Comprehensive dashboard for managing access keys, monitoring usage, and controlling data flow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Access key management</li>
                  <li>• Usage analytics</li>
                  <li>• Security controls</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bento-card bento-card-hover">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-warning mb-4" />
                <CardTitle className="text-xl">HR Analytics</CardTitle>
                <CardDescription>
                  Track recruitment metrics, analyze hiring patterns, and optimize your talent acquisition strategy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Recruitment metrics</li>
                  <li>• Performance tracking</li>
                  <li>• Custom reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="gradient-subtle border-border/50 p-12">
            <div className="space-y-6">
              <Building2 className="w-16 h-16 text-primary mx-auto" />
              <h2 className="text-3xl font-light text-foreground">
                Ready to Transform Your Hiring?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join forward-thinking companies using SmartEd Recruit to discover exceptional talent 
                and build high-performing teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link to="/login">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    Browse Profiles
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="text-lg font-medium text-foreground">SmartEd Recruit</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connecting talent with opportunity through intelligent recruiting solutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;