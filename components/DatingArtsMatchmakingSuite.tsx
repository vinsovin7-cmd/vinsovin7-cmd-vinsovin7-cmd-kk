import React, { useState, useEffect, useRef } from "react";
import { EmbeddedGmailSuite } from "./EmbeddedGmailSuite";
import { CoinsCreditManagerModal } from "./CoinsCreditManagerModal";
import {
  Heart,
  Sparkles,
  User,
  Users,
  Shield,
  ShieldCheck,
  Send,
  Gift,
  Flame,
  Lock,
  ArrowLeft,
  Check,
  CheckCircle2,
  Volume2,
  Play,
  Pause,
  MessageSquare,
  Compass,
  Smile,
  Image as ImageIcon,
  MoreVertical,
  X,
  Clock,
  Zap,
  Award,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  RefreshCw,
  PhoneCall,
  Video,
  Search,
  Mail,
  Newspaper,
  Coins,
  Settings,
  Sliders,
  Bot,
  Key,
  LogOut,
  CheckCheck,
  Filter,
  Camera,
  Film,
  UserCheck,
  UserPlus,
  Phone,
  Bell,
  Minimize2,
  QrCode,
  Paperclip,
  Smartphone
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  age: number;
  gender: "Woman" | "Man";
  targetInterest: "Man" | "Woman" | "All";
  city: string;
  country: string;
  distanceKm: number;
  avatarUrl: string;
  galleryUrls: string[];
  photoCount: number;
  videoCount: number;
  bio: string;
  profession: string;
  verified: boolean;
  online: boolean;
  matchScore: number;
  ambition: string;
  timeAssetPreference: string;
  intent: string;
  aesthetics: string[];
  greetingMessage: string;
}

interface DatingMessage {
  id: string;
  sender: "user" | "partner" | "divider";
  text: string;
  time: string;
  read?: boolean;
}

interface DatingConversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAge?: number;
  partnerAvatar: string;
  online: boolean;
  unreadCount: number;
  lastMessageTime: string;
  lastMessageText: string;
  statusTag?: string;
  matchBadge?: string;
  mutualPopup?: boolean;
  messages: DatingMessage[];
}

// Sample Profile Roster for AI Matchmaker and Search view
const SAMPLE_SEARCH_PROFILES: Profile[] = [
  {
    id: "da-elena",
    name: "Elena Rostova",
    age: 26,
    gender: "Woman",
    targetInterest: "Man",
    city: "Milan",
    country: "Italy",
    distanceKm: 3.5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"],
    photoCount: 24,
    videoCount: 3,
    bio: "Luxury fashion buyer & opera enthusiast in Milan. Passionate about architecture, wine tasting, and spontaneous travel.",
    profession: "Luxury Fashion Buyer",
    verified: true,
    online: true,
    matchScore: 99,
    ambition: "High - Driven",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Italian Fashion", "Opera", "Tuscan Wine"],
    greetingMessage: "Ciao! AI Matchmaker connected us with 99% chemistry. Loved your profile! How are you doing today?"
  },
  {
    id: "da-marcus",
    name: "Marcus Vance",
    age: 29,
    gender: "Man",
    targetInterest: "Woman",
    city: "London",
    country: "United Kingdom",
    distanceKm: 6.2,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"],
    photoCount: 18,
    videoCount: 2,
    bio: "Venture capital investor & competitive rower. Seeking intelligent conversation and shared ambitions.",
    profession: "Venture Capitalist",
    verified: true,
    online: true,
    matchScore: 97,
    ambition: "High - Visionary",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Tech VC", "Rowing", "Fine Dining"],
    greetingMessage: "Hello from London! Great to meet you. Loved your answers in the matchmaking quiz."
  },
  {
    id: "da-adesuwa",
    name: "Adesuwa Okonkwo",
    age: 27,
    gender: "Woman",
    targetInterest: "Man",
    city: "Lagos",
    country: "Nigeria",
    distanceKm: 4.2,
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"],
    photoCount: 22,
    videoCount: 2,
    bio: "Fintech product lead & contemporary African art collector. Passionate about innovation, live jazz, and deep connection.",
    profession: "Fintech Product Lead",
    verified: true,
    online: true,
    matchScore: 98,
    ambition: "High - Driven",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Contemporary Art", "African Fine Dining", "Tech Innovation"],
    greetingMessage: "Hello! Good afternoon from Lagos! Loved your profile. How is your day coming along?"
  },
  {
    id: "da-sothea",
    name: "Sothea Vanna",
    age: 25,
    gender: "Woman",
    targetInterest: "Man",
    city: "Phnom Penh",
    country: "Cambodia",
    distanceKm: 5.1,
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"],
    photoCount: 16,
    videoCount: 1,
    bio: "Architect & social entrepreneur preserving Southeast Asian heritage design. Coffee lover and slow travel advocate.",
    profession: "Architectural Designer",
    verified: true,
    online: true,
    matchScore: 97,
    ambition: "Creative & Purposeful",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Khmer Heritage Architecture", "Specialty Coffee", "Riverside Sunsets"],
    greetingMessage: "Choum reap sour! Hello from Phnom Penh! I loved your profile answers. Have you ever visited Cambodia?"
  },
  {
    id: "da-kofi",
    name: "Kofi Mensah",
    age: 31,
    gender: "Man",
    targetInterest: "Woman",
    city: "Accra",
    country: "Ghana",
    distanceKm: 8.5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"],
    photoCount: 19,
    videoCount: 1,
    bio: "Renewable energy founder & afro-jazz musician. Dedicated to creating sustainable impact and meaningful partnership.",
    profession: "Renewable Energy Founder",
    verified: true,
    online: true,
    matchScore: 96,
    ambition: "High - Visionary",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Clean Tech", "Afro Jazz", "Coastal Resorts"],
    greetingMessage: "Akwaaba! Great to connect with you. Looking for someone who values loyalty, great music, and ambition."
  },
  {
    id: "da-thithanh",
    name: "Thi Thanh Thao",
    age: 26,
    gender: "Woman",
    targetInterest: "Man",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    distanceKm: 3.8,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"],
    photoCount: 14,
    videoCount: 2,
    bio: "E-commerce strategist & food critic. Exploring hidden gems across Asia.",
    profession: "E-commerce Strategy Lead",
    verified: true,
    online: true,
    matchScore: 97,
    ambition: "High - Ambitious",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Culinary Exploration", "Modern Architecture", "High Tea"],
    greetingMessage: "Xin chào! So wonderful to meet you here."
  },
  {
    id: "da-carlos",
    name: "Carlos Mendoza",
    age: 28,
    gender: "Man",
    targetInterest: "Woman",
    city: "Madrid",
    country: "Spain",
    distanceKm: 4.8,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"],
    photoCount: 15,
    videoCount: 1,
    bio: "Industrial designer & flamenco enthusiast. Passionate about minimalist aesthetics and warm sunset conversations.",
    profession: "Industrial Design Lead",
    verified: true,
    online: true,
    matchScore: 98,
    ambition: "Creative & Driven",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Flamenco", "Spanish Tapas", "Minimalist Design"],
    greetingMessage: "Hola! Delighted to connect with you. What is your favorite weekend escape?"
  },
  {
    id: "da-maria",
    name: "Maria De Los Angeles",
    age: 23,
    gender: "Woman",
    targetInterest: "Man",
    city: "Los Angeles",
    country: "United States",
    distanceKm: 1.8,
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"],
    photoCount: 18,
    videoCount: 1,
    bio: "Fashion design student & digital creator. Looking for someone genuine and fun to explore coastal cafes with.",
    profession: "Fashion Designer & Creator",
    verified: true,
    online: true,
    matchScore: 99,
    ambition: "High - Creative",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["High Fashion", "Sunset Cafe", "Ocean Drive"],
    greetingMessage: "maybe it's time to say hi? I loved your profile!"
  },
  {
    id: "da-luciano",
    name: "Luciano Vercelli",
    age: 32,
    gender: "Man",
    targetInterest: "Woman",
    city: "Rome",
    country: "Italy",
    distanceKm: 14.2,
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80"],
    photoCount: 14,
    videoCount: 0,
    bio: "Restaurateur & sommelier. Life is best enjoyed with fine wine, great laughter, and warm company.",
    profession: "Executive Chef & Restaurateur",
    verified: true,
    online: true,
    matchScore: 95,
    ambition: "Passionate",
    timeAssetPreference: "No, I take my time",
    intent: "Romance",
    aesthetics: ["Culinary Arts", "Tuscan Vineyard", "Jazz"],
    greetingMessage: "Ciao! Looking for someone who appreciates authentic taste and meaningful conversations."
  },
  {
    id: "da-daisy",
    name: "Daisy Santos",
    age: 29,
    gender: "Woman",
    targetInterest: "Man",
    city: "Manila",
    country: "Philippines",
    distanceKm: 6.5,
    avatarUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"],
    photoCount: 11,
    videoCount: 1,
    bio: "Travel vlogger & beach enthusiast. Sunshine, good food, and positive energy always.",
    profession: "Content Producer & Travel Vlogger",
    verified: true,
    online: true,
    matchScore: 97,
    ambition: "High - Ambitious",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Tropical Islands", "Photography", "Sunset Views"],
    greetingMessage: "Hi there! I saw your profile and had to say hello. Where is your favorite beach destination?"
  },
  {
    id: "da-kenji",
    name: "Kenji Sato",
    age: 30,
    gender: "Man",
    targetInterest: "Woman",
    city: "Tokyo",
    country: "Japan",
    distanceKm: 9.8,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"],
    photoCount: 16,
    videoCount: 2,
    bio: "Game studio director & matcha connoisseur. Combining technology with artistic storytelling.",
    profession: "Game Studio Director",
    verified: true,
    online: true,
    matchScore: 98,
    ambition: "High - Creative",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Tokyo Neon", "Matcha Tea", "Digital Art"],
    greetingMessage: "Konnichiwa! The AI matchmaker highlighted our shared creative values. Excited to chat!"
  },
  {
    id: "da-chloe",
    name: "Chloe Dubois",
    age: 25,
    gender: "Woman",
    targetInterest: "Man",
    city: "Paris",
    country: "France",
    distanceKm: 5.2,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"],
    photoCount: 20,
    videoCount: 1,
    bio: "Contemporary gallery curator & vintage cinema lover in Paris.",
    profession: "Art Curator",
    verified: true,
    online: true,
    matchScore: 98,
    ambition: "Creative",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Parisian Cafes", "Art Galleries", "French Cinema"],
    greetingMessage: "Bonjour! So happy the AI paired us together. How is your day going?"
  },
  {
    id: "da-cristina",
    name: "Cristina Rosana",
    age: 34,
    gender: "Woman",
    targetInterest: "Man",
    city: "Barcelona",
    country: "Spain",
    distanceKm: 9.3,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"],
    photoCount: 31,
    videoCount: 0,
    bio: "Corporate attorney & interior decor lover. Elegance is the only beauty that never fades.",
    profession: "Senior Corporate Partner",
    verified: true,
    online: true,
    matchScore: 96,
    ambition: "Driven",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Interior Design", "Spanish Art", "Fine Dining"],
    greetingMessage: "Hola! What is your favorite way to unwind after a busy week?"
  },
  {
    id: "da-victor",
    name: "Victor Eduardo",
    age: 33,
    gender: "Man",
    targetInterest: "Woman",
    city: "Lisbon",
    country: "Portugal",
    distanceKm: 7.1,
    avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80"],
    photoCount: 17,
    videoCount: 2,
    bio: "Tech founder & jazz trumpeter. Seeking a true companion for wine, travel, and grand dreams.",
    profession: "Tech Founder",
    verified: true,
    online: true,
    matchScore: 99,
    ambition: "High - Visionary",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Jazz Trumpet", "Lisbon Sunsets", "Startups"],
    greetingMessage: "Olá! Delighted to connect. The AI matchmaker flagged our chemistry at 99%!"
  },
  {
    id: "da-volodymyr",
    name: "Volodymyr",
    age: 49,
    gender: "Man",
    targetInterest: "Woman",
    city: "Kyiv",
    country: "Ukraine",
    distanceKm: 15.6,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"],
    photoCount: 23,
    videoCount: 2,
    bio: "Tech director & chess master. Valuing truth, loyalty, and deep romantic bond.",
    profession: "Software Engineering Director",
    verified: true,
    online: true,
    matchScore: 95,
    ambition: "High - Focused",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Chess Strategy", "Modern Tech", "Mountain Hiking"],
    greetingMessage: "Hello! A match built on shared values is the strongest bond. Pleased to meet you."
  },
  {
    id: "da-elena",
    name: "Elena Rostova",
    age: 26,
    gender: "Woman",
    targetInterest: "Man",
    city: "Monaco",
    country: "Monaco",
    distanceKm: 3.2,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"],
    photoCount: 15,
    videoCount: 1,
    bio: "Architecture consultant & art collector. I value ambition, deep conversations, and spontaneous weekend trips to Geneva.",
    profession: "Senior Architectural Director",
    verified: true,
    online: true,
    matchScore: 98,
    ambition: "High - Driven",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Elegance", "Luxury Architecture", "Fine Dining"],
    greetingMessage: "Hello! I noticed we share similar standards regarding time and ambition. How is your evening going?"
  }
];

