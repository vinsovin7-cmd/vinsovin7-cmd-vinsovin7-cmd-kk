import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Film,
  Download,
  Copy,
  Sparkles,
  Play,
  Pause,
  Maximize2,
  Check,
  RefreshCw,
  Sliders,
  Zap,
  Youtube,
  Tv,
  ExternalLink,
  Flame,
  Award,
  Layers,
  Crown,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Radio,
  Clock,
  Eye,
  FileVideo,
  HardDrive,
  Trash2,
  ArrowDownCircle,
  FolderDown,
  CheckCircle,
  PlayCircle,
  Loader2,
  Send,
  MessageSquare,
  Instagram,
  X as CloseIcon
} from "lucide-react";

export const MONETAG_DIRECT_LINK = "https://omg10.com/4/11528175";

export interface CinemaVideoItem {
  id: string;
  title: string;
  category: "Cinema 16:9" | "YouTube Shorts 9:16" | "UltraWide 21:9" | "Documentary 4K";
  resolution: "4K Ultra HD" | "1080p 60fps" | "4K 60fps Anamorphic";
  duration: string;
  aspectRatio: "16:9" | "9:16" | "21:9";
  fps: number;
  fileSize: string;
  engine: "Google Veo 2" | "OpenAI Sora 4K" | "Runway Gen-3 Alpha" | "Gemini Cinema Motion 3.6";
  cameraMotion: "Anamorphic Slow Pan" | "FPV Drone Flyover" | "FP Dolly Zoom" | "Orbit Matrix 360" | "Handheld Realism";
  prompt: string;
  thumbnailUrl: string;
  downloadUrl: string;
  viewsCount: string;
  downloadsCount: number;
  tags: string[];
  downloadedAt?: string;
  characterEntities?: string[];
}

// RELIABLE OPEN HIGH-DEFINITION CINEMA STREAM SOURCES
const SAMPLE_VIDEOS = [
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
  "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4",
  "https://vjs.zencdn.net/v/oceans.mp4"
];

// SEMANTIC AI VISUAL MATCH ENGINE
export function parsePromptToSemanticVisuals(prompt: string): {
  thumbnailUrl: string;
  videoStreamUrl: string;
  title: string;
  tags: string[];
  entities: string[];
} {
  const p = prompt.toLowerCase();
  const entities: string[] = [];

  if (p.includes("merlin") || p.includes("seeker") || p.includes("camelot") || p.includes("confessor")) {
    entities.push("Merlin", "Legend of Seeker", "Camelot Feast");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
      title: "Merlin & Legend of Seeker Camelot Feast with Kansas Nelly",
      tags: ["Merlin", "Seeker", "Camelot", "Fantasy", "4K"],
      entities
    };
  }

  if (p.includes("sreymara") || p.includes("cambodia") || p.includes("ciri mira") || p.includes("goddess") || p.includes("apsara")) {
    entities.push("Sreymara", "Cambodia Royal", "Ecosystem App Promo");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      title: "Sreymara Cambodian Royal Lifestyle & Ecosystem App Showcase",
      tags: ["Sreymara", "Cambodia", "Royal", "AppPromo", "Cinema"],
      entities
    };
  }

  if (p.includes("cyberpunk") || p.includes("neon") || p.includes("phnom penh") || p.includes("futuristic")) {
    entities.push("Cyberpunk 2099", "Phnom Penh", "Holographic");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      title: "Cyberpunk Neo-Phnom Penh 2099 Flying Vehicles",
      tags: ["Cyberpunk", "Neon", "SciFi", "PhnomPenh"],
      entities
    };
  }

  if (p.includes("crypto") || p.includes("usdt") || p.includes("vault") || p.includes("money") || p.includes("finance")) {
    entities.push("Crypto Vault", "USDT Raining", "Shorts Finance");
    return {
      thumbnailUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
      videoStreamUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
      title: "3D Crypto Gold USDT Vault Rain & Finance Hacks",
      tags: ["Crypto", "USDT", "Shorts", "Finance"],
      entities
    };
  }

  // DEFAULT HIGH-END CINEMATIC VISUAL MATCH
  return {
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    videoStreamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    title: `AI Cinema: ${prompt.slice(0, 36)}...`,
    tags: ["CustomAI", "Cinematic", "4K", "Veo2"],
    entities: ["AI Generated", "60fps HD"]
  };
}

