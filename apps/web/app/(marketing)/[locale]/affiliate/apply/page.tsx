import { Button } from '@ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@ui/components/card';
import { Input } from '@ui/components/input';
import { Label } from '@ui/components/label';
import { Textarea } from '@ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/components/select';
import { Badge } from '@ui/components/badge';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default function AffiliateApplicationPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/affiliate"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Affiliate Program
        </Link>
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          🚀 Join DataFast Affiliates
        </Badge>
        <h1 className="text-3xl font-bold mb-2">
          Apply to Join Our Affiliate Program
        </h1>
        <p className="text-muted-foreground">
          Fill out the form below and we'll review your application within 24
          hours.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Affiliate Application</CardTitle>
          <CardDescription>
            Tell us about yourself and how you plan to promote DataFast.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="company">Company/Organization</Label>
              <Input id="company" placeholder="Your company name (optional)" />
            </div>

            {/* Online Presence */}
            <div>
              <Label htmlFor="website">Website/Blog URL</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitter">Twitter/X Handle</Label>
                <Input id="twitter" placeholder="@yourusername" />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            {/* Audience Information */}
            <div>
              <Label htmlFor="audienceSize">Estimated Audience Size *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your audience size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under 1,000</SelectItem>
                  <SelectItem value="1k-5k">1,000 - 5,000</SelectItem>
                  <SelectItem value="5k-10k">5,000 - 10,000</SelectItem>
                  <SelectItem value="10k-50k">10,000 - 50,000</SelectItem>
                  <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                  <SelectItem value="over-100k">Over 100,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="audienceType">Target Audience *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Who is your primary audience?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                  <SelectItem value="small-business">
                    Small Business Owners
                  </SelectItem>
                  <SelectItem value="marketers">Digital Marketers</SelectItem>
                  <SelectItem value="saas-founders">SaaS Founders</SelectItem>
                  <SelectItem value="content-creators">
                    Content Creators
                  </SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Promotion Strategy */}
            <div>
              <Label htmlFor="promotionPlan">
                How do you plan to promote DataFast? *
              </Label>
              <Textarea
                id="promotionPlan"
                placeholder="Describe your marketing strategy, content plans, or how you intend to promote DataFast to your audience..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="experience">
                Previous Affiliate Marketing Experience
              </Label>
              <Textarea
                id="experience"
                placeholder="Tell us about your experience with affiliate marketing, any programs you've participated in, or relevant achievements..."
                className="min-h-[100px]"
              />
            </div>

            {/* Additional Information */}
            <div>
              <Label htmlFor="whyDataFast">
                Why are you interested in promoting DataFast? *
              </Label>
              <Textarea
                id="whyDataFast"
                placeholder="What attracts you to DataFast? How does it align with your audience's needs?"
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Terms Agreement */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Program Terms Reminder:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 50% commission on all payments for up to 12 months</li>
                <li>• Minimum payout threshold: $100</li>
                <li>• Payments made 30 days after customer payment</li>
                <li>• No branded keyword advertising allowed</li>
                <li>• Must comply with our affiliate agreement</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded" required />
              <Label htmlFor="terms" className="text-sm">
                I agree to the affiliate program terms and conditions *
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="marketing" className="rounded" />
              <Label htmlFor="marketing" className="text-sm">
                I'd like to receive marketing updates and affiliate tips via
                email
              </Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              Submit Application
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We'll review your application and get back to you within 24 hours.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
