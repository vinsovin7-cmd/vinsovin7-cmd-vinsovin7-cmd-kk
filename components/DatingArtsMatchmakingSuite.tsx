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
  Phone
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
    id: "da-adesuwa",
    name: "Adesuwa Okonkwo",
    age: 27,
    gender: "Woman",
    targetInterest: "Man",
    city: "Lagos",
    country: "Nigeria",
    distanceKm: 4.2,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"],
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
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"],
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
    id: "da-maria",
    name: "Maria De Los Angeles",
    age: 23,
    gender: "Woman",
    targetInterest: "Man",
    city: "Los Angeles",
    country: "United States",
    distanceKm: 1.8,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"],
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
    name: "Luciano",
    age: 49,
    gender: "Man",
    targetInterest: "Woman",
    city: "Rome",
    country: "Italy",
    distanceKm: 14.2,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"],
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
    name: "Daisy",
    age: 29,
    gender: "Woman",
    targetInterest: "Man",
    city: "Manila",
    country: "Philippines",
    distanceKm: 6.5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"],
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
    id: "da-artur",
    name: "Artur",
    age: 59,
    gender: "Man",
    targetInterest: "Woman",
    city: "Vienna",
    country: "Austria",
    distanceKm: 18.0,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"],
    photoCount: 11,
    videoCount: 0,
    bio: "Architect & classical music patron. Seeking intelligent companionship and inspiring dialogue.",
    profession: "Senior Architectural Principal",
    verified: true,
    online: true,
    matchScore: 93,
    ambition: "Established",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Classical Opera", "Modern Architecture", "Philosophy"],
    greetingMessage: "Good evening. Chemistry begins with shared taste and mutual respect. Delighted to connect."
  },
  {
    id: "da-cristina",
    name: "Cristina Rosana",
    age: 48,
    gender: "Woman",
    targetInterest: "Man",
    city: "Madrid",
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
    id: "da-edwin",
    name: "Edwin",
    age: 41,
    gender: "Man",
    targetInterest: "Woman",
    city: "Sydney",
    country: "Australia",
    distanceKm: 11.4,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    galleryUrls: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"],
    photoCount: 21,
    videoCount: 2,
    bio: "Environmental engineer & outdoor adventurer. Love hiking, sailing, and genuine human connection.",
    profession: "Environmental Principal Consultant",
    verified: true,
    online: true,
    matchScore: 94,
    ambition: "Balanced",
    timeAssetPreference: "Yes, efficiency",
    intent: "Romance",
    aesthetics: ["Coastal Trails", "Sailing", "Sustainablity"],
    greetingMessage: "G'day! Looking for a partner in crime for weekend outdoor adventures and great food."
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

  // AI Autonomous Matchmaker Drop-down Popup System
  const [aiMatchIntervalSec, setAiMatchIntervalSec] = useState<number>(60);
  const [matchCountdown, setMatchCountdown] = useState<number>(60);
  const [aiAutoMatchmakerEnabled, setAiAutoMatchmakerEnabled] = useState<boolean>(true);
  const [showAiMatchPopup, setShowAiMatchPopup] = useState<boolean>(true);
  
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
    id: "da-cristina",
    name: "Cristina Rosana",
    age: 48,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    online: true,
    tagline: "Your feelings are mutual 💜",
    score: 96,
    isRealPerson: true,
    phone: "+34 612 345 678",
    whatsapp: "+34 612 345 678",
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
    // Pick next profile from sample roster
    const randomIndex = Math.floor(Math.random() * SAMPLE_SEARCH_PROFILES.length);
    const profile = SAMPLE_SEARCH_PROFILES[randomIndex];

    const taglines = [
      "maybe it's time to say hi?",
      "Your feelings are mutual 💜",
      "AI Matchmaker: 99% Chemistry Match",
      "Online now! Looking for real conversation.",
      "Matches your ambition & timing preferences"
    ];
    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

    setCurrentDropMatch({
      id: profile.id,
      name: profile.name,
      age: profile.age,
      avatarUrl: profile.avatarUrl,
      online: profile.online,
      tagline: randomTagline,
      score: profile.matchScore
    });

    setShowAiMatchPopup(true);
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
      const res = await fetch("/api/datingarts/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          text: msgText
        })
      });
      const data = await res.json();
      setIsTyping(false);

      if (data.success && data.replyMessage) {
        setConversations(prev =>
          prev.map(c => {
            if (c.id === activeConvId) {
              return {
                ...c,
                lastMessageText: data.replyMessage.text,
                lastMessageTime: data.replyMessage.time,
                messages: [...c.messages, data.replyMessage]
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

                {/* Sub-Tabs: All chats, Active (2), Requests */}
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
                    <span className="bg-pink-600 text-white rounded-full text-[9px] px-1.5 py-0.2">2</span>
                  </button>
                  <button
                    onClick={() => setActiveFilterTab("requests")}
                    className={`pb-2 px-2 transition border-b-2 cursor-pointer ${
                      activeFilterTab === "requests" ? "text-pink-600 border-pink-600 font-extrabold" : "border-transparent hover:text-stone-800"
                    }`}
                  >
                    Requests
                  </button>
                </div>

                {/* Conversation List */}
                <div className="divide-y divide-stone-100 max-h-[580px] overflow-y-auto">
                  {conversations.map(c => {
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
                  })}
                </div>
              </div>

              {/* CENTER MAIN CHAT WINDOW (6 COLUMNS) */}
              <div className="lg:col-span-6 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col h-[650px] relative overflow-hidden">
                {/* Partner Header */}
                <div className="px-4 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between bg-white sticky top-0 z-10 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={activeConv.partnerAvatar}
                        alt={activeConv.partnerName}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      />
                      {activeConv.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-stone-900 leading-snug">{activeConv.partnerName}</h3>
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

                  {/* Real Direct Contact Buttons */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/13108492091`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="1-Click WhatsApp Direct Chat"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                    >
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:+13108492091`}
                      title="1-Click Call Direct"
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>

                    <button
                      onClick={() => {
                        setToastMessage(`📱 Contact details: WhatsApp & Phone (+1 310-849-2091) • Verified Member`);
                        setTimeout(() => setToastMessage(null), 4000);
                      }}
                      className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition cursor-pointer"
                      title="More contact details"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages Stream (Scrollable Container) */}
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
                            className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-stone-300"
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
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                            alt="User Avatar"
                            className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-stone-300"
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

                {/* Toolbar Actions: Stickers, Photo, Gifts, Let's talk */}
                <div className="bg-white border-t border-stone-200 px-3 py-1.5 flex items-center gap-4 text-xs font-bold text-stone-600">
                  <button className="flex items-center gap-1 hover:text-pink-600 cursor-pointer">
                    <span>😃 Stickers ▾</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-pink-600 cursor-pointer">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Photo</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-pink-600 cursor-pointer relative">
                    <Gift className="w-3.5 h-3.5 text-amber-500" />
                    <span>Gifts</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-600 absolute -top-0.5 -right-1" />
                  </button>
                  <button className="flex items-center gap-1 hover:text-pink-600 cursor-pointer">
                    <Smile className="w-3.5 h-3.5 text-purple-600" />
                    <span>Let's talk ▾</span>
                  </button>
                </div>

                {/* Text Area Input & Send Button */}
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
                    <span>Chat: 2 cr/min ❓</span>
                    <span>• Sending a photo: 10 cr</span>
                    <span>• Sending a sticker: 5 cr</span>
                  </div>
                  <button className="text-pink-600 font-extrabold hover:underline cursor-pointer">
                    Get Credits
                  </button>
                </div>
              </div>

              {/* RIGHT SIDEBAR: CREDITS & ACTIVITY PANELS (3 COLUMNS) */}
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

                  <button className="w-full py-2 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-black text-xs rounded-xl transition cursor-pointer text-center">
                    Get Credits
                  </button>
                </div>

                {/* Card 2: My Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-stone-900">My Activity</h3>

                  <div className="space-y-2 text-xs font-bold text-stone-700">
                    <div className="flex items-center justify-between p-2 bg-pink-50/70 text-pink-700 rounded-lg">
                      <span>Messages</span>
                      <span className="bg-pink-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">8</span>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg text-stone-600 cursor-pointer">
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

          {/* FLOATING AUTOMATED AI MATCHMAKER DROP-DOWN / SLIDE-UP NOTIFICATION (EXACT POPUP POINTED BY RED ARROW IN IMAGE.PNG!) */}
          {showAiMatchPopup && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#121214] text-white rounded-2xl p-3.5 shadow-2xl border-2 border-pink-600/80 max-w-xs w-full animate-bounce duration-700">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-pink-400">
                  <Zap className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  <span>AI MATCHMAKER DROP</span>
                  <span className="bg-emerald-950 text-emerald-300 text-[9px] px-1 rounded border border-emerald-800 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    REAL PERSON
                  </span>
                </div>
                <button
                  onClick={() => setShowAiMatchPopup(false)}
                  className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Card Body */}
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={currentDropMatch.avatarUrl}
                    alt={currentDropMatch.name}
                    className="w-16 h-20 rounded-xl object-cover border border-stone-700 shadow-md"
                  />
                  {currentDropMatch.online && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900 shadow-sm" />
                  )}
                  <div className="absolute -bottom-1 -left-1 bg-pink-600 text-white text-[9px] font-black px-1 rounded">
                    {currentDropMatch.score}% Match
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-white truncate flex items-center gap-1">
                    <span>{currentDropMatch.name}, {currentDropMatch.age}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </h4>
                  <p className="text-[11px] text-stone-300 font-medium leading-tight mt-1 italic">
                    "{currentDropMatch.tagline}"
                  </p>

                  <button
                    onClick={() => handle1ClickSynergyMatch(currentDropMatch.id, currentDropMatch.name)}
                    className="mt-2.5 w-full py-1.5 px-3 bg-gradient-to-r from-[#b00058] to-purple-600 hover:from-pink-600 hover:to-purple-500 text-white text-xs font-black rounded-xl transition shadow-lg cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <span>1-Click Match & Chat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
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