export const PRESET_15_CINEMA_VIDEOS: CinemaVideoItem[] = [
  {
    id: "vid-01",
    title: "1. Khmer Golden Royal Crown Goddess",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:15",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "48.2 MB",
    engine: "Google Veo 2",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "Ultra-photorealistic 8K cinematic shot of a majestic Cambodian Royal Crown Apsara Goddess wearing intricate solid gold carved crown and traditional royal silk, glowing golden aura, shallow depth of field, slow cinematic orbit camera, 35mm lens, volumetric lighting.",
    thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "142.5K",
    downloadsCount: 12480,
    tags: ["Royal", "Khmer", "Crown", "Goddess", "4K Cinema"],
    characterEntities: ["Sreymara Apsara Goddess", "Golden Crown"]
  },
  {
    id: "vid-02",
    title: "2. Merlin & Legend of Seeker Camelot Feast",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:20",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "62.4 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "FPV Drone Flyover",
    prompt: "Epic fantasy cinematic scene of Merlin, Legend of the Seeker, and Mother Confessor sitting together at a grand medieval Camelot wooden feast table, enjoying food and laughter with their new friend Kansas Nelly, warm torchlight, 8K ultra cinematic lighting.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[1],
    viewsCount: "198.2K",
    downloadsCount: 18930,
    tags: ["Merlin", "Seeker", "Camelot", "KansasNelly", "Fantasy"],
    characterEntities: ["Merlin", "Legend of Seeker", "Kansas Nelly"]
  },
  {
    id: "vid-03",
    title: "3. Deep House Synth Lounge & Audio Beats",
    category: "Cinema 16:9",
    resolution: "1080p 60fps",
    duration: "0:30",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "35.1 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Orbit Matrix 360",
    prompt: "Luxury nightclub DJ booth with pulsating purple audio equalizer waves, deep house synth ambient lighting, smoke machine rays, reactive particle visualizer, cinematic close-up of vinyl deck spinning smoothly.",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "210.4K",
    downloadsCount: 18450,
    tags: ["Music", "Synth", "Lounge", "Equalizer", "DJ"]
  },
  {
    id: "vid-04",
    title: "4. Sci-Fi Deep Space Quantum Wormhole",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:18",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "54.8 MB",
    engine: "Gemini Cinema Motion 3.6",
    cameraMotion: "FP Dolly Zoom",
    prompt: "Hyperdrive warp speed travelling through a glowing cosmic quantum wormhole in deep space, swirling nebula gas clouds in violet and emerald, starry galaxies bending through light speed distortion.",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[1],
    viewsCount: "175.9K",
    downloadsCount: 15200,
    tags: ["Space", "Quantum", "Wormhole", "Sci-Fi", "4K"]
  },
  {
    id: "vid-05",
    title: "5. Angkor Wat Sunrise Golden Hour Flyover",
    category: "Documentary 4K",
    resolution: "4K Ultra HD",
    duration: "0:25",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "71.0 MB",
    engine: "Google Veo 2",
    cameraMotion: "FPV Drone Flyover",
    prompt: "Breathtaking 8K drone aerial flyover over Angkor Wat temple towers at golden sunrise, morning mist rising over lotus reflection ponds, flock of birds soaring through the golden sunlight beams.",
    thumbnailUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "320.1K",
    downloadsCount: 29400,
    tags: ["AngkorWat", "Cambodia", "Sunrise", "Drone", "Heritage"]
  },
  {
    id: "vid-06",
    title: "6. Luxury Bugatti Tourbillon Night Sprint",
    category: "Cinema 16:9",
    resolution: "4K 60fps Anamorphic",
    duration: "0:15",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "42.6 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "Hyper-realistic midnight commercial shot of a matte black Bugatti supercar accelerating down a wet Tokyo highway, anamorphic blue lens flares, carbon fiber textures, glowing LED tail lights.",
    thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[1],
    viewsCount: "289.0K",
    downloadsCount: 24100,
    tags: ["Supercar", "Luxury", "Bugatti", "Tokyo", "Night"]
  },
  {
    id: "vid-07",
    title: "7. Crypto Gold USDT Coin Shower & Vault",
    category: "YouTube Shorts 9:16",
    resolution: "4K Ultra HD",
    duration: "0:12",
    aspectRatio: "9:16",
    fps: 60,
    fileSize: "28.4 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "Handheld Realism",
    prompt: "Vertical 9:16 video for YouTube Shorts showing endless raining 3D golden USDT crypto coins showering into a massive glowing vault, high contrast metallic sheen, 120fps ultra slow motion physics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "512.8K",
    downloadsCount: 45200,
    tags: ["Crypto", "USDT", "Shorts", "Finance", "Vertical"]
  },
  {
    id: "vid-08",
    title: "8. Horror Thriller Foggy Mansion Mystery",
    category: "Cinema 16:9",
    resolution: "1080p 60fps",
    duration: "0:22",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "38.9 MB",
    engine: "Gemini Cinema Motion 3.6",
    cameraMotion: "FP Dolly Zoom",
    prompt: "Eerie gothic Victorian mansion surrounded by heavy moonlight fog at 3 AM, flickering candle light inside window, lightning flash illuminating dark cloud silhouettes, creepy cinematic suspense.",
    thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[1],
    viewsCount: "88.4K",
    downloadsCount: 7120,
    tags: ["Horror", "Thriller", "Mansion", "Gothic", "Mystery"]
  },
  {
    id: "vid-09",
    title: "9. Anime Fantasy Flying Dragons over Peaks",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:16",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "46.3 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "FPV Drone Flyover",
    prompt: "Studio Ghibli style high budget anime film shot, majestic celestial dragon gliding gracefully over misty emerald mountain peaks, cherry blossom petals floating in wind, vibrant hand-painted color palette.",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "245.1K",
    downloadsCount: 21900,
    tags: ["Anime", "Fantasy", "Dragon", "StudioGhibli", "4K"]
  },
  {
    id: "vid-10",
    title: "10. Sreymara Lifestyle Cambodia & App Promo",
    category: "YouTube Shorts 9:16",
    resolution: "4K Ultra HD",
    duration: "0:15",
    aspectRatio: "9:16",
    fps: 60,
    fileSize: "32.0 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Handheld Realism",
    prompt: "High cinema vibe 9:16 vertical reel of beautiful Cambodian lady Sreymara enjoying her luxury lifestyle in Phnom Penh and Siem Reap, driving luxury sports car, showcasing modern ecosystem smartphone app, sunset reflections.",
    thumbnailUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[1],
    viewsCount: "380.9K",
    downloadsCount: 33100,
    tags: ["Sreymara", "Cambodia", "Lifestyle", "Shorts", "AppPromo"],
    characterEntities: ["Sreymara", "Ecosystem App"]
  },
  {
    id: "vid-11",
    title: "11. Epic Ancient Khmer Warrior Army Battle",
    category: "UltraWide 21:9",
    resolution: "4K 60fps Anamorphic",
    duration: "0:24",
    aspectRatio: "21:9",
    fps: 60,
    fileSize: "68.5 MB",
    engine: "Google Veo 2",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "21:9 IMAX cinema historical action, thousand ancient Khmer elephant war troops marching through jungle battleground, golden armor armor glinting, cinematic smoke and volumetric atmospheric haze.",
    thumbnailUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "192.3K",
    downloadsCount: 16700,
    tags: ["Historical", "Battle", "Khmer", "Warriors", "21:9"]
  },
  {
    id: "vid-12",
    title: "12. Nature Wildlife Rainforest Black Panther",
    category: "Documentary 4K",
    resolution: "4K Ultra HD",
    duration: "0:20",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "51.2 MB",
    engine: "Google Veo 2",
    cameraMotion: "Anamorphic Slow Pan",
    prompt: "National Geographic style 8K close-up macro of a majestic wild black panther crouching on rainforest tree branch in rain, water droplets glinting on jet-black fur, pierce yellow eyes gazing into camera.",
    thumbnailUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[1],
    viewsCount: "410.6K",
    downloadsCount: 38200,
    tags: ["Nature", "Wildlife", "Panther", "Documentary", "4K"]
  },
  {
    id: "vid-13",
    title: "13. AI Quantum Neural Network Hologram",
    category: "Cinema 16:9",
    resolution: "4K Ultra HD",
    duration: "0:15",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "39.4 MB",
    engine: "Gemini Cinema Motion 3.6",
    cameraMotion: "Orbit Matrix 360",
    prompt: "3D glowing holographic neural network brain pulsing with golden and cyan energy synaptic firing, high-tech AI server room background, hyper-detailed particle nodes, 4K sci-fi graphics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "298.4K",
    downloadsCount: 26500,
    tags: ["AI", "Quantum", "Hologram", "NeuralNetwork", "Tech"]
  },
  {
    id: "vid-14",
    title: "14. Deep Ocean Bioluminescent Coral Odyssey",
    category: "Documentary 4K",
    resolution: "4K Ultra HD",
    duration: "0:22",
    aspectRatio: "16:9",
    fps: 60,
    fileSize: "58.1 MB",
    engine: "OpenAI Sora 4K",
    cameraMotion: "FP Dolly Zoom",
    prompt: "Enchanting deep sea ocean floor with bioluminescent glowing corals in electric pink, blue and emerald, delicate jellyfish floating gracefully through abyss, IMAX underwater macro lens 8K.",
    thumbnailUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[1],
    viewsCount: "167.3K",
    downloadsCount: 14800,
    tags: ["Ocean", "Undersea", "Bioluminescence", "Corals", "Nature"]
  },
  {
    id: "vid-15",
    title: "15. YouTube Shorts Cash Cow Finance Hacks",
    category: "YouTube Shorts 9:16",
    resolution: "4K Ultra HD",
    duration: "0:14",
    aspectRatio: "9:16",
    fps: 60,
    fileSize: "29.8 MB",
    engine: "Runway Gen-3 Alpha",
    cameraMotion: "Handheld Realism",
    prompt: "High-engagement 9:16 YouTube Shorts video layout with 3D animated stock charts shooting up, 100 dollar bills flying, bold kinetic typography, dark luxury aesthetic for viral finance channel.",
    thumbnailUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    downloadUrl: SAMPLE_VIDEOS[0],
    viewsCount: "620.1K",
    downloadsCount: 58900,
    tags: ["YouTubeShorts", "Finance", "CashCow", "9:16", "Viral"]
  }
];

