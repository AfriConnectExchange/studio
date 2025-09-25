'use client';

import {
  BookOpen,
  User,
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  articleCount: number;
  color: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  lastUpdated: string;
  featured?: boolean;
}

export const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'New to AfriConnect? Start here for the basics',
    icon: BookOpen,
    articleCount: 2,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 'account',
    name: 'Account & Profile',
    description: 'Managing your account, profile, and preferences',
    icon: User,
    articleCount: 1,
    color: 'text-green-600 bg-green-100',
  },
  {
    id: 'buying',
    name: 'Buying & Shopping',
    description: 'How to find products, add to cart, and checkout',
    icon: ShoppingCart,
    articleCount: 1,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    id: 'payments',
    name: 'Payments & Billing',
    description: 'Payment methods, escrow, and transaction issues',
    icon: CreditCard,
    articleCount: 1,
    color: 'text-orange-600 bg-orange-100',
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    description: 'Tracking orders, delivery times, and shipping issues',
    icon: Truck,
    articleCount: 0,
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    id: 'security',
    name: 'Security & Trust',
    description: 'KYC verification, seller trust, and safety tips',
    icon: Shield,
    articleCount: 1,
    color: 'text-red-600 bg-red-100',
  },
];

export const helpArticles: HelpArticle[] = [
  // Getting Started
  {
    id: '1',
    title: 'How to create your AfriConnect account',
    content: `Creating your AfriConnect account is quick and easy:

**1. Visit the Registration Page**
Click "Sign Up" on the homepage to begin.

**2. Choose Registration Method**
You can register using your email address or your phone number.

**3. Email Registration**
If you choose email, enter your full name, email address, and create a strong password. You'll receive a verification link in your inbox.

**4. Phone Registration**
If you choose phone, enter your full name and phone number. You will receive a one-time password (OTP) via SMS to verify your number.

**5. Complete Your Profile**
Once verified, you'll be guided through a short onboarding process to complete your profile.

**Verification Process:**
- The email verification link is valid for 24 hours.
- The phone OTP is valid for 5 minutes.
- Your account is active immediately after verification, and you can start exploring!`,
    category: 'getting-started',
    tags: ['registration', 'signup', 'account creation', 'verification'],
    helpful: 89,
    notHelpful: 3,
    lastUpdated: '2024-01-20',
    featured: true,
  },
  {
    id: '2',
    title: 'Understanding the AfriConnect marketplace',
    content: `AfriConnect is your gateway to authentic African products, services, and skills training.

**What You'll Find:**
- Traditional crafts, textiles, and art.
- Modern African fashion, jewelry, and accessories.
- Natural beauty, wellness, and food products.
- Digital courses and professional training from African experts.

**Key Features:**
- **Verified Sellers**: All sellers undergo a KYC (Know Your Customer) verification process for your safety.
- **Secure Payments**: We offer multiple payment options, including our highly recommended Escrow service for secure transactions.
- **Global Shipping**: Our sellers ship to over 50 countries worldwide.
- **Barter System**: Don't have cash? Propose a trade of goods or services with sellers who are open to bartering.
- **Community Reviews**: Read real feedback from verified buyers to make informed decisions.`,
    category: 'getting-started',
    tags: ['marketplace', 'overview', 'features', 'products'],
    helpful: 156,
    notHelpful: 8,
    lastUpdated: '2024-01-18',
    featured: true,
  },
  // Account & Profile
  {
    id: '3',
    title: 'How to complete your profile and KYC',
    content: `A complete and verified profile unlocks all features of AfriConnect.

**1. Complete Your Onboarding**
After registering, you will be prompted to complete a short onboarding flow where you can select your primary role (e.g., Buyer, Seller) and provide basic personal details.

**2. Access Your Profile Settings**
Click on your user icon in the header and navigate to your Profile to update your information at any time.

**3. KYC for Sellers, SMEs, and Trainers**
If your role involves selling goods or services, you must complete KYC verification.
- Navigate to your Profile page.
- You will see a prompt to start your KYC verification.
- Follow the steps to provide your personal and business information, and upload the required documents.

**Required Documents May Include:**
- Government-issued ID (Passport, National ID, Driver's License)
- Proof of Address (e.g., utility bill)
- Business Registration Documents (for SMEs)

**Benefits of a Complete & Verified Profile:**
- Full access to all platform features.
- Increased trust from other users.
- Faster checkout and transaction processing.
- A "Verified" badge on your profile.`,
    category: 'account',
    tags: ['profile', 'personal information', 'settings', 'verification', 'kyc'],
    helpful: 73,
    notHelpful: 2,
    lastUpdated: '2024-01-19',
  },
  // Buying & Shopping
  {
    id: '4',
    title: 'How to search and filter for products',
    content: `Find exactly what you're looking for with our powerful search and filtering tools.

**Using the Search Bar**
Enter keywords like product names, seller names, or categories into the search bar at the top of the marketplace page. For best results, use at least 3 characters.

**Filtering Your Results**
On the marketplace page, you can use the filter panel on the left (or via the "Filters" button on mobile) to narrow down your results:
- **Categories**: Select a specific product category.
- **Price Range**: Set a minimum and maximum price.
- **Product Filters**:
  - **Free Listings Only**: Show only items offered for free.
  - **Verified Sellers Only**: Show items from sellers who have completed KYC.
  - **On Sale**: Find products with active discounts.
  - **Free Shipping**: Filter for items that ship for free.

**Sorting Your Results**
Use the "Sort by" dropdown to organize the products by:
- Most Relevant (default)
- Price: Low to High
- Price: High to Low
- Highest Rated
- Newest First`,
    category: 'buying',
    tags: ['search', 'filters', 'products', 'categories'],
    helpful: 94,
    notHelpful: 5,
    lastUpdated: '2024-01-21',
    featured: true,
  },
  // Payments
  {
    id: '5',
    title: 'Understanding our payment options',
    content: `We offer a variety of secure payment methods to suit your needs.

**1. Escrow Payment (Recommended)**
This is the most secure way to pay. Your money is held by AfriConnect and only released to the seller after you confirm that you've received your item as described. This protects you from fraud.

**2. Card Payment (Stripe)**
Pay directly using your debit or credit card. We partner with Stripe, a global leader in online payments, to ensure your card details are processed securely.

**3. Digital Wallets (PayPal, Apple Pay, Google Pay)**
Use your favorite digital wallet for a fast and convenient checkout experience.

**4. Flutterwave**
A great option for users in Africa, allowing payments via mobile money, bank transfer, and other local methods.

**5. Cash on Delivery**
For certain locations and sellers, you can choose to pay in cash when your order is delivered. This option is typically only available for lower-value items.

**6. Barter Exchange**
If a seller has enabled this option, you can propose to trade an item or service of yours instead of paying with money.`,
    category: 'payments',
    tags: [
      'escrow',
      'payment security',
      'buyer protection',
      'card',
      'stripe',
      'flutterwave',
    ],
    helpful: 127,
    notHelpful: 7,
    lastUpdated: '2024-01-17',
    featured: true,
  },
  // Security
  {
    id: '6',
    title: 'How to identify trustworthy sellers',
    content: `Your safety is our priority. Here’s how to identify trustworthy sellers on AfriConnect.

**Look for Verification Badges**
On a seller's profile or product page, look for these badges:
- **KYC Verified**: The seller has completed our full identity and business verification process. This is the highest level of trust.
- **Verified Seller**: A general badge indicating the seller has met our basic trust criteria.

**Check Seller Ratings and Reviews**
- Look for a high star rating (4 stars or above is great).
- Read recent reviews from other buyers. Pay attention to comments about product quality, shipping speed, and communication.

**Review the Seller's Profile**
- How long have they been a member?
- Do they have a profile picture and a clear description of their business?
- How many sales have they made?

**Red Flags to Watch For:**
- No verification badges.
- Prices that seem too good to be true.
- Vague product descriptions or poor-quality photos.
- Requests to communicate or pay outside of the AfriConnect platform. **Never pay a seller directly.**

**Our Recommendation:**
For high-value items or when buying from a new seller, always use our **Escrow Payment** option for maximum security.`,
    category: 'security',
    tags: ['seller verification', 'safety', 'trust badges', 'red flags'],
    helpful: 89,
    notHelpful: 4,
    lastUpdated: '2024-01-16',
  },
];

export const quickActions = [
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: MessageSquare,
    action: 'support',
  },
  {
    title: 'Track Your Order',
    description: 'Check the status of your purchases',
    icon: Truck,
    action: 'tracking',
  },
  {
    title: 'Manage Account',
    description: 'Update your profile and settings',
    icon: User,
    action: 'profile',
  },
  {
    title: 'Report an Issue',
    description: 'Report problems or suspicious activity',
    icon: AlertCircle,
    action: 'support',
  },
];