export function DatingArtsMatchmakingSuite() {
  // Main Suite Navigation Mode
  const [suiteView, setSuiteView] = useState<"portal" | "quiz" | "admin">("portal");

  // Portal Sub-Navigation Tabs
  const [portalTab, setPortalTab] = useState<"messages" | "search" | "mail" | "newsfeed" | "people" | "credits">("messages");

  // Profiles Grid Filter State
  const [searchCategory, setSearchCategory] = useState<"all" | "online" | "following">("following");

  // User Auth & Session State
  const [userEmail, setUserEmail] = useState<string>("kansasnelly@gmail.com");
  const [userPassword, setUserPassword] = useState<string>("••••••••");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(3250);
  const [showCoinsModal, setShowCoinsModal] = useState<boolean>(false);

  // Real Member Registration Modal State
  const [showRegisterRealModal, setShowRegisterRealModal] = useState<boolean>(false);
  const [realForm, setRealForm] = useState({
    name: "",
    age: "26",
    gender: "Woman" as "Woman" | "Man",
    city: "Los Angeles",
    country: "United States",
    phone: "+1 (310) 849-2091",
    whatsapp: "+1 (310) 849-2091",
    telegram: "@real_member",
    email: "",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: "Real verified member in DatingArts live ecosystem."
  });
  const [isSubmittingReal, setIsSubmittingReal] = useState<boolean>(false);

  // Conversations State
  const [conversations, setConversations] = useState<DatingConversation[]>([
    {
      id: "c-thithanh",
      partnerId: "da-thithanh",
      partnerName: "Thi Thanh Thao",
      partnerAge: 26,
      partnerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      online: true,
      unreadCount: 0,
      lastMessageTime: "6:20 pm",
      lastMessageText: "what day is it on you?",
      messages: [
        { id: "m1", sender: "partner", text: "Sorry, you said you work from home?", time: "6:15 pm" },
        { id: "m2", sender: "user", text: "yeah", time: "6:15 pm", read: true },
        { id: "m3", sender: "partner", text: "I wonder what you do?", time: "6:16 pm" },
        { id: "m4", sender: "user", text: "hahahaha", time: "6:17 pm", read: true },
        { id: "m5", sender: "user", text: "you are very funny", time: "6:17 pm", read: true },
        { id: "m6", sender: "user", text: "what do you think i day ?", time: "6:17 pm", read: true },
        { id: "m7", sender: "divider", text: "Unread message", time: "" },
        { id: "m8", sender: "partner", text: "Why am I funny and what is your day like?", time: "6:18 pm" },
        { id: "m9", sender: "user", text: "no dear you are not funny just that what you said was funny", time: "6:19 pm", read: true },
        { id: "m10", sender: "partner", text: "what day is it on you?", time: "6:20 pm" }
      ]
    },
    {
      id: "c-sara",
      partnerId: "da-sara",
      partnerName: "Sara Alejandra",
      partnerAge: 27,
      partnerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      online: true,
      unreadCount: 1,
      lastMessageTime: "6:19 pm",
      lastMessageText: "nope never been married ...",
      messages: [
        { id: "sm1", sender: "partner", text: "Hi! How are you doing today?", time: "6:14 pm" },
        { id: "sm2", sender: "user", text: "Have you ever been married?", time: "6:18 pm", read: true },
        { id: "sm3", sender: "partner", text: "nope never been married ...", time: "6:19 pm" }
      ]
    },
    {
      id: "c-deborah",
      partnerId: "da-deborah",
      partnerName: "Deborah",
      partnerAge: 29,
      partnerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      online: true,
      unreadCount: 1,
      lastMessageTime: "6:19 pm",
      lastMessageText: "Hi! Glad you like the profil...",
      messages: [
        { id: "dm1", sender: "partner", text: "Hi! Glad you like the profile. What caught your eye?", time: "6:19 pm" }
      ]
    },
    {
      id: "c-samantha",
      partnerId: "da-samantha",
      partnerName: "Samantha Natally",
      partnerAge: 28,
      partnerAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      online: true,
      unreadCount: 0,
      lastMessageTime: "6:17 pm",
      lastMessageText: "That's good, sweetheart, who a...",
      messages: [
        { id: "sam1", sender: "partner", text: "That's good, sweetheart, who are you spending your evening with?", time: "6:17 pm" }
      ]
    },
    {
      id: "c-endang",
      partnerId: "da-endang",
      partnerName: "Endang",
      partnerAge: 53,
      partnerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      online: true,
      unreadCount: 0,
      lastMessageTime: "6:13 pm",
      lastMessageText: "You: 👍 Liked a post",
      matchBadge: "Matched 💜",
      mutualPopup: true,
      messages: [
        { id: "em1", sender: "user", text: "You: 👍 Liked a post", time: "6:13 pm", read: true },
        { id: "em2", sender: "partner", text: "Your feelings are mutual! Excited to chat with you.", time: "6:13 pm" }
      ]
    },
    {
      id: "c-iryna",
      partnerId: "da-iryna",
      partnerName: "Iryna",
      partnerAge: 25,
      partnerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
      online: true,
      unreadCount: 0,
      lastMessageTime: "6:13 pm",
      lastMessageText: "❗️ ONLY FOR YOUR EYES ❗️ Say “...",
      messages: [
        { id: "im1", sender: "partner", text: "❗️ ONLY FOR YOUR EYES ❗️ Say “Hi” to unlock our private gallery photos!", time: "6:13 pm" }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState<string>("c-thithanh");
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "active" | "requests">("all");
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // AI Social Outreach & Global Phone Number Hunter Engine State
  const [selectedHunterRegion, setSelectedHunterRegion] = useState<string>("US");
  const [aiHunterLogs, setAiHunterLogs] = useState<string[]>([
    "🔍 [AI Phone Hunter] Searching active US (+1) & International numbers across Telegram, WhatsApp & TikTok...",
    "📲 [Telegram AI Bot] Sent request to +1 (310) 849-2091 (@sophia_la) in Los Angeles -> Active!",
    "💬 [WhatsApp AI] Connected with +1 (415) 582-9910 (@david_sf) in San Francisco -> Mingle Ready!",
    "🎬 [TikTok Engine] Outreached to +44 7911 123456 (@chloe_london) -> Request Received!"
  ]);

  // Social Requests Queue (Telegram, WhatsApp, TikTok, YouTube, Instagram)
  const [socialRequests, setSocialRequests] = useState<Array<{
    id: string;
    name: string;
    age: number;
    city: string;
    country: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    avatarUrl: string;
    platform: "Telegram" | "WhatsApp" | "TikTok" | "YouTube" | "Instagram";
    handle: string;
    status: "pending" | "accepted";
    time: string;
    greeting: string;
  }>>([
    {
      id: "req-1",
      name: "Sophia Vance",
      age: 24,
      city: "Los Angeles",
      country: "USA 🇺🇸",
      phone: "+1 (310) 849-2091",
      whatsapp: "+13108492091",
      telegram: "@sophia_la",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
      platform: "Telegram",
      handle: "@sophia_la",
      status: "pending",
      time: "2m ago",
      greeting: "Hi! Received your AI Telegram match request. Let's chat!"
    },
    {
      id: "req-2",
      name: "Lucas Dupont",
      age: 27,
      city: "Paris",
      country: "France 🇫🇷",
      phone: "+33 6 12 34 56 78",
      whatsapp: "+33612345678",
      telegram: "@lucas_paris",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      platform: "WhatsApp",
      handle: "+33 6 12 34 56 78",
      status: "pending",
      time: "5m ago",
      greeting: "Bonjour! Matched via WhatsApp Outreach Bridge. Ready to mingle!"
    },
    {
      id: "req-3",
      name: "Amara Adeleke",
      age: 23,
      city: "Lagos",
      country: "Nigeria 🇳🇬",
      phone: "+234 803 412 9910",
      whatsapp: "+2348034129910",
      telegram: "@amina_lagos",
      avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
      platform: "TikTok",
      handle: "@amara_vibe",
      status: "pending",
      time: "8m ago",
      greeting: "Saw your profile on TikTok AI Matchmaker link! Let me join!"
    },
    {
      id: "req-4",
      name: "Kenji Sato",
      age: 26,
      city: "Tokyo",
      country: "Japan 🇯🇵",
      phone: "+81 90 1234 5678",
      whatsapp: "+819012345678",
      telegram: "@kenji_tokyo",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      platform: "YouTube",
      handle: "@kenji_creator",
      status: "pending",
      time: "12m ago",
      greeting: "Konnichiwa! Joined from YouTube Live Stream invitation."
    }
  ]);

  // Google / Gmail Quick Authentication State
  const [googleAuthUser, setGoogleAuthUser] = useState<{
    authenticated: boolean;
    email: string;
    name: string;
    picture: string;
  }>({
    authenticated: true,
    email: "kansasnelly@gmail.com",
    name: "Kansas Nelly",
    picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  });

  // Telegram / WhatsApp Profile Modal State
  const [showTelegramProfileModal, setShowTelegramProfileModal] = useState<boolean>(false);
  const [userProfileBio, setUserProfileBio] = useState<string>("Active Ecosystem Member | Verified via Gmail (kansasnelly@gmail.com)");
  const [userCustomPhoto, setUserCustomPhoto] = useState<string>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Accept Social Request & Move to Active Marketplace + Love Chat
  const handleAcceptSocialRequest = (reqId: string) => {
    const request = socialRequests.find(r => r.id === reqId);
    if (!request) return;

    // Update request status
    setSocialRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "accepted" } : r));

    // Check if conversation exists or add it
    const convId = "c-" + request.id;
    setConversations(prev => {
      const exists = prev.some(c => c.id === convId);
      if (!exists) {
        const freshConv = {
          id: convId,
          partnerId: request.id,
          partnerName: request.name,
          partnerAge: request.age,
          partnerAvatar: request.avatarUrl,
          online: true,
          unreadCount: 1,
          lastMessageTime: "Just now",
          lastMessageText: request.greeting,
          messages: [
            {
              id: "msg-" + Date.now(),
              sender: "partner" as const,
              text: request.greeting,
              time: "Just now"
            }
          ]
        };
        return [freshConv, ...prev];
      }
      return prev;
    });

    // Notify backend
    fetch("/api/datingarts/social-outreach-dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: request.platform,
        region: request.country,
        phone: request.phone,
        handle: request.handle
      })
    }).catch(() => {});

    setToastMessage(`✨ Accepted ${request.name}'s ${request.platform} request! Moved to Active & Love Section.`);
    setTimeout(() => setToastMessage(null), 3500);

    // Open active conversation and switch to All tab (Love Section)
    setActiveConvId(convId);
    setActiveFilterTab("all");
  };

  // Trigger AI Phone Hunter Search for US & Global Numbers
  const handleTriggerAiPhoneHunter = () => {
    const phonePrefixes: Record<string, { country: string; flag: string; cities: string[]; code: string }> = {
      US: { country: "USA", flag: "🇺🇸", cities: ["Los Angeles", "New York", "Miami", "San Francisco", "Chicago"], code: "+1" },
      UK: { country: "UK", flag: "🇬🇧", cities: ["London", "Manchester", "Birmingham"], code: "+44" },
      EU: { country: "France", flag: "🇫🇷", cities: ["Paris", "Nice", "Lyon"], code: "+33" },
      JP: { country: "Japan", flag: "🇯🇵", cities: ["Tokyo", "Osaka", "Kyoto"], code: "+81" },
      NG: { country: "Nigeria", flag: "🇳🇬", cities: ["Lagos", "Abuja", "Port Harcourt"], code: "+234" }
    };

    const targetRegion = phonePrefixes[selectedHunterRegion] || phonePrefixes.US;
    const randomCity = targetRegion.cities[Math.floor(Math.random() * targetRegion.cities.length)];
    const phone = `${targetRegion.code} (${Math.floor(200 + Math.random() * 700)}) ${Math.floor(100 + Math.random() * 800)}-${Math.floor(1000 + Math.random() * 8000)}`;

    const names = ["Marcus Vance", "Elena Rostova", "Sothea Vanna", "Daisy Mendoza", "Chloe Bennett", "Daniel Kim", "Amara Jackson", "Kofi Mensah"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const platforms = ["Telegram", "WhatsApp", "TikTok", "YouTube"] as const;
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const handle = `@${randomName.toLowerCase().replace(/\s+/g, "_")}_${targetRegion.code.replace("+", "")}`;

    const newReq = {
      id: "req-" + Date.now(),
      name: randomName,
      age: Math.floor(21 + Math.random() * 10),
      city: randomCity,
      country: `${targetRegion.country} ${targetRegion.flag}`,
      phone,
      whatsapp: phone,
      telegram: handle,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000000)}?auto=format&fit=crop&w=400&q=80`,
      platform,
      handle,
      status: "pending" as const,
      time: "Just now",
      greeting: `Hello from ${randomCity}! AI Hunter found my ${platform} number (${phone}). Excited to connect!`
    };

    setSocialRequests(prev => [newReq, ...prev]);
    setAiHunterLogs(prev => [
      `🎯 [AI Hunter] Found active ${targetRegion.flag} number ${phone} (${randomName}) on ${platform}! Sent invitation request.`,
      ...prev.slice(0, 8)
    ]);

    setToastMessage(`⚡ AI Hunter dispatched request to ${randomName} (${phone}) via ${platform}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Embedded WhatsApp Web Suite Modal State
  const [showEmbeddedWhatsappModal, setShowEmbeddedWhatsappModal] = useState<boolean>(false);
  const [whatsappSearchText, setWhatsappSearchText] = useState<string>("");
  const [whatsappInputText, setWhatsappInputText] = useState<string>("");
  const [showWhatsappQrModal, setShowWhatsappQrModal] = useState<boolean>(false);

  // AI Autonomous Matchmaker Drop-down Popup System
  const [aiMatchIntervalSec, setAiMatchIntervalSec] = useState<number>(60);
  const [matchCountdown, setMatchCountdown] = useState<number>(60);
  const [aiAutoMatchmakerEnabled, setAiAutoMatchmakerEnabled] = useState<boolean>(true);
  const [showAiMatchPopup, setShowAiMatchPopup] = useState<boolean>(true);
  const [isAiDropMinimized, setIsAiDropMinimized] = useState<boolean>(false);
  const [aiDropTab, setAiDropTab] = useState<"match" | "notifications">("match");
  const [aiMatchDropIndex, setAiMatchDropIndex] = useState<number>(0);

  const [aiNotifications, setAiNotifications] = useState<Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: "match" | "email" | "coin" | "message";
  }>>([
    {
      id: "n1",
      title: "⚡ AI Synergy Matchmaker Drop",
      description: "Elena Rostova (Milan, Italy) joined ecosystem with 99% chemistry score.",
      time: "Just now",
      type: "match"
    },
    {
      id: "n2",
      title: "📧 Gmail & Mail.com Active",
      description: "Email Suite synchronized & authenticated in ecosystem.",
      time: "2m ago",
      type: "email"
    },
    {
      id: "n3",
      title: "🪙 Free Daily Credit Added",
      description: "200 coins issued to your wallet balance.",
      time: "10m ago",
      type: "coin"
    }
  ]);
  
  // Current Dropdown Match state
  const [currentDropMatch, setCurrentDropMatch] = useState<{
    id: string;
    name: string;
    age: number;
    avatarUrl: string;
    online: boolean;
    tagline: string;
    score: number;
    isRealPerson?: boolean;
    phone?: string;
    whatsapp?: string;
    verifiedBadge?: string;
  }>({
    id: "da-elena",
    name: "Elena Rostova",
    age: 26,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    online: true,
    tagline: "Ciao! AI Matchmaker connected us with 99% chemistry 💜",
    score: 99,
    isRealPerson: true,
    phone: "+39 02 612 3456",
    whatsapp: "+39 02 612 3456",
    verifiedBadge: "Real Verified Ecosystem Member"
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Real Member Form Submission
  const handleRegisterRealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!realForm.name || !realForm.email) {
      setToastMessage("⚠️ Please provide at least a Name and Email.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSubmittingReal(true);
    try {
      const res = await fetch("/api/datingarts/register-real-person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(realForm)
      });
      const data = await res.json();
      setIsSubmittingReal(false);

      if (data.success && data.profile) {
        setShowRegisterRealModal(false);
        const p = data.profile;

        // Add to search profiles
        SAMPLE_SEARCH_PROFILES.unshift({
          id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender,
          targetInterest: p.targetInterest,
          city: p.city,
          country: p.country,
          distanceKm: p.distanceKm,
          avatarUrl: p.avatarUrl,
          galleryUrls: p.galleryUrls,
          photoCount: 12,
          videoCount: 1,
          bio: p.bio,
          profession: p.profession,
          verified: true,
          online: true,
          matchScore: 99,
          ambition: p.ambition,
          timeAssetPreference: p.timeAssetPreference,
          intent: p.intent,
          aesthetics: p.aesthetics,
          greetingMessage: p.greetingMessage
        });

        // Trigger 1-Click Match
        handle1ClickSynergyMatch(p.id, p.name);
        setToastMessage(`🎉 ${p.name} registered as Real Verified Member!`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      setIsSubmittingReal(false);
      console.error("Error registering real member:", err);
    }
  };

  // 1-Click Synergy Matchmaker Execution
  const handle1ClickSynergyMatch = async (profileId: string, profileName: string) => {
    try {
      const res = await fetch("/api/datingarts/synergy-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetProfileId: profileId })
      });
      const data = await res.json();

      if (data.success && data.conversation) {
        const conv = data.conversation;
        setConversations(prev => {
          const exists = prev.some(c => c.id === conv.id);
          if (exists) {
            return prev.map(c => c.id === conv.id ? conv : c);
          }
          return [conv, ...prev];
        });
        setActiveConvId(conv.id);
        setPortalTab("messages");
        setShowAiMatchPopup(false);
        setToastMessage(`✨ AI Synergy Matchmaker paired you with ${profileName}!`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error("Synergy match failed:", err);
    }
  };

  // Admin State
  const [adminOverrideText, setAdminOverrideText] = useState<string>("");
  const [adminSenderRole, setAdminSenderRole] = useState<"user" | "partner">("partner");

  // Onboarding Quiz state
  const [selectedAge, setSelectedAge] = useState<string>("25-34");
  const [selectedGender, setSelectedGender] = useState<"Woman" | "Man">("Man");
  const [targetInterest, setTargetInterest] = useState<"Woman" | "Man">("Woman");
  const [intent, setIntent] = useState<string>("Romance");
  const [timeAsset, setTimeAsset] = useState<string>("Yes, efficiency");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // AI Autonomous Matchmaker Timer Engine
  useEffect(() => {
    if (!aiAutoMatchmakerEnabled) return;

    const timer = setInterval(() => {
      setMatchCountdown(prev => {
        if (prev <= 1) {
          triggerRandomAiMatchDrop();
          return aiMatchIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [aiAutoMatchmakerEnabled, aiMatchIntervalSec]);

  // Function to trigger a fresh AI match dropdown notification
  const triggerRandomAiMatchDrop = () => {
    // Cycle sequentially through SAMPLE_SEARCH_PROFILES using index so every match drop shows a DIFFERENT profile & photo!
    setAiMatchDropIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % SAMPLE_SEARCH_PROFILES.length;
      const profile = SAMPLE_SEARCH_PROFILES[nextIndex];

      const taglines = [
        "maybe it's time to say hi?",
        "Your feelings are mutual 💜",
        "AI Matchmaker: 99% Chemistry Match",
        "Online now! Looking for real conversation.",
        "Matches your ambition & timing preferences",
        `Spontaneous chemistry from ${profile.city} ✈️`
      ];
      const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

      setCurrentDropMatch({
        id: profile.id,
        name: profile.name,
        age: profile.age,
        avatarUrl: profile.avatarUrl,
        online: profile.online,
        tagline: randomTagline,
        score: profile.matchScore,
        isRealPerson: true,
        verifiedBadge: "Real Verified Ecosystem Member"
      });

      // Automatically add/update them in conversations so they immediately appear in chat sidebar & Admin monitor!
      const newConvId = "c-" + profile.id.replace("da-", "");
      setConversations(prev => {
        const exists = prev.some(c => c.id === newConvId || c.partnerId === profile.id);
        if (!exists) {
          const freshConv = {
            id: newConvId,
            partnerId: profile.id,
            partnerName: profile.name,
            partnerAge: profile.age,
            partnerAvatar: profile.avatarUrl,
            online: true,
            unreadCount: 1,
            lastMessageTime: "Just now",
            lastMessageText: profile.greetingMessage || "Hello! So happy the AI paired us together.",
            messages: [
              {
                id: "msg-" + Date.now(),
                sender: "partner" as const,
                text: profile.greetingMessage || "Hello! So happy the AI paired us together.",
                time: "Just now"
              }
            ]
          };
          return [freshConv, ...prev];
        }
        return prev;
      });

      // Push notification item
      setAiNotifications(prev => [
        {
          id: "notif-" + Date.now(),
          title: `⚡ New Match: ${profile.name}`,
          description: `AI Matchmaker brought ${profile.name} (${profile.city}, ${profile.country}) into ecosystem.`,
          time: "Just now",
          type: "match"
        },
        ...prev
      ]);

      setShowAiMatchPopup(true);
      return nextIndex;
    });
  };

  // Fetch initial conversations from backend
  useEffect(() => {
    fetch("/api/datingarts/conversations")
      .then(res => res.json())
      .then(data => {
        if (data && data.conversations && data.conversations.length > 0) {
          setConversations(data.conversations);
        }
        if (data && data.session) {
          setUserEmail(data.session.email || "kansasnelly@gmail.com");
          setCredits(data.session.credits || 3250);
        }
      })
      .catch(err => console.error("Error loading DatingArts conversations:", err));
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (portalTab === "messages") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeConvId, isTyping, portalTab]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/datingarts/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password: userPassword })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(true);
          setShowLoginModal(false);
          if (data.session) {
            setCredits(data.session.credits);
          }
        }
      })
      .catch(err => console.error("Login failed:", err));
  };

  // Action to start/open chat from AI Match Dropdown or Profile Card
  const handleStartChatFromMatch = (matchProfile: {
    id: string;
    name: string;
    age: number;
    avatarUrl: string;
    online: boolean;
  }) => {
    setShowAiMatchPopup(false);

    // Check if conversation already exists
    const existingIndex = conversations.findIndex(c => c.partnerName.toLowerCase() === matchProfile.name.toLowerCase());

    if (existingIndex !== -1) {
      setActiveConvId(conversations[existingIndex].id);
    } else {
      // Create new active chat session inside ecosystem
      const newConvId = "c-" + matchProfile.id;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
      
      const newConv: DatingConversation = {
        id: newConvId,
        partnerId: matchProfile.id,
        partnerName: matchProfile.name,
        partnerAge: matchProfile.age,
        partnerAvatar: matchProfile.avatarUrl,
        online: matchProfile.online,
        unreadCount: 1,
        lastMessageTime: timeStr,
        lastMessageText: "maybe it's time to say hi?",
        matchBadge: "AI Match 💜",
        messages: [
          {
            id: "m-init-1",
            sender: "partner",
            text: `Hi ${userEmail.split('@')[0]}! The AI Matchmaker matched us with 99% compatibility. maybe it's time to say hi?`,
            time: timeStr
          }
        ]
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(newConvId);
    }

    // Switch view directly to Messages chat room
    setPortalTab("messages");
    setToastMessage(`✨ Connected with ${matchProfile.name}! Ecosystem session active.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const msgText = inputText.trim();
    setInputText("");

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();

    // Optimistic user update
    const userMsg: DatingMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: msgText,
      time: timeStr,
      read: true
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessageText: "You: " + msgText,
            lastMessageTime: timeStr,
            messages: [...c.messages, userMsg]
          };
        }
        return c;
      })
    );

    setIsTyping(true);

    try {
      const res = await fetch("/api/datingarts/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          text: msgText
        })
      });
      const data = await res.json();
      setIsTyping(false);

      const reply = data.partnerReply || data.replyMessage;
      if (data.success && reply) {
        setConversations(prev =>
          prev.map(c => {
            if (c.id === activeConvId) {
              return {
                ...c,
                lastMessageText: reply.text,
                lastMessageTime: reply.time,
                messages: [...c.messages, reply]
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error("Failed sending message:", err);
      setIsTyping(false);
    }
  };

  const handleAdminOverride = async () => {
    if (!adminOverrideText.trim()) return;
    try {
      const res = await fetch("/api/datingarts/admin/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          sender: adminSenderRole,
          text: adminOverrideText
        })
      });
      const data = await res.json();
      if (data.success && data.addedMessage) {
        setConversations(prev =>
          prev.map(c => {
            if (c.id === activeConvId) {
              return {
                ...c,
                lastMessageText: data.addedMessage.text,
                lastMessageTime: data.addedMessage.time,
                messages: [...c.messages, data.addedMessage]
              };
            }
            return c;
          })
        );
        setAdminOverrideText("");
      }
    } catch (err) {
      console.error("Admin override error:", err);
    }
  };

  const toggleAiMatchmaker = async () => {
    try {
      const nextState = !aiAutoMatchmakerEnabled;
      const res = await fetch("/api/datingarts/admin/toggle-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: nextState })
      });
      const data = await res.json();
      if (data.success) {
        setAiAutoMatchmakerEnabled(data.aiAutoMatchmakerEnabled);
      }
    } catch (err) {
      console.error("Toggle AI matchmaker failed:", err);
      setAiAutoMatchmakerEnabled(!aiAutoMatchmakerEnabled);
    }
  };

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#eceff1] text-stone-900 flex flex-col font-sans select-none antialiased relative">
      {/* ECOSYSTEM HEADER MODE SWITCHER TOOLBAR */}
      <div className="bg-stone-900 text-stone-100 px-4 py-2 border-b border-stone-800 flex flex-wrap items-center justify-between text-xs font-medium sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black text-pink-400">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span className="tracking-tight text-sm text-white">Dating<span className="text-pink-400">arts</span></span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 text-[10px] border border-pink-700 font-mono">100% REAL</span>
          </div>

          <div className="h-4 w-px bg-stone-700 mx-1" />

          <button
            onClick={() => setSuiteView("portal")}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer font-bold ${
              suiteView === "portal" ? "bg-pink-600 text-white shadow-md" : "text-stone-300 hover:text-white hover:bg-stone-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>DatingArts Web App</span>
            {totalUnread > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white font-black text-[10px]">{totalUnread}</span>
            )}
          </button>

          <button
            onClick={() => setSuiteView("quiz")}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer font-bold ${
              suiteView === "quiz" ? "bg-amber-600 text-white shadow-md" : "text-stone-300 hover:text-white hover:bg-stone-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>10-Step Questionnaire</span>
          </button>

          <button
            onClick={() => setSuiteView("admin")}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer font-bold ${
              suiteView === "admin" ? "bg-purple-600 text-white shadow-md" : "text-stone-300 hover:text-white hover:bg-stone-800"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span>Admin Console & AI Engine</span>
          </button>
        </div>

        {/* AI Drop Countdown & Trigger Control */}
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <div className="flex items-center gap-1.5 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800 text-purple-200 text-[11px] font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Match Drop: </span>
            <span className="font-bold text-amber-300">{matchCountdown}s</span>
            <button
              onClick={triggerRandomAiMatchDrop}
              title="Force trigger next AI match drop now"
              className="ml-1 px-1.5 py-0.2 bg-purple-700 hover:bg-purple-600 text-white text-[9px] font-sans font-bold rounded cursor-pointer transition"
            >
              ⚡ Drop Now
            </button>
          </div>

          <button
            onClick={() => setShowCoinsModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-950/80 to-stone-800 hover:from-amber-900 hover:to-stone-700 px-2.5 py-1 rounded-md border border-amber-500/40 cursor-pointer transition shadow-sm"
            title="Open Coins & Free Daily Credits Hub"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">{credits} Coins</span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold border border-amber-500/30">+200 FREE</span>
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-md border border-stone-700 text-stone-200 transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-pink-400" />
            <span className="truncate max-w-[140px] font-mono text-[11px]">{userEmail}</span>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1 rounded border border-emerald-800 font-bold">LOGGED IN</span>
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-pink-500/50 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LOGIN & AUTH MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full p-6 text-stone-800 animate-fade-in relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
              </div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">DatingArts Ecosystem Login</h2>
              <p className="text-xs text-stone-500">Sign in with your email and password to open your account chats inside the ecosystem.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="kansasnelly@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm font-medium outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={e => setUserPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm font-medium outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-[11px] text-pink-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-600 shrink-0" />
                <span>Account authenticated for <b>{userEmail}</b>. All messages and credit balances synchronized.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-sm rounded-xl shadow-lg transition cursor-pointer"
              >
                Sign In & Open DatingArts
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER REAL MEMBER PROFILE MODAL */}
      {showRegisterRealModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 text-stone-800 animate-fade-in relative my-8">
            <button
              onClick={() => setShowRegisterRealModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-2 mb-5">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">Register Real Person Profile</h2>
              <p className="text-xs text-stone-500">
                Add real human contacts into the ecosystem. The AI Matchmaker drop will automatically send real member cards and match people with 1-click chatting!
              </p>
            </div>

            <form onSubmit={handleRegisterRealSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={realForm.name}
                    onChange={e => setRealForm({ ...realForm, name: e.target.value })}
                    placeholder="e.g. Maria De Los Angeles"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={realForm.email}
                    onChange={e => setRealForm({ ...realForm, email: e.target.value })}
                    placeholder="maria@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={realForm.age}
                    onChange={e => setRealForm({ ...realForm, age: e.target.value })}
                    placeholder="26"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Gender</label>
                  <select
                    value={realForm.gender}
                    onChange={e => setRealForm({ ...realForm, gender: e.target.value as "Woman" | "Man" })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none bg-white"
                  >
                    <option value="Woman">Woman</option>
                    <option value="Man">Man</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">City & Country</label>
                  <input
                    type="text"
                    value={realForm.city}
                    onChange={e => setRealForm({ ...realForm, city: e.target.value })}
                    placeholder="Los Angeles, USA"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={realForm.whatsapp}
                    onChange={e => setRealForm({ ...realForm, whatsapp: e.target.value, phone: e.target.value })}
                    placeholder="+1 (310) 849-2091"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Telegram Handle</label>
                  <input
                    type="text"
                    value={realForm.telegram}
                    onChange={e => setRealForm({ ...realForm, telegram: e.target.value })}
                    placeholder="@maria_losangeles"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={realForm.avatarUrl}
                    onChange={e => setRealForm({ ...realForm, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Bio & Introduction</label>
                <textarea
                  rows={2}
                  value={realForm.bio}
                  onChange={e => setRealForm({ ...realForm, bio: e.target.value })}
                  placeholder="Real member bio..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-500 text-xs font-medium outline-none resize-none"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <b>Ecosystem Verification</b>: Member will be marked 100% Real Person with verified direct contact buttons.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReal}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmittingReal ? (
                  <span>Registering Real Member...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register Real Member & Start Chat</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 1: PORTAL - EXACT DATINGARTS APPLICATION UI (PIXEL-PERFECT TO SCREENSHOTS 1, 2 & 3) */}
      {suiteView === "portal" && (
        <div className="flex-1 flex flex-col bg-[#f0f2f5] relative">
          {/* DATINGARTS TOP BRAND NAVIGATION BAR (Matching screenshot top nav) */}
          <header className="bg-white border-b border-stone-200 px-6 py-2.5 flex items-center justify-between shadow-sm sticky top-[37px] z-20">
            {/* Logo Left */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSuiteView("portal"); setPortalTab("messages"); }}>
              <span className="font-serif text-2xl font-black text-stone-900 tracking-tight">Dating</span>
              <Heart className="w-5 h-5 fill-pink-600 text-pink-600 -mx-1" />
              <span className="font-serif text-2xl font-black text-pink-600 tracking-tight">arts</span>
            </div>

            {/* Nav Menu Center (Search, Messages, Mail, Newsfeed, People, Credits, Account) */}
            <nav className="flex items-center gap-6 text-stone-600 font-bold text-xs">
              <button
                onClick={() => setPortalTab("search")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition ${
                  portalTab === "search" ? "text-pink-600 border-b-2 border-pink-600 pb-0.5" : "hover:text-pink-600"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>

              <button
                onClick={() => setPortalTab("messages")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition relative ${
                  portalTab === "messages" ? "text-pink-600 border-b-2 border-pink-600 pb-0.5" : "hover:text-pink-600"
                }`}
              >
                <div className="relative">
                  <MessageSquare className="w-4 h-4" />
                  {totalUnread > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {totalUnread}
                    </span>
                  )}
                </div>
                <span>Messages</span>
              </button>

              <button
                onClick={() => setPortalTab("mail")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition ${
                  portalTab === "mail" ? "text-pink-600 border-b-2 border-pink-600 pb-0.5" : "hover:text-pink-600"
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Mail</span>
              </button>

              <button
                onClick={() => setPortalTab("newsfeed")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition ${
                  portalTab === "newsfeed" ? "text-pink-600 border-b-2 border-pink-600 pb-0.5" : "hover:text-pink-600"
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Newsfeed</span>
              </button>

              <button
                onClick={() => setPortalTab("people")}
                className={`flex flex-col items-center gap-1 cursor-pointer transition ${
                  portalTab === "people" ? "text-pink-600 border-b-2 border-pink-600 pb-0.5" : "hover:text-pink-600"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>People</span>
              </button>

              <button
                onClick={() => { setPortalTab("credits"); setShowCoinsModal(true); }}
                className={`flex flex-col items-center gap-1 cursor-pointer transition ${
                  portalTab === "credits" ? "text-pink-600 border-b-2 border-pink-600 pb-0.5" : "hover:text-pink-600"
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Credits</span>
              </button>
            </nav>

            {/* Account dropdown right */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRegisterRealModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register Real Person</span>
              </button>

              <button
                onClick={() => setShowLoginModal(true)}
                className="text-stone-700 hover:text-pink-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Account</span>
                <span>▾</span>
              </button>
            </div>
          </header>

          {/* EMBEDDED DATINGARTS.COM URL ADDRESS BAR */}
          <div className="bg-stone-900 border-b border-stone-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-stone-300 font-mono gap-2 sticky top-[75px] z-20">
            <div className="flex items-center gap-2 flex-1 max-w-2xl bg-stone-950 border border-stone-800 rounded-lg px-3 py-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-400 font-bold">https://</span>
              <span className="text-stone-100 font-bold">datingarts.com</span>
              <span className="text-stone-400">/{portalTab}/{activeConv?.partnerName.toLowerCase().replace(/\s+/g, '-') || 'victor-eduardo'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-sans font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Embedded Application Active
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://datingarts.com/${portalTab}`);
                  setToastMessage("📋 Copied https://datingarts.com URL to clipboard!");
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white"
                title="Copy URL"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SUB-VIEW 1: PROFILES SEARCH VIEW (Matching Screenshot 3 datingarts.com/search/following) */}
          {portalTab === "search" && (
            <div className="max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
              {/* Left & Center Grid (9 Columns) */}
              <div className="lg:col-span-9 space-y-6">
                {/* Search Bar / Filter Header (Profiles All | Online | Following) */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-stone-900 tracking-tight">Profiles</h2>
                    <div className="flex items-center bg-stone-100 p-1 rounded-full text-xs font-bold text-stone-600">
                      <button
                        onClick={() => setSearchCategory("all")}
                        className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                          searchCategory === "all" ? "bg-pink-600 text-white shadow-sm" : "hover:text-stone-900"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setSearchCategory("online")}
                        className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                          searchCategory === "online" ? "bg-pink-600 text-white shadow-sm" : "hover:text-stone-900"
                        }`}
                      >
                        Online
                      </button>
                      <button
                        onClick={() => setSearchCategory("following")}
                        className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                          searchCategory === "following" ? "bg-pink-600 text-white shadow-sm" : "hover:text-stone-900"
                        }`}
                      >
                        Following
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search profiles..."
                        className="pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:border-pink-500 w-44"
                      />
                    </div>
                  </div>
                </div>

                {/* Profiles Cards 3x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SAMPLE_SEARCH_PROFILES.map(profile => (
                    <div
                      key={profile.id}
                      className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition flex flex-col group relative"
                    >
                      {/* Photo Container */}
                      <div className="relative h-64 bg-stone-200 overflow-hidden">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-xs transition cursor-pointer">
                          <Heart className="w-4 h-4" />
                        </button>

                        {/* Photo/Video Counters */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-bold drop-shadow-md">
                          <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            <Camera className="w-3.5 h-3.5" />
                            <span>{profile.photoCount}</span>
                          </div>
                          {profile.videoCount > 0 && (
                            <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                              <Film className="w-3.5 h-3.5" />
                              <span>{profile.videoCount}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info & Action Button */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-stone-900">{profile.name}, {profile.age}</h3>
                            {profile.online && (
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                            )}
                          </div>
                          <p className="text-xs text-stone-500 font-medium mt-0.5">{profile.profession}</p>
                        </div>

                        <button
                          onClick={() => handleStartChatFromMatch(profile)}
                          className="w-full py-2.5 bg-[#b00058] hover:bg-[#8f0047] text-white font-extrabold text-xs rounded-xl shadow-sm transition cursor-pointer text-center"
                        >
                          View Profile / To Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar: Credits & Activity Panels (3 Columns matching screenshot 3) */}
              <div className="lg:col-span-3 space-y-5">
                {/* Card 1: Get More with Credits */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-stone-900">Get More with Credits</h3>

                  <div className="space-y-2 text-xs text-stone-600 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-[10px]">💬</div>
                      <span>Chat with anyone you like</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-[10px]">💎</div>
                      <span>Send Virtual Gifts</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-[10px]">✉️</div>
                      <span>Respond in Mail</span>
                    </div>
                  </div>

                  <button className="w-full py-2 border-2 border-[#b00058] text-[#b00058] hover:bg-pink-50 font-black text-xs rounded-xl transition cursor-pointer text-center">
                    Get Credits
                  </button>
                </div>

                {/* Card 2: My Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-stone-900">My Activity</h3>

                  <div className="space-y-2 text-xs font-bold text-stone-700">
                    <div className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg text-stone-600 cursor-pointer" onClick={() => setPortalTab("messages")}>
                      <span>Messages</span>
                      <span className="bg-[#b00058] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">8</span>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg text-stone-600 cursor-pointer" onClick={() => setPortalTab("mail")}>
                      <span>Mail</span>
                      <span className="bg-stone-200 text-stone-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">1</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-pink-50/70 text-[#b00058] rounded-lg">
                      <span>Following</span>
                      <span className="text-[#b00058] font-black">22</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: MESSAGES CHAT PORTAL (Matching Screenshots 1 & 2) */}
          {portalTab === "messages" && (
            <div className="max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
              {/* LEFT ACTIVE CHATS SIDEBAR (3 COLUMNS) */}
              <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col h-[650px] overflow-hidden">
                {/* Search Header */}
                <div className="p-3 border-b border-stone-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-800 outline-none focus:border-pink-500 transition"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Sub-Tabs: All chats, Active (Count), Requests (Count) */}
                <div className="flex items-center border-b border-stone-200 text-xs font-bold text-stone-500 px-3 pt-2">
                  <button
                    onClick={() => setActiveFilterTab("all")}
                    className={`pb-2 px-2 transition border-b-2 cursor-pointer ${
                      activeFilterTab === "all" ? "text-pink-600 border-pink-600 font-extrabold" : "border-transparent hover:text-stone-800"
                    }`}
                  >
                    All chats
                  </button>
                  <button
                    onClick={() => setActiveFilterTab("active")}
                    className={`pb-2 px-2 transition border-b-2 flex items-center gap-1 cursor-pointer ${
                      activeFilterTab === "active" ? "text-pink-600 border-pink-600 font-extrabold" : "border-transparent hover:text-stone-800"
                    }`}
                  >
                    <span>Active</span>
                    <span className="bg-pink-600 text-white rounded-full text-[9px] px-1.5 py-0.2 font-black">
                      {conversations.filter(c => c.online).length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveFilterTab("requests")}
                    className={`pb-2 px-2 transition border-b-2 flex items-center gap-1 cursor-pointer ${
                      activeFilterTab === "requests" ? "text-pink-600 border-pink-600 font-extrabold" : "border-transparent hover:text-stone-800"
                    }`}
                  >
                    <span>Requests</span>
                    <span className="bg-sky-600 text-white rounded-full text-[9px] px-1.5 py-0.2 font-black">
                      {socialRequests.filter(r => r.status === "pending").length}
                    </span>
                  </button>
                </div>

                {/* Conversation & Requests Left List */}
                <div className="divide-y divide-stone-100 max-h-[580px] overflow-y-auto">
                  {activeFilterTab === "requests" ? (
                    socialRequests.map(r => (
                      <div
                        key={r.id}
                        onClick={() => handleAcceptSocialRequest(r.id)}
                        className={`p-3 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition relative ${
                          r.status === "accepted" ? "bg-emerald-50/50" : ""
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={r.avatarUrl}
                            alt={r.name}
                            className="w-11 h-11 rounded-full object-cover border border-stone-200"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white text-[8px] font-black px-1 rounded-md shadow-2xs">
                            {r.platform}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-xs font-bold text-stone-900 truncate">{r.name}</h4>
                            <span className="text-[9px] text-stone-400 font-medium">{r.time}</span>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate">{r.greeting}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-sky-700 font-semibold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                              {r.phone}
                            </span>
                            <span className="text-[9px] font-bold text-pink-600 hover:underline">
                              {r.status === "accepted" ? "Active" : "Accept & Mingle ➔"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : activeFilterTab === "active" ? (
                    conversations.filter(c => c.online).map(c => {
                      const isActive = c.id === activeConvId;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveConvId(c.id);
                            setActiveFilterTab("all");
                          }}
                          className={`p-3 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition relative ${
                            isActive ? "bg-pink-50/60 border-l-4 border-pink-600" : ""
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={c.partnerAvatar}
                              alt={c.partnerName}
                              className="w-11 h-11 rounded-full object-cover border border-stone-200"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-xs font-bold text-stone-900 truncate">{c.partnerName}</h4>
                              <span className="text-[10px] text-stone-400 font-medium shrink-0 flex items-center gap-0.5">
                                <CheckCheck className="w-3 h-3 text-emerald-500" />
                                {c.lastMessageTime}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-1">
                              <p className="text-[11px] text-stone-500 truncate">{c.lastMessageText}</p>
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-200">
                                Mingle
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    conversations.map(c => {
                      const isActive = c.id === activeConvId;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setActiveConvId(c.id)}
                          className={`p-3 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition relative ${
                            isActive ? "bg-pink-50/60 border-l-4 border-pink-600" : ""
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={c.partnerAvatar}
                              alt={c.partnerName}
                              className="w-11 h-11 rounded-full object-cover border border-stone-200"
                            />
                            {c.online && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-xs font-bold text-stone-900 truncate">{c.partnerName}</h4>
                              <span className="text-[10px] text-stone-400 font-medium shrink-0 flex items-center gap-0.5">
                                {c.messages.some(m => m.sender === "user") && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                                {c.lastMessageTime}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-1">
                              <p className="text-[11px] text-stone-500 truncate">{c.lastMessageText}</p>
                              {c.unreadCount > 0 && (
                                <span className="bg-pink-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                                  {c.unreadCount}
                                </span>
                              )}
                              {c.matchBadge && (
                                <span className="bg-purple-100 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-purple-200 shrink-0">
                                  {c.matchBadge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* CENTER MAIN WINDOW (REQUESTS VIEW / ACTIVE MARKETPLACE / LOVE CHAT) */}
              {activeFilterTab === "requests" ? (
                <div className="lg:col-span-9 bg-white rounded-xl shadow-sm border border-stone-200 p-5 space-y-5 h-[650px] overflow-y-auto">
                  {/* Top Header */}
                  <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-purple-900 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-sky-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          AI Social Outreach Engine
                        </span>
                        <span className="text-xs font-bold text-sky-200">US & Global Phone Hunter</span>
                      </div>
                      <h2 className="text-lg font-black mt-1">Telegram, WhatsApp, TikTok & YouTube Outreach</h2>
                      <p className="text-xs text-stone-300">
                        Searching active US (+1) & International phone numbers, sending AI match invites, and ingesting real online members.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/20">
                      <select
                        value={selectedHunterRegion}
                        onChange={e => setSelectedHunterRegion(e.target.value)}
                        className="bg-stone-900 text-white text-xs font-bold px-2 py-1.5 rounded-lg border border-stone-700 outline-none cursor-pointer"
                      >
                        <option value="US">🇺🇸 USA (+1)</option>
                        <option value="UK">🇬🇧 UK (+44)</option>
                        <option value="EU">🇫🇷 Europe (+33)</option>
                        <option value="JP">🇯🇵 Japan (+81)</option>
                        <option value="NG">🇳🇬 Nigeria (+234)</option>
                      </select>

                      <button
                        onClick={handleTriggerAiPhoneHunter}
                        className="px-3.5 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs rounded-lg transition shadow-md flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>Search US & Global Numbers</span>
                      </button>
                    </div>
                  </div>

                  {/* Terminal Live Phone Hunter Console */}
                  <div className="bg-stone-950 rounded-xl p-3 text-emerald-400 text-[11px] font-mono border border-stone-800 space-y-1 max-h-32 overflow-y-auto shadow-inner">
                    <div className="text-stone-400 font-bold border-b border-stone-800 pb-1 mb-1 flex items-center justify-between">
                      <span>⚡ AI Phone Hunter Log Terminal</span>
                      <span className="text-[10px] text-emerald-500 animate-pulse">● Searching Live Numbers</span>
                    </div>
                    {aiHunterLogs.map((log, idx) => (
                      <div key={idx} className="leading-tight">{log}</div>
                    ))}
                  </div>

                  {/* Embedded Social Networks Outreach Hub */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Telegram */}
                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-sky-900">Telegram Bot</span>
                        <span className="bg-sky-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">Embedded</span>
                      </div>
                      <p className="text-[10px] text-sky-800 font-medium">@MeChatBot active dispatching matches to real Telegram channels & US phone contacts.</p>
                      <button
                        onClick={() => {
                          setToastMessage("📲 Telegram Outreach Engine triggered! Dispatching requests to @MeChatBot.");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] rounded-lg transition cursor-pointer"
                      >
                        Dispatch Telegram Invites
                      </button>
                    </div>

                    {/* WhatsApp */}
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-900">WhatsApp Bridge</span>
                        <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono">+1 (310)</span>
                      </div>
                      <p className="text-[10px] text-emerald-800 font-medium">Direct WhatsApp wa.me link generation & phone verification bridge active.</p>
                      <button
                        onClick={() => {
                          setToastMessage("💬 WhatsApp Outreach Bridge active! Phone numbers verified.");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition cursor-pointer"
                      >
                        Verify WhatsApp Contacts
                      </button>
                    </div>

                    {/* TikTok */}
                    <div className="p-3 bg-stone-900 text-white rounded-xl border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-pink-400">TikTok Live</span>
                        <span className="bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">Shareable</span>
                      </div>
                      <p className="text-[10px] text-stone-300 font-medium">TikTok creator matchmaking links & live stream chat invites synced.</p>
                      <button
                        onClick={() => {
                          setToastMessage("🎬 TikTok Creator Matchmaking Link copied!");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="w-full py-1.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[10px] rounded-lg transition cursor-pointer"
                      >
                        Share TikTok Match Link
                      </button>
                    </div>

                    {/* YouTube */}
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-red-900">YouTube Chat</span>
                        <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">Live</span>
                      </div>
                      <p className="text-[10px] text-red-800 font-medium">YouTube Live stream matchmaking bot bringing viewers directly to Love Section.</p>
                      <button
                        onClick={() => {
                          setToastMessage("🎥 YouTube Stream Inviter active!");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] rounded-lg transition cursor-pointer"
                      >
                        Broadcast YouTube Invites
                      </button>
                    </div>
                  </div>

                  {/* Incoming Social Requests Grid */}
                  <div>
                    <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Incoming Requests from AI Hunter ({socialRequests.filter(r => r.status === "pending").length} Pending)</span>
                      <span className="text-[10px] text-stone-400">Click Accept to move to Active Marketplace & Love Section</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {socialRequests.map(r => (
                        <div key={r.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3 hover:border-pink-300 transition">
                          <img src={r.avatarUrl} alt={r.name} className="w-12 h-12 rounded-full object-cover border border-stone-300 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-stone-900 truncate">{r.name}, {r.age}</h4>
                              <span className="bg-sky-100 text-sky-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-sky-200">
                                {r.platform}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 font-bold flex items-center gap-1 mt-0.5">
                              <span>{r.city}, {r.country}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-mono">{r.phone}</span>
                            </div>
                            <p className="text-[11px] text-stone-600 italic mt-1 leading-snug">"{r.greeting}"</p>

                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleAcceptSocialRequest(r.id)}
                                className="flex-1 py-1.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-lg transition shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Heart className="w-3 h-3 fill-white" />
                                <span>{r.status === "accepted" ? "Accepted (In Active)" : "Accept & Mingle"}</span>
                              </button>
                              <button
                                onClick={() => setShowEmbeddedWhatsappModal(true)}
                                className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition cursor-pointer"
                              >
                                WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeFilterTab === "active" ? (
                <div className="lg:col-span-9 bg-white rounded-xl shadow-sm border border-stone-200 p-5 space-y-4 h-[650px] overflow-y-auto">
                  {/* Top Banner */}
                  <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active Online Marketplace
                        </span>
                        <span className="text-xs font-bold text-pink-100">Live Ecosystem Marketplace</span>
                      </div>
                      <h2 className="text-lg font-black mt-1">Mingle & Join Active People Around the World</h2>
                      <p className="text-xs text-stone-200">
                        Click "Mingle & Chat" on any active member to enter the Love Section for direct 1-on-1 private messaging.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveFilterTab("requests")}
                      className="px-3.5 py-2 bg-white text-pink-700 font-extrabold text-xs rounded-xl shadow cursor-pointer hover:bg-pink-50 transition"
                    >
                      + Discover More via AI Requests
                    </button>
                  </div>

                  {/* Active Marketplace Roster Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {conversations.filter(c => c.online).map(c => (
                      <div key={c.id} className="bg-stone-50 rounded-2xl border border-stone-200 p-3.5 space-y-3 hover:border-pink-300 hover:shadow-md transition relative">
                        <div className="relative">
                          <img src={c.partnerAvatar} alt={c.partnerName} className="w-full h-36 rounded-xl object-cover border border-stone-200" />
                          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            ONLINE NOW
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-stone-900">{c.partnerName}, {c.partnerAge || 24}</h3>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <p className="text-[11px] text-stone-500 font-medium">Real Verified Ecosystem Member</p>
                          <p className="text-xs text-stone-700 italic mt-1 font-serif">"{c.lastMessageText}"</p>
                        </div>

                        <div className="pt-1 border-t border-stone-200 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setActiveConvId(c.id);
                              setActiveFilterTab("all");
                            }}
                            className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>Mingle & Chat (Love Section)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* STANDARD LOVE SECTION (1-ON-1 CHAT ROOM) */
                <div className="lg:col-span-6 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col h-[650px] relative overflow-hidden">
                  {/* Partner Header */}
                  <div className="px-4 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between bg-white sticky top-0 z-10 gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={activeConv.partnerAvatar}
                          alt={activeConv.partnerName}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200 cursor-pointer"
                          onClick={() => setShowTelegramProfileModal(true)}
                        />
                        {activeConv.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3
                            onClick={() => setShowTelegramProfileModal(true)}
                            className="text-sm font-black text-stone-900 leading-snug cursor-pointer hover:text-pink-600 transition"
                          >
                            {activeConv.partnerName}
                          </h3>
                          <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-emerald-200 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            REAL PERSON
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          ● Active now • Real Contact Verified
                        </span>
                      </div>
                    </div>

                    {/* Direct Contact & Google Gmail Auth Badge */}
                    <div className="flex items-center gap-1.5">
                      <div className="hidden sm:flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200 text-[10px] font-extrabold text-stone-700">
                        <img src="https://www.google.com/favicon.ico" alt="Gmail" className="w-3 h-3" />
                        <span>{googleAuthUser.email}</span>
                      </div>

                      <button
                        onClick={() => setShowEmbeddedWhatsappModal(true)}
                        title="Open Embedded WhatsApp Web Suite Inside App"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                      >
                        <span>WhatsApp</span>
                      </button>

                      <a
                        href={`tel:+13108492091`}
                        title="1-Click Call Direct"
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => setShowTelegramProfileModal(true)}
                        className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition cursor-pointer"
                        title="Telegram / WhatsApp Profile & Photo Editor"
                      >
                        <Camera className="w-4 h-4 text-pink-600" />
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages Stream */}
                  <div className="flex-1 p-4 overflow-y-auto bg-[#eef2f5] space-y-3">
                    {activeConv.messages.map(m => {
                      if (m.sender === "divider") {
                        return (
                          <div key={m.id} className="my-3 flex items-center justify-center">
                            <span className="bg-stone-200/80 text-stone-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-2xs">
                              {m.text}
                            </span>
                          </div>
                        );
                      }

                      const isUser = m.sender === "user";
                      return (
                        <div
                          key={m.id}
                          className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          {!isUser && (
                            <img
                              src={activeConv.partnerAvatar}
                              alt={activeConv.partnerName}
                              className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-stone-300 cursor-pointer"
                              onClick={() => setShowTelegramProfileModal(true)}
                            />
                          )}

                          <div
                            className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                              isUser
                                ? "bg-[#fff8e1] text-stone-900 rounded-br-2xs border border-amber-200/60"
                                : "bg-white text-stone-900 rounded-bl-2xs border border-stone-200"
                            }`}
                          >
                            <p>{m.text}</p>

                            {/* Simulated Voice Note waveform if applicable */}
                            {m.text.includes("Voice") && (
                              <div className="mt-2 p-2 bg-stone-100 rounded-xl flex items-center gap-2 border border-stone-200">
                                <button
                                  onClick={() => setPlayingVoiceId(playingVoiceId === m.id ? null : m.id)}
                                  className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center cursor-pointer hover:scale-105 transition shrink-0"
                                >
                                  {playingVoiceId === m.id ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                                </button>
                                <div className="flex-1 space-y-0.5">
                                  <div className="h-1 bg-stone-300 rounded-full overflow-hidden">
                                    <div className={`h-full bg-pink-600 ${playingVoiceId === m.id ? "w-3/4 animate-pulse" : "w-1/4"}`} />
                                  </div>
                                  <span className="text-[9px] text-stone-500 font-bold">0:14 • Voice Message</span>
                                </div>
                              </div>
                            )}

                            <div
                              className={`flex items-center gap-1 text-[9px] mt-1 font-semibold ${
                                isUser ? "justify-end text-stone-500" : "text-stone-400"
                              }`}
                            >
                              <span>{m.time}</span>
                              {isUser && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                            </div>
                          </div>

                          {isUser && (
                            <img
                              src={userCustomPhoto}
                              alt="User Avatar"
                              className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-stone-300 cursor-pointer"
                              onClick={() => setShowTelegramProfileModal(true)}
                            />
                          )}
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex items-center gap-2 text-stone-500 text-xs italic pl-2 pt-1">
                        <span className="animate-pulse font-bold">{activeConv.partnerName} is typing...</span>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>

                  {/* Toolbar Actions: Stickers, Photo, Voice Note */}
                  <div className="bg-white border-t border-stone-200 px-3 py-1.5 flex items-center gap-4 text-xs font-bold text-stone-600">
                    <button className="flex items-center gap-1 hover:text-pink-600 cursor-pointer">
                      <span>😃 Stickers ▾</span>
                    </button>
                    <button
                      onClick={() => {
                        setToastMessage("📸 Photo Attachment tool ready. Selected photo attached!");
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="flex items-center gap-1 hover:text-pink-600 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Photo</span>
                    </button>
                    <button
                      onClick={() => {
                        setToastMessage("🎙️ Recorded 5s Voice Note attached to chat!");
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="flex items-center gap-1 hover:text-pink-600 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Voice Note</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-pink-600 cursor-pointer relative">
                      <Gift className="w-3.5 h-3.5 text-amber-500" />
                      <span>Gifts</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-600 absolute -top-0.5 -right-1" />
                    </button>
                  </div>

                  {/* Text Input & Send Button */}
                  <div className="p-3 bg-white border-t border-stone-100 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-pink-500 focus:bg-white transition"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-stone-400 font-bold flex items-center gap-0.5">
                        😃 300
                      </span>
                    </div>

                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cost Banner Footer */}
                  <div className="bg-stone-50 border-t border-stone-200 px-3 py-1.5 text-[10px] text-stone-500 flex items-center justify-between font-medium">
                    <div className="flex items-center gap-1">
                      <span>Chat: Free Active • Gmail Sync Active</span>
                    </div>
                    <button
                      onClick={() => setShowTelegramProfileModal(true)}
                      className="text-pink-600 font-extrabold hover:underline cursor-pointer"
                    >
                      Edit Profile & Photo
                    </button>
                  </div>
                </div>
              )}

              {/* RIGHT SIDEBAR: CREDITS & ACTIVITY PANELS (3 COLUMNS - ONLY IN ALL CHATS VIEW) */}
              {activeFilterTab === "all" && (
                <div className="lg:col-span-3 space-y-4">
                  {/* Card 1: Get More with Credits */}
                  <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 space-y-3">
                    <h3 className="text-xs font-bold text-stone-900">Get More with Credits</h3>

                    <div className="space-y-2 text-xs text-stone-600 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-[10px]">💬</div>
                        <span>Chat with anyone you like</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-[10px]">💎</div>
                        <span>Send Virtual Gifts</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-[10px]">✉️</div>
                        <span>Respond in Mail</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCoinsModal(true)}
                      className="w-full py-2 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-black text-xs rounded-xl transition cursor-pointer text-center"
                    >
                      Get Credits
                    </button>
                  </div>

                  {/* Card 2: My Activity */}
                  <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 space-y-3">
                    <h3 className="text-xs font-bold text-stone-900">My Activity</h3>

                    <div className="space-y-2 text-xs font-bold text-stone-700">
                      <div className="flex items-center justify-between p-2 bg-pink-50/70 text-pink-700 rounded-lg">
                        <span>Messages</span>
                        <span className="bg-pink-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {conversations.length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg text-stone-600 cursor-pointer" onClick={() => setPortalTab("mail")}>
                        <span>Mail</span>
                        <span className="bg-stone-200 text-stone-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">1</span>
                      </div>

                      <div className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg text-stone-600 cursor-pointer" onClick={() => setPortalTab("search")}>
                        <span>Following</span>
                        <span className="text-pink-600 font-black">22</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW: EMBEDDED REAL GMAIL SUITE */}
          {portalTab === "mail" && (
            <div className="max-w-7xl w-full mx-auto p-4 md:p-6">
              <EmbeddedGmailSuite />
            </div>
          )}

          {/* SUB-VIEW: COINS & CREDITS HUB */}
          {portalTab === "credits" && (
            <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mx-auto">
                <Coins className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-stone-900">DatingArts Coins & Free Daily Allowance</h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Your account is credited with 200 Free Daily Coins. Enjoy 1-click matchmaking, real-time messaging, and member direct contacts without restriction.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowCoinsModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg transition cursor-pointer"
                >
                  Open Coins Ledger & Claim Free Daily Allowance
                </button>
                <button
                  onClick={() => setPortalTab("messages")}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Return to Messages
                </button>
              </div>
            </div>
          )}

          {/* OTHER SUB-PAGES (NEWSFEED / PEOPLE) */}
          {["newsfeed", "people"].includes(portalTab) && (
            <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-stone-900 capitalize">DatingArts {portalTab} Module</h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto">This tab is active inside your ecosystem. Jump back to Messages or Search to connect with your matches.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setPortalTab("messages")}
                  className="px-4 py-2 bg-pink-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Open Messages
                </button>
                <button
                  onClick={() => setPortalTab("search")}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Open Search Profiles
                </button>
              </div>
            </div>
          )}

          {/* FLOATING AUTOMATED AI MATCHMAKER & NOTIFICATION HUB (STEADY POSITION, MINIMIZE/RESTORE TOGGLE) */}
          {showAiMatchPopup ? (
            isAiDropMinimized ? (
              /* MINIMIZED FLOATING PILL */
              <div
                onClick={() => setIsAiDropMinimized(false)}
                className="fixed bottom-5 right-5 z-50 bg-stone-900/95 hover:bg-stone-900 text-white rounded-full px-4 py-2.5 shadow-2xl border-2 border-pink-500 flex items-center gap-3 cursor-pointer transition-all hover:scale-105 backdrop-blur-md"
              >
                <div className="relative">
                  <img
                    src={currentDropMatch.avatarUrl}
                    alt={currentDropMatch.name}
                    className="w-7 h-7 rounded-full object-cover border border-pink-400"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-stone-900" />
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-pink-400 font-extrabold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-pink-500" />
                    <span>AI Matchmaker</span>
                  </span>
                  <span className="text-stone-300">• {currentDropMatch.name} ({currentDropMatch.score}%)</span>
                  {aiNotifications.length > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Bell className="w-2.5 h-2.5" />
                      <span>{aiNotifications.length}</span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* EXPANDED STEADY CARD (NO BOUNCING!) */
              <div className="fixed bottom-5 right-5 z-50 bg-[#121214] text-white rounded-2xl p-4 shadow-2xl border-2 border-pink-600/90 max-w-sm w-full font-sans transition-all duration-300">
                {/* Header Bar */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
                    <button
                      onClick={() => setAiDropTab("match")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                        aiDropTab === "match" ? "bg-pink-600 text-white shadow" : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <Zap className="w-3 h-3 fill-pink-300" />
                      <span>AI Match Drop</span>
                    </button>
                    <button
                      onClick={() => setAiDropTab("notifications")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                        aiDropTab === "notifications" ? "bg-pink-600 text-white shadow" : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <Bell className="w-3 h-3" />
                      <span>Notifications ({aiNotifications.length})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsAiDropMinimized(true)}
                      title="Minimize AI Matchmaker"
                      className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 cursor-pointer text-xs font-bold"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowAiMatchPopup(false)}
                      title="Close AI Matchmaker"
                      className="text-stone-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-stone-800 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* TAB 1: AI MATCH DROP */}
                {aiDropTab === "match" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-extrabold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Real Ecosystem Member
                      </span>
                      <span className="text-amber-400 font-mono">Next Match in: {matchCountdown}s</span>
                    </div>

                    <div className="flex items-center gap-3 bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                      <div className="relative shrink-0">
                        <img
                          src={currentDropMatch.avatarUrl}
                          alt={currentDropMatch.name}
                          className="w-16 h-20 rounded-xl object-cover border border-pink-500/50 shadow-md"
                        />
                        {currentDropMatch.online && (
                          <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900 shadow-sm" />
                        )}
                        <div className="absolute -bottom-1 -left-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                          {currentDropMatch.score}% Match
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-black text-white truncate flex items-center gap-1">
                          <span>{currentDropMatch.name}, {currentDropMatch.age}</span>
                        </h4>
                        <p className="text-[11px] text-stone-300 font-medium leading-tight italic line-clamp-2">
                          "{currentDropMatch.tagline}"
                        </p>
                        <div className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                          <span>📍 Real-Time Matchmaking Ecosystem</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={triggerRandomAiMatchDrop}
                        className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition cursor-pointer text-center"
                      >
                        Skip Candidate
                      </button>
                      <button
                        onClick={() => handle1ClickSynergyMatch(currentDropMatch.id, currentDropMatch.name)}
                        className="py-2 px-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black rounded-xl shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1"
                      >
                        <span>1-Click Match</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: AI NOTIFICATION HUB */}
                {aiDropTab === "notifications" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 border-b border-stone-800 pb-1.5">
                      <span>Ecosystem Live Activity Feed</span>
                      <button
                        onClick={() => setAiNotifications([])}
                        className="text-stone-500 hover:text-stone-300 underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {aiNotifications.length === 0 ? (
                        <p className="text-xs text-stone-500 text-center py-6">No recent notifications</p>
                      ) : (
                        aiNotifications.map(n => (
                          <div
                            key={n.id}
                            className="p-2.5 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1 hover:border-pink-500/50 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-pink-400">{n.title}</span>
                              <span className="text-[9px] text-stone-500">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-stone-300 leading-snug">{n.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            /* RESTORE LAUNCHER BUTTON WHEN CLOSED */
            <button
              onClick={() => {
                setShowAiMatchPopup(true);
                setIsAiDropMinimized(false);
              }}
              className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white hover:bg-stone-800 border-2 border-pink-600 rounded-full p-3 shadow-2xl cursor-pointer flex items-center gap-2 transition hover:scale-110"
              title="Open AI Matchmaker & Notifications"
            >
              <Zap className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="text-xs font-black hidden sm:inline text-pink-300">AI Matchmaker</span>
            </button>
          )}
        </div>
      )}

      {/* VIEW 2: 10-STEP MATCHMAKING QUIZ */}
      {suiteView === "quiz" && (
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-4xl mx-auto w-full text-white bg-[#19191c] rounded-2xl shadow-xl border border-stone-800 my-6">
          <div className="w-full max-w-2xl text-center space-y-6">
            <h1 className="font-serif text-3xl md:text-4xl text-white font-medium tracking-tight">
              DatingArts 10-Step Luxury Matchmaking Questionnaire
            </h1>
            <p className="text-stone-300 text-xs">Curating genuine chemistry through shared values and time efficiency.</p>

            <div className="bg-stone-900/90 p-6 rounded-2xl border border-stone-800 space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-stone-200">
                <div className="p-3 bg-stone-800/80 rounded-xl">
                  <span className="text-amber-400 font-bold block mb-1">Target Age Group</span>
                  <span>{selectedAge}</span>
                </div>
                <div className="p-3 bg-stone-800/80 rounded-xl">
                  <span className="text-amber-400 font-bold block mb-1">Gender / Preference</span>
                  <span>{selectedGender} seeking {targetInterest}</span>
                </div>
                <div className="p-3 bg-stone-800/80 rounded-xl">
                  <span className="text-amber-400 font-bold block mb-1">Intention</span>
                  <span>{intent}</span>
                </div>
                <div className="p-3 bg-stone-800/80 rounded-xl">
                  <span className="text-amber-400 font-bold block mb-1">Time Asset Preference</span>
                  <span>{timeAsset}</span>
                </div>
              </div>

              <button
                onClick={() => { setSuiteView("portal"); setPortalTab("messages"); }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-sm rounded-xl shadow-lg hover:from-amber-400 hover:to-yellow-400 transition cursor-pointer text-center"
              >
                Complete Quiz & View Matches in App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ADMIN CONSOLE & AI AUTO-MATCHMAKER */}
      {suiteView === "admin" && (
        <div className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-xl border border-stone-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  DatingArts Admin Console & AI Matchmaking Engine
                </h2>
                <p className="text-xs text-stone-400">Configure real-time drop frequency, trigger matches, inspect message logs, and override replies.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={triggerRandomAiMatchDrop}
                  className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Trigger AI Match Banner Drop</span>
                </button>

                <button
                  onClick={toggleAiMatchmaker}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                    aiAutoMatchmakerEnabled
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-stone-800 text-stone-400 border border-stone-700"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>AI Engine: {aiAutoMatchmakerEnabled ? "ACTIVE (24/7)" : "PAUSED"}</span>
                </button>
              </div>
            </div>

            {/* Config: Interval & Persona Controls */}
            <div className="bg-stone-800/90 p-4 rounded-xl border border-stone-700 space-y-3">
              <h3 className="text-xs font-bold text-amber-300">AI Match Dropdown Frequency Configurator</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-200">
                <div className="flex items-center gap-2">
                  <span>Drop Interval:</span>
                  <select
                    value={aiMatchIntervalSec}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setAiMatchIntervalSec(val);
                      setMatchCountdown(val);
                    }}
                    className="bg-stone-900 border border-stone-700 text-xs font-bold rounded-lg px-3 py-1.5 text-white outline-none"
                  >
                    <option value={30}>Every 30 seconds</option>
                    <option value={45}>Every 45 seconds</option>
                    <option value={60}>Every 1 minute (60s)</option>
                    <option value={90}>Every 1.5 minutes (90s)</option>
                    <option value={120}>Every 2 minutes (120s)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-700">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  <span>Next AI Match in: <b>{matchCountdown}s</b></span>
                </div>
              </div>
            </div>

            {/* Admin Override Dispatcher */}
            <div className="bg-stone-800/90 p-4 rounded-xl border border-stone-700 space-y-3">
              <h3 className="text-xs font-bold text-amber-300">Admin Message Override / Injection</h3>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={activeConvId}
                  onChange={e => setActiveConvId(e.target.value)}
                  className="bg-stone-900 border border-stone-700 text-xs font-bold rounded-lg px-3 py-2 text-white outline-none"
                >
                  {conversations.map(c => (
                    <option key={c.id} value={c.id}>Chat with {c.partnerName}</option>
                  ))}
                </select>

                <select
                  value={adminSenderRole}
                  onChange={e => setAdminSenderRole(e.target.value as any)}
                  className="bg-stone-900 border border-stone-700 text-xs font-bold rounded-lg px-3 py-2 text-white outline-none"
                >
                  <option value="partner">Send as Partner persona</option>
                  <option value="user">Send as User ({userEmail})</option>
                </select>

                <input
                  type="text"
                  value={adminOverrideText}
                  onChange={e => setAdminOverrideText(e.target.value)}
                  placeholder="Type admin override message..."
                  className="flex-1 min-w-[200px] bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />

                <button
                  onClick={handleAdminOverride}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  Inject Message
                </button>
              </div>
            </div>

            {/* Live Message Logs Table */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
              <div className="p-3 bg-stone-900 border-b border-stone-800 text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Real-Time Conversation Audit Logs</span>
                <span className="font-mono text-amber-400">{conversations.length} Active Conversations</span>
              </div>

              <div className="divide-y divide-stone-800 max-h-80 overflow-y-auto font-mono text-xs text-stone-300">
                {conversations.map(c => (
                  <div key={c.id} className="p-3 hover:bg-stone-900/50 flex flex-col space-y-1">
                    <div className="flex items-center justify-between text-amber-400 font-bold">
                      <span>Chat ID: {c.id} ({c.partnerName})</span>
                      <span className="text-[10px] text-stone-500">{c.messages.length} messages</span>
                    </div>
                    <p className="text-stone-400 text-[11px] truncate">Last Message: {c.lastMessageText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED WHATSAPP WEB SUITE MODAL */}
      {showEmbeddedWhatsappModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-300 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden relative">
            {/* Embedded WhatsApp Header Bar */}
            <div className="bg-[#00a884] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-sm">
                  💬
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black tracking-wide">WhatsApp Web</h2>
                    <span className="bg-emerald-800 text-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-600">
                      Embedded in DatingArts App
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-100 font-medium">
                    Account Linked: <span className="font-mono font-bold">+1 (310) 849-2091</span> • Real Person Bridge Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowWhatsappQrModal(true)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR / Link Phone</span>
                </button>
                <button
                  onClick={() => setShowEmbeddedWhatsappModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white font-black text-sm transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main WhatsApp Web Split Layout */}
            <div className="flex-1 flex overflow-hidden bg-[#efeae2]">
              {/* Left Contacts Sidebar */}
              <div className="w-full sm:w-80 md:w-96 bg-white border-r border-stone-200 flex flex-col h-full shrink-0">
                {/* User Profile Header */}
                <div className="p-3 bg-[#f0f2f5] border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={userCustomPhoto}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 truncate">{googleAuthUser.name}</h4>
                      <span className="text-[10px] text-emerald-600 font-semibold font-mono">+1 (310) 849-2091</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-600">
                    <button
                      onClick={() => setShowWhatsappQrModal(true)}
                      className="p-1.5 rounded-full hover:bg-stone-200 cursor-pointer"
                      title="Link Phone"
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-stone-200 cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="p-2 bg-white border-b border-stone-100">
                  <div className="relative">
                    <input
                      type="text"
                      value={whatsappSearchText}
                      onChange={e => setWhatsappSearchText(e.target.value)}
                      placeholder="Search or start new chat"
                      className="w-full bg-[#f0f2f5] rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-800 outline-none focus:bg-white border border-transparent focus:border-emerald-500 transition"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* WhatsApp Filter Pills */}
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-stone-600">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">All</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 cursor-pointer">Unread 61</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 cursor-pointer">Favorites</span>
                  </div>
                </div>

                {/* Contacts List (Matching User's Screenshot 1!) */}
                <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
                  {/* DatingArts Active Conversations synced as WhatsApp Contacts */}
                  {conversations.map(c => {
                    const isSelected = c.id === activeConvId;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setActiveConvId(c.id)}
                        className={`p-3 flex items-center gap-3 hover:bg-[#f0f2f5] cursor-pointer transition ${
                          isSelected ? "bg-[#f0f2f5]" : ""
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={c.partnerAvatar}
                            alt={c.partnerName}
                            className="w-12 h-12 rounded-full object-cover border border-stone-200"
                          />
                          {c.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-xs font-bold text-stone-900 truncate">
                              {c.partnerName} <span className="text-[10px] text-stone-400 font-mono font-normal">(+1 310-849-2091)</span>
                            </h4>
                            <span className="text-[10px] text-stone-400 font-medium shrink-0 flex items-center gap-0.5">
                              <CheckCheck className="w-3 h-3 text-sky-500" />
                              {c.lastMessageTime}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[11px] text-stone-500 truncate">{c.lastMessageText}</p>
                            {c.unreadCount > 0 && (
                              <span className="bg-[#25d366] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                                {c.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Real WhatsApp Contacts matching user screenshot 1 */}
                  {[
                    { name: "APNA ADDA 👤💖", phone: "+1 (310) 849-2091", msg: "~KAALAA: This call could...", time: "00:00", unread: 741 },
                    { name: "Ubi", phone: "+1 (310) 849-2091", msg: "📷 Photo", time: "Yesterday" },
                    { name: "Nija Exchange Guy@Cambodia", phone: "+1 (310) 849-2091", msg: "✓ Boss", time: "Yesterday" },
                    { name: "Goodness", phone: "+1 (310) 849-2091", msg: "✓ sharp", time: "Yesterday" },
                    { name: "+855 10 371 231 (You)", phone: "+855 10 371 231", msg: "✓👋 Hello dear.", time: "Yesterday" },
                    { name: "+1 (708) 504-6853", phone: "+1 (708) 504-6853", msg: "I'm good baby", time: "Yesterday", unread: 1 },
                    { name: "New third batch group", phone: "Group", msg: "~eze: All north America active...", time: "Yesterday", unread: 34 },
                    { name: "+91 6296 712 676", phone: "+91 6296 712 676", msg: "Mittha bolis na bhai", time: "Yesterday", unread: 1 },
                    { name: "TAJUDDIN KHAN PATHAN", phone: "+91 9823 109 231", msg: "Why you going offline...", time: "Yesterday", unread: 6 },
                    { name: "SREYMARA", phone: "+855 98 120 442", msg: "Srey joined via link", time: "Yesterday" }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setToastMessage(`💬 WhatsApp contact ${item.name} connected to DatingArts Love Section!`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-[#f0f2f5] cursor-pointer transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-700 font-black flex items-center justify-center text-sm shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-[10px] text-stone-400 font-medium shrink-0">{item.time}</span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[11px] text-stone-500 truncate">{item.msg}</p>
                          {item.unread && (
                            <span className="bg-[#25d366] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0">
                              {item.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Chat Window */}
              <div className="flex-1 flex flex-col h-full bg-[#efeae2] relative">
                {/* Chat Header */}
                <div className="p-3 bg-[#f0f2f5] border-b border-stone-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeConv.partnerAvatar}
                      alt={activeConv.partnerName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <h3 className="text-xs font-black text-stone-900">{activeConv.partnerName}</h3>
                      <p className="text-[10px] text-emerald-600 font-semibold font-mono">+1 (310) 849-2091 • Active on WhatsApp & App</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-stone-600">
                    <button className="p-1.5 rounded-full hover:bg-stone-200 cursor-pointer" title="Video Call">
                      <Video className="w-4 h-4 text-stone-700" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-stone-200 cursor-pointer" title="Voice Call">
                      <Phone className="w-4 h-4 text-stone-700" />
                    </button>
                    <div className="h-4 w-px bg-stone-300 mx-1" />
                    <button className="p-1.5 rounded-full hover:bg-stone-200 cursor-pointer">
                      <Search className="w-4 h-4 text-stone-700" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-stone-200 cursor-pointer">
                      <MoreVertical className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {/* End to end encryption notice */}
                  <div className="flex justify-center my-2">
                    <div className="bg-[#ffeebd] text-[#54656f] text-[10px] font-medium px-4 py-1.5 rounded-lg text-center max-w-md shadow-2xs border border-amber-200/60">
                      🔒 Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or answer them.
                    </div>
                  </div>

                  {activeConv.messages.map(m => {
                    const isUser = m.sender === "user";
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-3.5 py-2 rounded-xl text-xs leading-relaxed shadow-2xs relative ${
                            isUser
                              ? "bg-[#d9fdd3] text-stone-900 rounded-tr-2xs border border-emerald-100"
                              : "bg-white text-stone-900 rounded-tl-2xs border border-stone-200"
                          }`}
                        >
                          <p>{m.text}</p>
                          <div
                            className={`flex items-center gap-1 text-[9px] mt-1 font-semibold ${
                              isUser ? "justify-end text-stone-500" : "text-stone-400"
                            }`}
                          >
                            <span>{m.time}</span>
                            {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex items-center gap-2 text-stone-500 text-xs italic pl-2">
                      <span className="animate-pulse font-bold">{activeConv.partnerName} is typing on WhatsApp...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-[#f0f2f5] border-t border-stone-200 flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition cursor-pointer">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition cursor-pointer">
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={whatsappInputText}
                    onChange={e => setWhatsappInputText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && whatsappInputText.trim()) {
                        const txt = whatsappInputText.trim();
                        setWhatsappInputText("");
                        setInputText(txt);
                        setTimeout(() => sendMessage(), 50);
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-white rounded-lg px-4 py-2 text-xs text-stone-800 outline-none border border-stone-200 focus:border-emerald-500 transition"
                  />

                  <button
                    onClick={() => {
                      if (whatsappInputText.trim()) {
                        const txt = whatsappInputText.trim();
                        setWhatsappInputText("");
                        setInputText(txt);
                        setTimeout(() => sendMessage(), 50);
                      }
                    }}
                    className="p-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full transition shadow-sm cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP LINK PHONE & QR CODE MODAL */}
      {showWhatsappQrModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowWhatsappQrModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-black cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-[#00a884] font-black text-base">
              <QrCode className="w-6 h-6" />
              <span>WhatsApp Web Account Synchronization</span>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              Link your WhatsApp phone number or scan the QR Code below to bridge real WhatsApp conversations into DatingArts.
            </p>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-3">
              <div className="w-40 h-40 bg-white border-2 border-stone-900 rounded-xl mx-auto flex items-center justify-center p-2 relative shadow-sm">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://datingarts.com/whatsapp-link-13108492091"
                  alt="WhatsApp QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] text-stone-500 font-bold">Point your phone's WhatsApp scanner at this code</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800">Or Link with WhatsApp Phone Number:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  defaultValue="+1 (310) 849-2091"
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-800 outline-none"
                />
                <button
                  onClick={() => {
                    setToastMessage("✅ WhatsApp number +1 (310) 849-2091 verified & linked to DatingArts!");
                    setShowWhatsappQrModal(false);
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className="px-4 py-2 bg-[#00a884] hover:bg-[#008f6f] text-white font-extrabold text-xs rounded-lg transition cursor-pointer"
                >
                  Verify & Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COINS & FREE CREDIT MANAGER MODAL */}
      <CoinsCreditManagerModal
        isOpen={showCoinsModal}
        onClose={() => setShowCoinsModal(false)}
        credits={credits}
        onUpdateCredits={(newCreds) => setCredits(newCreds)}
      />
    </div>
  );
}