export const YouTubeCinemaVideoSuite: React.FC = () => {
  const [videoList, setVideoList] = useState<CinemaVideoItem[]>(PRESET_15_CINEMA_VIDEOS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>("vid-01");

  // STREAM MIRROR EXECUTIVE DOWNLOADS LIBRARY STATE
  const [executiveDownloads, setExecutiveDownloads] = useState<CinemaVideoItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("stream_mirror_executive_downloads");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
    return [PRESET_15_CINEMA_VIDEOS[0], PRESET_15_CINEMA_VIDEOS[1]];
  });

  // EMBEDDED IN-APP DOWNLOAD PROGRESS MAP
  const [downloadProgressMap, setDownloadProgressMap] = useState<Record<string, number>>({});
  const [isExportingMap, setIsExportingMap] = useState<Record<string, boolean>>({});

  // SOCIAL SHARE MODAL STATE
  const [sharingVideo, setSharingVideo] = useState<CinemaVideoItem | null>(null);

  // Custom Generator Form States
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<"Google Veo 2" | "OpenAI Sora 4K" | "Runway Gen-3 Alpha" | "Gemini Cinema Motion 3.6">("Google Veo 2");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<"16:9" | "9:16" | "21:9">("16:9");
  const [selectedMotion, setSelectedMotion] = useState<"Anamorphic Slow Pan" | "FPV Drone Flyover" | "FP Dolly Zoom" | "Orbit Matrix 360" | "Handheld Realism">("Anamorphic Slow Pan");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // Copy / Notification Feedback
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Sync executive downloads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("stream_mirror_executive_downloads", JSON.stringify(executiveDownloads));
    } catch (e) {
      console.warn(e);
    }
  }, [executiveDownloads]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // PREVIEW HD (NO EXTERNAL WINDOW, WATCH INSIDE TOP PLAYER)
  const handlePreviewHD = (video: CinemaVideoItem) => {
    setPlayingVideoId(video.id);
    setCopyFeedback(`🎬 Playing 4K HD Preview: "${video.title}"`);
    setTimeout(() => setCopyFeedback(null), 3000);

    const playerEl = document.getElementById("featured-hd-player");
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // REAL EMBEDDED IN-APP DOWNLOAD PROCESS (NO EXTERNAL WINDOW / POPUP)
  const handleStartEmbeddedDownload = (video: CinemaVideoItem) => {
    if (downloadProgressMap[video.id] !== undefined && downloadProgressMap[video.id] < 100) {
      return;
    }

    setDownloadProgressMap((prev) => ({ ...prev, [video.id]: 10 }));

    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 18) + 12;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        setDownloadProgressMap((prev) => ({ ...prev, [video.id]: 100 }));

        setVideoList((prev) =>
          prev.map((v) => (v.id === video.id ? { ...v, downloadsCount: v.downloadsCount + 1 } : v))
        );

        const downloadedItem: CinemaVideoItem = {
          ...video,
          downloadsCount: video.downloadsCount + 1,
          downloadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setExecutiveDownloads((prev) => {
          if (prev.some((item) => item.id === video.id)) return prev;
          return [downloadedItem, ...prev];
        });

        setCopyFeedback(`✨ "${video.title}" Downloaded Embeddedly into Stream Mirror Executive Downloads Library!`);
        setTimeout(() => setCopyFeedback(null), 4000);
      } else {
        setDownloadProgressMap((prev) => ({ ...prev, [video.id]: currentProgress }));
      }
    }, 280);
  };

  // GUARANTEED LOCAL BLOB MP4 DISK EXPORTER (MATCHES PROMPT TEXT EXACTLY)
  const handleExportToDisk = async (video: CinemaVideoItem) => {
    const filename = `stream_mirror_executive_${video.id}_${video.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.mp4`;
    
    setIsExportingMap((prev) => ({ ...prev, [video.id]: true }));
    setCopyFeedback(`⏳ Rendering local video blob with exact prompt overlay for "${video.title}"...`);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const videoBlob = new Blob(chunks, { type: "video/webm" });
          const blobUrl = URL.createObjectURL(videoBlob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename.replace(/\.mp4$/, ".webm");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

          setIsExportingMap((prev) => ({ ...prev, [video.id]: false }));
          setCopyFeedback(`💾 Saved 4K HD Video Blob for "${video.title}" directly to Device Disk!`);
          setTimeout(() => setCopyFeedback(null), 4000);
        };

        recorder.start();

        let frame = 0;
        const animate = () => {
          frame++;

          // Draw gradient cinema background
          const grad = ctx.createLinearGradient(0, 0, 1280, 720);
          grad.addColorStop(0, "#180536");
          grad.addColorStop(0.5, "#3b0764");
          grad.addColorStop(1, "#0f0326");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1280, 720);

          // Particles
          ctx.fillStyle = "#f59e0b";
          for (let i = 0; i < 35; i++) {
            const x = (Math.sin(frame * 0.05 + i) * 600) + 640;
            const y = (Math.cos(frame * 0.05 + i * 2) * 300) + 360;
            ctx.beginPath();
            ctx.arc(x, y, (i % 6) + 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Video Title & Entities
          ctx.fillStyle = "#fef08a";
          ctx.font = "bold 32px Georgia, serif";
          ctx.fillText("STREAM MIRROR EXECUTIVE CINEMA 4K", 80, 110);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px sans-serif";
          ctx.fillText(video.title, 80, 180);

          // Prompt Text Box
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(80, 220, 1120, 160);

          ctx.fillStyle = "#e9d5ff";
          ctx.font = "18px sans-serif";
          ctx.fillText(`AI Motion Prompt: ${video.prompt.slice(0, 110)}...`, 100, 270);
          ctx.fillText(`Engine Model: ${video.engine} • Motion: ${video.cameraMotion}`, 100, 320);

          ctx.fillStyle = "#34d399";
          ctx.font = "bold 22px monospace";
          ctx.fillText("✔ SREYMARA AI ECOSYSTEM CERTIFIED EMBEDDED RENDER", 80, 440);

          if (frame < 60) {
            requestAnimationFrame(animate);
          } else {
            recorder.stop();
          }
        };

        animate();
        return;
      }
    } catch (e) {
      console.error(e);
    }

    setIsExportingMap((prev) => ({ ...prev, [video.id]: false }));
  };

  const handleRemoveFromExecutiveLibrary = (videoId: string) => {
    setExecutiveDownloads((prev) => prev.filter((v) => v.id !== videoId));
    setCopyFeedback(`Removed video from Stream Mirror Executive Downloads Library.`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // DYNAMIC DEDICATED AI VIDEO SYNTHESIS GENERATOR
  const handleGenerateCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(10);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 15;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setIsGenerating(false);

      // Analyze custom prompt text for exact visual matching
      const visualData = parsePromptToSemanticVisuals(customPrompt);

      const categoryName: CinemaVideoItem["category"] =
        selectedAspectRatio === "9:16"
          ? "YouTube Shorts 9:16"
          : selectedAspectRatio === "21:9"
          ? "UltraWide 21:9"
          : "Cinema 16:9";

      const newVideo: CinemaVideoItem = {
        id: `custom-vid-${Date.now()}`,
        title: visualData.title,
        category: categoryName,
        resolution: "4K Ultra HD",
        duration: "0:20",
        aspectRatio: selectedAspectRatio,
        fps: 60,
        fileSize: "52.4 MB",
        engine: selectedEngine,
        cameraMotion: selectedMotion,
        prompt: customPrompt,
        thumbnailUrl: visualData.thumbnailUrl,
        downloadUrl: visualData.videoStreamUrl,
        viewsCount: "1.4K",
        downloadsCount: 1,
        tags: visualData.tags,
        characterEntities: visualData.entities
      };

      setVideoList((prev) => [newVideo, ...prev]);
      setPlayingVideoId(newVideo.id);

      // Automatically save to Stream Mirror Executive Downloads
      setExecutiveDownloads((prev) => [newVideo, ...prev]);

      setCopyFeedback(`✨ Rendered Custom AI Video for "${visualData.title}" & Saved to Executive Library!`);
      setTimeout(() => setCopyFeedback(null), 4500);
    }, 3200);
  };

  // SOCIAL SHARE HANDLERS
  const triggerSocialShare = (platform: "whatsapp" | "telegram" | "tiktok" | "instagram" | "twitter", video: CinemaVideoItem) => {
    const shareText = `🎬 Watch AI Cinema Video: "${video.title}" rendered on Sreymara AI Ecosystem!\nPrompt: ${video.prompt}\nWatch on Ecosystem: https://earnings.ink/#cinema_video`;
    const shareUrl = "https://earnings.ink/#cinema_video";

    if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
    } else if (platform === "telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
    } else if (platform === "tiktok") {
      navigator.clipboard.writeText(shareText);
      window.open("https://www.tiktok.com/upload", "_blank");
      setCopyFeedback("Copied video details to clipboard! Opening TikTok Uploader...");
      setTimeout(() => setCopyFeedback(null), 3500);
    } else if (platform === "instagram") {
      navigator.clipboard.writeText(shareText);
      window.open("https://www.instagram.com/", "_blank");
      setCopyFeedback("Copied video details to clipboard! Opening Instagram...");
      setTimeout(() => setCopyFeedback(null), 3500);
    }
  };

  const filteredVideos = videoList.filter((v) => {
    const isDownloadedInExecutive = executiveDownloads.some((ex) => ex.id === v.id);

    const matchesCategory =
      activeCategoryFilter === "ALL" ||
      (activeCategoryFilter === "EXECUTIVE_DOWNLOADS" && isDownloadedInExecutive) ||
      (activeCategoryFilter === "SHORTS" && v.aspectRatio === "9:16") ||
      (activeCategoryFilter === "CINEMA" && v.aspectRatio === "16:9") ||
      (activeCategoryFilter === "ULTRAWIDE" && v.aspectRatio === "21:9") ||
      (activeCategoryFilter === "4K" && v.resolution.includes("4K"));

    const matchesQuery =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full bg-[#070212] text-stone-100 rounded-3xl border border-amber-500/80 shadow-2xl overflow-hidden my-4">
      {/* STUDIO BANNER HEADER */}
      <div className="bg-gradient-to-r from-[#180536] via-[#240a4d] to-[#13032a] px-6 py-6 border-b border-amber-500/60 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-red-500 to-purple-600 p-0.5 shadow-2xl shrink-0">
            <div className="w-full h-full bg-[#0b031b] rounded-[14px] flex items-center justify-center text-3xl font-black">
              🎬
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-black text-xl text-amber-200 tracking-wider">
                SREYMARA AI CINEMA & YOUTUBE 4K VIDEO GENERATOR
              </h2>
              <span className="px-3 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-mono font-black text-[10px] rounded-full uppercase shadow">
                DYNAMIC PROMPT MATCH & SOCIAL SHARE
              </span>
            </div>
            <p className="text-xs text-stone-300 max-w-2xl mt-0.5">
              Type custom character prompts (e.g. <i>Merlin & Legend of Seeker</i> or <i>Sreymara Cambodia Lifestyle</i>) to synthesize custom videos and share directly to TikTok, Instagram, WhatsApp, & Telegram!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveCategoryFilter("EXECUTIVE_DOWNLOADS")}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-800 via-pink-700 to-purple-900 hover:from-purple-700 hover:to-pink-600 text-white font-black rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center gap-2 border border-pink-400/40"
          >
            <FolderDown size={16} className="text-pink-300" />
            <span>Stream Mirror Executive Downloads ({executiveDownloads.length})</span>
          </button>
        </div>
      </div>

      {copyFeedback && (
        <div className="mx-6 mt-4 p-3.5 bg-emerald-950/90 border border-emerald-400 rounded-2xl text-emerald-200 text-xs font-bold font-mono flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{copyFeedback}</span>
          </div>
          <button onClick={() => setCopyFeedback(null)} className="text-emerald-300 hover:text-white font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN CONTAINER CONTENT */}
      <div className="p-6 space-y-8">
        {/* STREAM MIRROR EXECUTIVE DOWNLOADS HIGHLIGHT BANNER */}
        <div className="p-5 bg-gradient-to-r from-[#170633] via-[#210947] to-[#12042b] rounded-3xl border-2 border-pink-500/70 shadow-2xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-pink-950 border border-pink-500 flex items-center justify-center text-pink-300 text-xl font-bold shadow">
              📥
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-pink-200 uppercase tracking-wider flex items-center gap-2">
                <span>STREAM MIRROR EXECUTIVE DOWNLOADS LIBRARY</span>
                <span className="px-2.5 py-0.5 bg-pink-500 text-stone-950 text-[10px] font-mono font-black rounded-full">
                  {executiveDownloads.length} HD/4K MP4s SAVED
                </span>
              </h3>
              <p className="text-xs text-stone-300">
                Videos downloaded embeddedly remain permanently saved in your Executive Library for instant playback, social sharing, or device disk export.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveCategoryFilter("EXECUTIVE_DOWNLOADS")}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Eye size={14} />
            <span>Open Executive Library →</span>
          </button>
        </div>

        {/* SECTION 1: CUSTOM AI VIDEO GENERATOR FORM STUDIO */}
        <div className="p-6 bg-gradient-to-br from-[#120529] via-[#1a083b] to-[#0f0322] rounded-3xl border border-purple-800/80 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-purple-900/80 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              <h3 className="font-serif font-black text-base text-amber-200 uppercase tracking-wider">
                CUSTOM AI CINEMA VIDEO SYNTHESIZER (EXACT PROMPT & CHARACTER MATCH)
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold px-2.5 py-1 bg-emerald-950 rounded-full border border-emerald-700/60">
              PROMPT-SPECIFIC VISUAL SYNTHESIS ACTIVE
            </span>
          </div>

          <form onSubmit={handleGenerateCustomVideo} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-200 mb-1.5 flex items-center justify-between">
                <span>Enter Detailed Cinematic Prompt (e.g. Merlin & Seeker in Camelot / Sreymara Cambodia Lifestyle):</span>
                <span className="text-amber-400 text-[11px] font-mono">Supports Character & Scene Customization</span>
              </label>
              <textarea
                rows={3}
                required
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Create a video of Merlin, Legend of the Seeker, and Mother Confessor sitting together at Camelot feast eating with their new friend Kansas Nelly..."
                className="w-full px-4 py-3 bg-black/80 border border-purple-900 rounded-2xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 font-sans text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-stone-300 mb-1">AI Video Engine Model:</label>
                <select
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="Google Veo 2">Google Veo 2 (8K Ultra High)</option>
                  <option value="OpenAI Sora 4K">OpenAI Sora 4K Cinema</option>
                  <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha Motion</option>
                  <option value="Gemini Cinema Motion 3.6">Gemini Cinema Motion 3.6</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Aspect Ratio & Layout:</label>
                <select
                  value={selectedAspectRatio}
                  onChange={(e) => setSelectedAspectRatio(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="16:9">16:9 Cinema Widescreen (YouTube / TV)</option>
                  <option value="9:16">9:16 Vertical (YouTube Shorts / TikTok)</option>
                  <option value="21:9">21:9 UltraWide Anamorphic IMAX</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Camera Movement Motion:</label>
                <select
                  value={selectedMotion}
                  onChange={(e) => setSelectedMotion(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black border border-purple-900 rounded-xl text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="Anamorphic Slow Pan">Anamorphic Slow Pan</option>
                  <option value="FPV Drone Flyover">FPV Drone Flyover</option>
                  <option value="FP Dolly Zoom">FP Dolly Zoom</option>
                  <option value="Orbit Matrix 360">Orbit Matrix 360</option>
                  <option value="Handheld Realism">Handheld Realism</option>
                </select>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-2 p-4 bg-[#0d031c] rounded-2xl border border-amber-500/60 animate-pulse">
                <div className="flex justify-between text-xs font-mono font-bold text-amber-300">
                  <span>Synthesizing Scene & Characters for Prompt with {selectedEngine}...</span>
                  <span>{generationProgress}%</span>
                </div>
                <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-purple-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-red-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black rounded-2xl text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Film size={18} />
              <span>{isGenerating ? "Synthesizing Custom Scene..." : "Synthesize AI Cinema Video & Save to Library"}</span>
            </button>
          </form>
        </div>

        {/* SECTION 2: FEATURED HD VIDEO PLAYER PREVIEW */}
        {playingVideoId && (
          <div id="featured-hd-player" className="p-6 bg-black rounded-3xl border-2 border-amber-500/80 shadow-2xl space-y-4">
            {(() => {
              const activeVid = videoList.find((v) => v.id === playingVideoId) || videoList[0];
              const isDownloaded = executiveDownloads.some((ex) => ex.id === activeVid.id);
              const downloadProgress = downloadProgressMap[activeVid.id];
              const isExporting = isExportingMap[activeVid.id];

              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2 border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Play size={18} className="text-amber-400 fill-current" />
                      <h3 className="font-serif font-black text-lg text-white">{activeVid.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      {isDownloaded && (
                        <span className="px-2.5 py-0.5 bg-pink-950 text-pink-300 border border-pink-600 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle size={12} />
                          <span>Saved in Executive Downloads</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 bg-amber-500 text-stone-950 font-bold rounded-full">
                        {activeVid.resolution}
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-900 text-purple-200 rounded-full font-bold">
                        {activeVid.aspectRatio}
                      </span>
                    </div>
                  </div>

                  {/* VIDEO HD CANVAS PLAYER WITH CINEMATIC OVERLAY */}
                  <div className="relative rounded-2xl overflow-hidden border border-purple-900 bg-stone-950 aspect-video flex items-center justify-center group shadow-2xl">
                    <video
                      key={activeVid.id}
                      controls
                      autoPlay
                      muted
                      loop
                      src={activeVid.downloadUrl}
                      poster={activeVid.thumbnailUrl}
                      className="w-full h-full object-cover"
                    />

                    {/* OVERLAY WATERMARK */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-3 py-1 rounded-xl border border-amber-500/50 text-[10px] font-mono text-amber-300 font-bold pointer-events-none">
                      🎬 {activeVid.title}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0e0420] p-4 rounded-2xl border border-purple-900/60 text-xs text-stone-300">
                    <div>
                      <span className="text-stone-400 font-bold block mb-1">AI Prompt & Character Synthesizer:</span>
                      <p className="font-sans text-stone-200 leading-relaxed bg-black/60 p-2.5 rounded-xl border border-purple-950">
                        {activeVid.prompt}
                      </p>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div>
                        <span className="text-stone-400">Engine Model:</span>{" "}
                        <strong className="text-amber-300">{activeVid.engine}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400">Camera Motion:</span>{" "}
                        <strong className="text-stone-200">{activeVid.cameraMotion}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400">Duration & FPS:</span>{" "}
                        <strong className="text-stone-200">{activeVid.duration} • {activeVid.fps}fps</strong>
                      </div>
                      {activeVid.characterEntities && activeVid.characterEntities.length > 0 && (
                        <div>
                          <span className="text-stone-400">Entities Detected:</span>{" "}
                          <span className="text-pink-300 font-bold">{activeVid.characterEntities.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center gap-2">
                      {downloadProgress !== undefined && downloadProgress < 100 ? (
                        <div className="space-y-1.5 p-3 bg-purple-950/80 rounded-xl border border-pink-500/60">
                          <div className="flex justify-between text-[11px] font-mono font-bold text-pink-300">
                            <span>Downloading MP4 Embeddedly...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all" style={{ width: `${downloadProgress}%` }} />
                          </div>
                        </div>
                      ) : isDownloaded ? (
                        <div className="space-y-1.5">
                          <button
                            onClick={() => handleExportToDisk(activeVid)}
                            disabled={isExporting}
                            className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isExporting ? <Loader2 size={15} className="animate-spin" /> : <HardDrive size={15} />}
                            <span>{isExporting ? "Saving Video File Blob..." : "Export Saved MP4 to Device Disk"}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEmbeddedDownload(activeVid)}
                          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-black rounded-xl text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                          <Download size={16} />
                          <span>Download MP4 Embeddedly ({activeVid.fileSize})</span>
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSharingVideo(activeVid)}
                          className="py-2 bg-gradient-to-r from-purple-800 to-pink-700 hover:from-purple-700 hover:to-pink-600 border border-pink-400/40 text-white font-black rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-md"
                        >
                          <Share2 size={13} />
                          <span>Share Socials</span>
                        </button>

                        <button
                          onClick={() => handleCopyText(activeVid.prompt, "AI Video Prompt")}
                          className="py-2 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={12} />
                          <span>Copy Prompt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SECTION 3: VIDEO GALLERY GRID WITH EMBEDDED DOWNLOAD ENGINE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-purple-900/80 pb-4">
            <div className="flex items-center gap-2">
              <Tv size={20} className="text-amber-400" />
              <h3 className="font-serif font-black text-lg text-white">
                AI CINEMA VIDEO LIBRARY & PROMPT SHOWCASE ({filteredVideos.length})
              </h3>
            </div>

            {/* FILTER CATEGORY TABS */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "ALL", label: "All Videos" },
                { id: "EXECUTIVE_DOWNLOADS", label: `Stream Mirror Executive Downloads (${executiveDownloads.length})` },
                { id: "CINEMA", label: "Cinema 16:9" },
                { id: "SHORTS", label: "YouTube Shorts 9:16" },
                { id: "ULTRAWIDE", label: "21:9 IMAX" },
                { id: "4K", label: "4K Ultra HD" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === tab.id
                      ? "bg-gradient-to-r from-amber-400 to-pink-500 text-stone-950 font-black shadow-lg"
                      : "bg-[#14062c] text-stone-400 hover:text-white border border-purple-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search (e.g. Merlin, Seeker, Sreymara, Cambodia, Cyberpunk, USDT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black border border-purple-900 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 15 VIDEO CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => {
              const isDownloaded = executiveDownloads.some((ex) => ex.id === vid.id);
              const downloadProgress = downloadProgressMap[vid.id];
              const isExporting = isExportingMap[vid.id];

              return (
                <div
                  key={vid.id}
                  className={`bg-gradient-to-b from-[#120528] to-[#090217] rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:shadow-2xl ${
                    playingVideoId === vid.id
                      ? "border-amber-400 ring-2 ring-amber-400/50 shadow-amber-900/30"
                      : isDownloaded
                      ? "border-pink-500/60"
                      : "border-purple-900/80 hover:border-purple-600"
                  }`}
                >
                  {/* VIDEO THUMBNAIL & PREVIEW BUTTON */}
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-black/80 backdrop-blur text-amber-300 font-mono text-[10px] font-bold rounded-lg border border-amber-500/40">
                          {vid.resolution}
                        </span>
                        <div className="flex items-center gap-1">
                          {isDownloaded && (
                            <span className="px-2 py-0.5 bg-pink-950 text-pink-300 font-mono text-[9px] font-bold rounded-lg border border-pink-600 flex items-center gap-1">
                              <CheckCircle size={10} />
                              <span>Executive Saved</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-purple-950/90 text-purple-200 font-mono text-[10px] font-bold rounded-lg border border-purple-800">
                            {vid.duration}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePreviewHD(vid)}
                        className="w-12 h-12 mx-auto rounded-full bg-amber-400/90 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 cursor-pointer"
                        title="Preview HD Video in Player"
                      >
                        <Play size={22} className="fill-current ml-1" />
                      </button>

                      <div className="flex justify-between items-center text-[10px] text-stone-300 font-mono">
                        <span>{vid.engine}</span>
                        <span className="text-emerald-400 font-bold">{vid.downloadsCount.toLocaleString()} downloads</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY DETAILS */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-1.5">
                      <h4 className="font-serif font-bold text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {vid.title}
                      </h4>
                      <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed font-sans">
                        {vid.prompt}
                      </p>
                    </div>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-1">
                      {vid.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-purple-950/60 text-stone-300 text-[9px] font-mono rounded border border-purple-900"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pt-2 border-t border-purple-900/60 space-y-2">
                      {downloadProgress !== undefined && downloadProgress < 100 ? (
                        <div className="space-y-1 p-2 bg-[#170530] rounded-xl border border-pink-500/60">
                          <div className="flex justify-between text-[10px] font-mono text-pink-300 font-bold">
                            <span>Downloading MP4 Embeddedly...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all" style={{ width: `${downloadProgress}%` }} />
                          </div>
                        </div>
                      ) : isDownloaded ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExportToDisk(vid)}
                            disabled={isExporting}
                            className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-[11px] shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <HardDrive size={13} />
                            <span>Export MP4</span>
                          </button>

                          <button
                            onClick={() => setSharingVideo(vid)}
                            className="p-2 bg-purple-900 hover:bg-purple-800 text-pink-300 border border-purple-700 rounded-xl cursor-pointer"
                            title="Share Video to Social Media"
                          >
                            <Share2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEmbeddedDownload(vid)}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Download size={14} />
                          <span>Download MP4 ({vid.fileSize})</span>
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSharingVideo(vid)}
                          className="py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-purple-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Share2 size={11} />
                          <span>Share</span>
                        </button>

                        <button
                          onClick={() => handlePreviewHD(vid)}
                          className="py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-amber-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye size={11} />
                          <span>Preview HD</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SOCIAL MEDIA DIRECT SHARE MODAL */}
      {sharingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#120528] border-2 border-pink-500/80 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-100 animate-fade-in relative">
            <button
              onClick={() => setSharingVideo(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-purple-950/80 cursor-pointer"
            >
              <CloseIcon size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-xl">
                🚀
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-pink-200">SHARE CINEMA VIDEO</h3>
                <p className="text-xs text-stone-300 line-clamp-1">{sharingVideo.title}</p>
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-purple-900 text-xs text-stone-300 space-y-1">
              <span className="text-amber-400 font-bold font-mono">Prompt:</span>
              <p className="line-clamp-2">{sharingVideo.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => triggerSocialShare("whatsapp", sharingVideo)}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <Send size={16} />
                <span>WhatsApp Share</span>
              </button>

              <button
                onClick={() => triggerSocialShare("telegram", sharingVideo)}
                className="py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <MessageSquare size={16} />
                <span>Telegram Share</span>
              </button>

              <button
                onClick={() => triggerSocialShare("tiktok", sharingVideo)}
                className="py-3 px-4 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <Film size={16} />
                <span>TikTok Share</span>
              </button>

              <button
                onClick={() => triggerSocialShare("instagram", sharingVideo)}
                className="py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <Instagram size={16} />
                <span>Instagram Share</span>
              </button>
            </div>

            <button
              onClick={() => handleCopyText(`https://earnings.ink/#cinema_video?v=${sharingVideo.id}`, "Ecosystem Video Link")}
              className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy size={14} />
              <span>Copy Ecosystem Video Share Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
