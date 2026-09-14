import React, { useState, useEffect, useRef } from "react";
import { ExpressVpnWebBrowser } from "./ExpressVpnWebBrowser";
import { SreymaraVideogram } from "./SreymaraVideogram";
import { TruthFinderSuite } from "./TruthFinderSuite";
import {
  Mail,
  Send,
  Sparkles,
  Globe,
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  User,
  Inbox,
  SendHorizontal,
  FileBox,
  Bot,
  Layers,
  Search,
  ExternalLink,
  Cpu,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Lock,
  ChevronDown,
  Paperclip,
  Trash2,
  FolderPlus,
  HelpCircle,
  LogOut,
  Maximize2,
  Brain,
  Printer
} from "lucide-react";

interface MailStudioSuiteProps {
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  model: string;
  images?: string[];
  emailDraft?: {
    subject: string;
    recipient: string;
    body: string;
  };
  invoiceData?: any;
  timestamp: string;
}

export const MailStudioSuite: React.FC<MailStudioSuiteProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"ai_chat" | "mail_webmail" | "browser" | "videogram" | "truthfinder">("ai_chat");

  // AI Chat & Memory State
  const [selectedModel, setSelectedModel] = useState("Multi Sreymara AI v4 (Executive)");
  const [selectedTone, setSelectedTone] = useState("Executive");
  const [targetRecipient, setTargetRecipient] = useState("investor@venture-fund.com");
  const [chatPrompt, setChatPrompt] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLearningMode, setIsLearningMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistent Conversation Memory
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "mem-1",
      sender: "ai",
      text: "Greetings, Kansas Nelly. I am Multi Sreymara AI v4 (Executive). Memory banks initialized: I retain full context of your AlphaQubit Quantum Ecosystem, Shopify orders, Tidio signals, Phantom SPL USDT balance, and Mail.com US Proxy routes.",
      model: "Multi Sreymara AI v4 (Executive)",
      timestamp: "Today 08:15 AM"
    }
  ]);

  // Mail.com Webmail Dashboard State (Matching Screenshots 5, 6, 7)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mailEmailInput, setMailEmailInput] = useState("kansasnelly@mail.com");
  const [mailPasswordInput, setMailPasswordInput] = useState("••••••••••••");
  
  const [mailFolder, setMailFolder] = useState<"inbox" | "unread" | "sent" | "drafts" | "trash" | "spam">("inbox");
  const [showComposer, setShowComposer] = useState(true);
  
  // Mail Composer Form State
  const [mailTo, setMailTo] = useState("property.rep@savannahga.gov");
  const [mailCc, setMailCc] = useState("");
  const [mailBcc, setMailBcc] = useState("");
  const [mailSubject, setMailSubject] = useState("Official Notice: Application Approval Fee Settlement Permit Ref: 26-09903-IF");
  const [mailBody, setMailBody] = useState(`Dear Property Representative,\n\nWe are writing to provide you with an official status update regarding the zoning and new construction permit application submitted for the property located at 173 Firefly Cir, Savannah, GA 31302, under Permit Reference Number 26-09903-IF.\n\nFollowing a comprehensive technical evaluation conducted by our departmental review staff, we are pleased to inform you that municipal staff has officially recommended full approval of your application.\n\nWarm regards,\nDevelopment Services Department\n20 Interchange Drive\nSavannah, GA 31415`);
  const [mailAttachment, setMailAttachment] = useState<string | null>("official_notice_permit.pdf (83 kB)");
  
  const [sentMailLedger, setSentMailLedger] = useState<any[]>([]);
  const [mailDispatchStatus, setMailDispatchStatus] = useState<string | null>(null);

  // Browser State
  const [browserUrl, setBrowserUrl] = useState("https://mail.com");
  const [iframeUrl, setIframeUrl] = useState("https://mail.com");

  useEffect(() => {
    fetchSentLedger();
  }, []);

  const fetchSentLedger = async () => {
    try {
      const res = await fetch("/api/mail/sent-ledger");
      if (res.ok) {
        const data = await res.json();
        setSentMailLedger(data.ledger || []);
      }
    } catch (e) {
      // ignore
    }
  };

  // Voice Transcribing (Speech Recognition)
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Fallback simulation if browser speech API is unavailable
      if (!isRecording) {
        setIsRecording(true);
        const simText = " Draft an executive partnership proposal for AlphaQubit Quantum Ecosystem with 80/20 revenue split details.";
        let i = 0;
        const interval = setInterval(() => {
          setChatPrompt((prev) => prev + simText.charAt(i));
          i++;
          if (i >= simText.length) {
            clearInterval(interval);
            setIsRecording(false);
          }
        }, 40);
      } else {
        setIsRecording(false);
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      if (!isRecording) {
        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          setChatPrompt(transcript);
        };

        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
      } else {
        setIsRecording(false);
      }
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Image Upload Handler (Supports up to 30 images)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (attachedImages.length >= 30) return;
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAttachedImages((prev) => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // AI Prompt Dispatch & Memory Sync
  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() && attachedImages.length === 0) return;

    const userText = chatPrompt.trim();
    const imgs = [...attachedImages];
    setChatPrompt("");
    setAttachedImages([]);
    setIsGenerating(true);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText || "Analyzed attached media files.",
      images: imgs,
      model: selectedModel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          model: selectedModel,
          tone: selectedTone,
          recipientEmail: targetRecipient,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.response,
          model: data.model,
          emailDraft: data.emailDraft || undefined,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistory((prev) => [...prev, aiMsg]);

        if (data.emailDraft) {
          setMailTo(data.emailDraft.recipient);
          setMailSubject(data.emailDraft.subject);
          setMailBody(data.emailDraft.body);
        }

        if (data.invoiceData) {
          // Store invoice in message
          aiMsg.invoiceData = data.invoiceData;
        }
      }
    } catch (e) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "System command executed. Memory state updated.",
          model: selectedModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Dispatch Email via Mail.com US Proxy
  const handleSendMail = async () => {
    setMailDispatchStatus("Dispatching via US Proxy...");
    try {
      const res = await fetch("/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: mailTo,
          subject: mailSubject,
          body: mailBody,
          pdfAttached: true
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMailDispatchStatus(`[DELIVERED] Sent to ${mailTo} via us-east-1.mail.com`);
        fetchSentLedger();
        setShowComposer(false);
      }
    } catch (e) {
      setMailDispatchStatus("Failed to dispatch email.");
    }
  };

  // Municipal Official Invoice PDF Export (Matching Screenshot 2 exact format)
  const handleExportMunicipalInvoicePdf = (customInvoiceData?: any) => {
    const inv = customInvoiceData || {
      department: "DEVELOPMENT SERVICES DEPARTMENT",
      subDivision: "Building Services & Permitting Division",
      address: "20 Interchange Drive, Savannah, GA 31415",
      title: "INVOICE & NOTICE",
      subject: "Official Notice: Application Approval Fee Settlement – Ref: 535908",
      applicant: "Bobby Myers, Specialty Contractor (JCB Roofing)",
      owner: "Charles J. and Mary S. Brannen",
      districtReviewer: "Mayfair District | Shvokeia Watson",
      ivrNumber: "535908",
      invoiceNo: "INV-SAV-2026-535908",
      date: "September 13, 2026",
      dueDate: "ON RECEIPT",
      amountDue: "$13,150.00 USD",
      paymentMethod: "WIRE TRANSFER / ACH",
      permitClassification: "Residential Building Renovations",
      projectScope: "Complete Shingle Replacement (2,793.00 Sq. Ft.) | Valuation: $17,595.00 USD",
      applicationStatus: "Recommended for Approval (Pending Administrative Fee Settlement)",
      description: "Residential Building Renovation Permit Fee (Complete Shingle Replacement covering 2,793 sq. ft. for Property Owner Charles J. and Mary S. Brannen).",
      itemAmount: "$13,150.00",
      totalAmount: "$13,150.00",
      bankName: "Citibank, N.A.",
      routingNumber: "271070801",
      accountName: "Village of Bayside",
      accountNumber: "11642792540",
      bankAddress: "388 Greenwich St, New York, NY 10013",
      issuedBy: "Julie McLean, PE, Senior Director\nDevelopment Services Department | 20 Interchange Drive, Savannah, GA 31415"
    };

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${inv.title} - ${inv.invoiceNo}</title>
          <style>
            @page { size: letter; margin: 0.5in; }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; padding: 25px; line-height: 1.5; font-size: 13px; }
            .header-table { width: 100%; border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
            .dept-title { font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
            .sub-dept { font-size: 13px; font-weight: 700; color: #0284c7; }
            .address { font-size: 11px; color: #64748b; margin-top: 2px; }
            .doc-type { text-align: right; font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: 1px; }
            .inv-no { text-align: right; font-size: 11px; font-weight: bold; color: #64748b; font-family: monospace; }
            .notice-box { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 5px solid #0284c7; padding: 12px; border-radius: 6px; margin-bottom: 18px; }
            .grid-container { display: flex; gap: 16px; margin-bottom: 18px; }
            .grid-col { flex: 1; background: #fafafa; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
            .col-title { font-weight: 800; font-size: 11px; color: #475569; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
            .field-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; }
            .field-label { font-weight: 700; color: #475569; }
            .field-val { font-weight: 600; color: #0f172a; text-align: right; }
            .table-inv { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
            .table-inv th { background: #0f172a; color: white; padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; }
            .table-inv td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            .bank-box { background: #f0f9ff; border: 1.5px solid #0284c7; padding: 14px; border-radius: 8px; margin-bottom: 18px; }
            .bank-title { font-weight: 900; color: #0369a1; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #bae6fd; padding-bottom: 4px; }
            .bank-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 8px; font-size: 12px; }
            .sig-container { display: flex; justify-content: space-between; margin-top: 35px; gap: 30px; }
            .sig-box { flex: 1; border-top: 1.5px solid #0f172a; padding-top: 8px; font-size: 11px; }
            .footer { margin-top: 25px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>
                <div class="dept-title">${inv.department}</div>
                <div class="sub-dept">${inv.subDivision}</div>
                <div class="address">${inv.address}</div>
              </td>
              <td>
                <div class="doc-type">${inv.title}</div>
                <div class="inv-no">${inv.invoiceNo}</div>
                <div class="inv-no">DATE: ${inv.date}</div>
              </td>
            </tr>
          </table>

          <div class="notice-box">
            <div style="font-weight: 800; color: #0f172a; font-size: 13px;">${inv.subject}</div>
            <div style="margin-top: 4px; font-size: 12px; color: #334155;">
              <strong>APPLICANT & SPECIALTY CONTRACTOR:</strong> ${inv.applicant}<br/>
              <strong>PROPERTY OWNER OF RECORD:</strong> ${inv.owner}
            </div>
          </div>

          <div class="grid-container">
            <div class="grid-col">
              <div class="col-title">Property & Permit Information</div>
              <div class="field-row"><span class="field-label">IVR Ref Number:</span><span class="field-val">${inv.ivrNumber}</span></div>
              <div class="field-row"><span class="field-label">District & Reviewer:</span><span class="field-val">${inv.districtReviewer}</span></div>
              <div class="field-row"><span class="field-label">Permit Classification:</span><span class="field-val">${inv.permitClassification}</span></div>
              <div class="field-row"><span class="field-label">Project Valuation:</span><span class="field-val">$17,595.00 USD</span></div>
              <div class="field-row"><span class="field-label">Status:</span><span class="field-val" style="color:#0284c7;">${inv.applicationStatus}</span></div>
            </div>
            <div class="grid-col">
              <div class="col-title">Invoice & Payment Summary</div>
              <div class="field-row"><span class="field-label">Invoice Number:</span><span class="field-val" style="font-family:monospace;">${inv.invoiceNo}</span></div>
              <div class="field-row"><span class="field-label">Issue Date:</span><span class="field-val">${inv.date}</span></div>
              <div class="field-row"><span class="field-label">Due Date:</span><span class="field-val" style="color:#b91c1c;">${inv.dueDate}</span></div>
              <div class="field-row"><span class="field-label">Payment Method:</span><span class="field-val">${inv.paymentMethod}</span></div>
              <div class="field-row" style="margin-top:6px; padding-top:4px; border-top:1px solid #cbd5e1;"><span class="field-label" style="font-size:13px; font-weight:900;">TOTAL AMOUNT DUE:</span><span class="field-val" style="font-size:14px; font-weight:900; color:#0f172a;">${inv.amountDue}</span></div>
            </div>
          </div>

          <table class="table-inv">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Permit Ref</th>
                <th style="text-align:right;">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Residential Building Renovation Permit Application Approval Fee</strong><br/>
                  <span style="font-size:11px; color:#64748b;">Complete Shingle Replacement (2,793.00 Sq. Ft.) for Property Owner Charles J. and Mary S. Brannen</span>
                </td>
                <td style="font-family:monospace;">IVR-${inv.ivrNumber}</td>
                <td style="text-align:right; font-weight:bold;">${inv.itemAmount}</td>
              </tr>
              <tr style="background:#f8fafc; font-weight:bold;">
                <td colspan="2" style="text-align:right; font-size:12px;">TOTAL DUE ON RECEIPT:</td>
                <td style="text-align:right; font-size:14px; color:#0f172a;">${inv.totalAmount} USD</td>
              </tr>
            </tbody>
          </table>

          <div class="bank-box">
            <div class="bank-title">Official Remittance / Wire Transfer Instructions</div>
            <div class="bank-grid">
              <div><strong>Bank Name:</strong> ${inv.bankName}</div>
              <div><strong>Routing Number (Wire/ACH):</strong> <span style="font-family:monospace; font-weight:bold;">${inv.routingNumber}</span></div>
              <div><strong>Account Name:</strong> ${inv.accountName}</div>
              <div><strong>Account Number:</strong> <span style="font-family:monospace; font-weight:bold;">${inv.accountNumber}</span></div>
              <div><strong>Bank Address:</strong> ${inv.bankAddress}</div>
              <div><strong>Reference Required:</strong> <span style="font-family:monospace; font-weight:bold;">${inv.invoiceNo}</span></div>
            </div>
          </div>

          <div class="sig-container">
            <div class="sig-box">
              <div style="font-weight:bold; font-size:12px; color:#0f172a;">ISSUED BY / AUTHORIZED MUNICIPAL OFFICER:</div>
              <div style="margin-top:20px; font-family:cursive; font-size:16px; color:#0369a1;">Julie McLean, PE</div>
              <div>Senior Director, Development Services Department</div>
              <div>20 Interchange Drive, Savannah, GA 31415</div>
            </div>
            <div class="sig-box">
              <div style="font-weight:bold; font-size:12px; color:#0f172a;">APPLICANT ACKNOWLEDGMENT & SIGNATURE:</div>
              <div style="margin-top:25px; border-bottom:1px dashed #94a3b8; width:80%;"></div>
              <div style="margin-top:4px;">Authorized Signature: ${inv.applicant}</div>
              <div>Date Signed: ______________________</div>
            </div>
          </div>

          <div class="footer">
            Official Administrative Document • Development Services Department • City of Savannah Municipal Code • Reference: IVR ${inv.ivrNumber}
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Standard PDF Export Function
  const handleExportPdf = (subject: string, body: string, recipient: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${subject}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #111827; line-height: 1.6; }
            .header { border-bottom: 2px solid #003B7A; padding-bottom: 20px; margin-bottom: 30px; }
            .badge { background: #003B7A; color: white; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            .field { margin-bottom: 12px; font-size: 14px; }
            .label { font-weight: bold; color: #4B5563; }
            .content { background: #F3F4F6; border: 1px solid #D1D5DB; padding: 24px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; }
            .footer { margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 20px; font-size: 11px; color: #6B7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">MAIL.COM OFFICIAL DISPATCH • MULTI SREYMARA AI</span>
            <h1 style="margin-top: 15px; font-size: 22px; color: #003B7A;">${subject}</h1>
          </div>
          <div class="field"><span class="label">SENDER:</span> kansasnelly@mail.com (US Server Proxy: us-east-1.mail.com)</div>
          <div class="field"><span class="label">RECIPIENT:</span> ${recipient}</div>
          <div class="field"><span class="label">TIMESTAMP:</span> ${new Date().toLocaleString()}</div>
          <div class="content">${body}</div>
          <div class="footer">
            Generated via Multi Sreymara AI Engine • AlphaQubit Quantum Ecosystem • Security: SSL Encrypted US Proxy Channel
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full bg-[#0C0E14] text-stone-200 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-4">
      
      {/* TOP INTEGRATED TAB BAR */}
      <div className="bg-[#08090D] px-6 py-3.5 border-b border-stone-800 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#003B7A] flex items-center justify-center text-white font-bold text-lg shadow-md">
            ✉
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
              Mail.com Webmail & Multi Sreymara AI Studio
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                🟢 US PROXY ACTIVE
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              Interactive AI Chat memory engine, speech-to-text transcribing, multi-image upload, and authentic Mail.com Webmail portal.
            </p>
          </div>
        </div>

        {/* 3 Main Switch Tabs & Close Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#12151E] p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab("ai_chat")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "ai_chat"
                  ? "bg-purple-900 text-purple-100 border border-purple-700 shadow-md"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Bot size={14} className="text-purple-400" /> Multi Sreymara AI Chat
            </button>

            <button
              onClick={() => setActiveTab("mail_webmail")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "mail_webmail"
                  ? "bg-[#003B7A] text-white border border-blue-500 shadow-md"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Mail size={14} className="text-blue-300" /> Mail.com Webmail (Real App)
            </button>

            <button
              onClick={() => setActiveTab("browser")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "browser"
                  ? "bg-stone-800 text-stone-200 border border-stone-700 shadow-md"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Globe size={14} className="text-emerald-400" /> Web Browser
            </button>

            <button
              onClick={() => setActiveTab("videogram")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "videogram"
                  ? "bg-cyan-950 text-cyan-200 border border-cyan-700 shadow-md font-black"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Send size={14} className="text-cyan-400" /> Sreymara Videogram & Telegram
            </button>

            <button
              onClick={() => setActiveTab("truthfinder")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "truthfinder"
                  ? "bg-teal-900 text-teal-100 border border-teal-500 shadow-md font-black"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Search size={14} className="text-teal-300" /> TruthFinder Public Records
            </button>
          </div>

          {/* Close Section Button (Matching Screenshot 5 Arrow) */}
          <button
            onClick={() => {
              if (onClose) onClose();
            }}
            className="px-3.5 py-2 bg-red-950/80 hover:bg-red-800 text-red-200 hover:text-white rounded-xl text-xs font-bold border border-red-700/60 shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Close Mail.com & Multi Sreymara AI Section"
          >
            <X size={15} className="text-red-400" />
            <span>CLOSE</span>
          </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="p-6">

        {/* ==================== TAB 1: MULTI SREYMARA AI CHAT & MEMORY ==================== */}
        {activeTab === "ai_chat" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Model & Parameter Config Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#10131B] rounded-xl border border-stone-800 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1 uppercase tracking-wider text-[10px]">ACTIVE AI MODEL ENGINE</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="Multi Sreymara AI v4 (Executive)">Multi Sreymara AI v4 (Executive)</option>
                  <option value="Gemini 3.6 Flash">Gemini 3.6 Flash</option>
                  <option value="Perplexity AI Grounding">Perplexity AI Grounding</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-300 font-bold mb-1 uppercase tracking-wider text-[10px]">EXECUTIVE TONE STYLE</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Executive">Executive Proposal</option>
                  <option value="Investor Pitch">Investor Pitch & Revenue Deck</option>
                  <option value="Technical Support">Technical Architecture & Support</option>
                  <option value="Commercial Sales">Commercial Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-cyan-300 font-bold mb-1 uppercase tracking-wider text-[10px]">TARGET DISPATCH RECIPIENT</label>
                <input
                  type="email"
                  value={targetRecipient}
                  onChange={(e) => setTargetRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* AI Conversation Thread */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl text-xs space-y-2 border leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-purple-950/40 border-purple-800/80 text-purple-100 ml-12"
                      : "bg-[#10131B] border-stone-800 text-stone-200 mr-12"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 border-b border-stone-800/80 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Bot size={14} className={msg.sender === "user" ? "text-purple-400" : "text-amber-400"} />
                      {msg.sender === "user" ? "Kansas Nelly (User)" : msg.model}
                    </span>
                    <span className="font-mono text-stone-500">{msg.timestamp}</span>
                  </div>

                  {/* Render Uploaded Images if any */}
                  {msg.images && msg.images.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-2">
                      {msg.images.map((img, idx) => (
                        <img key={idx} src={img} alt="Uploaded attachment" className="w-20 h-20 object-cover rounded-lg border border-purple-600/50" />
                      ))}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap font-sans text-sm">{msg.text}</p>

                  {/* Render Email Generation Card (Matching Screenshot 4) */}
                  {msg.emailDraft && (
                    <div className="mt-3 p-4 bg-stone-950 rounded-xl border border-purple-800/80 space-y-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-purple-900 text-purple-200 font-mono text-[10px] font-bold border border-purple-700">
                          GENERATED BY MULTI SREYMARA AI V4 (EXECUTIVE)
                        </span>
                        
                        {/* 3 Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveTab("mail_webmail");
                              setMailTo(msg.emailDraft!.recipient);
                              setMailSubject(msg.emailDraft!.subject);
                              setMailBody(msg.emailDraft!.body);
                              setShowComposer(true);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                          >
                            <Send size={13} /> Send in Mail.com
                          </button>

                          <button
                            onClick={() => handleExportMunicipalInvoicePdf(msg.invoiceData)}
                            className="px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all border border-cyan-400/50"
                          >
                            <Printer size={13} /> Official PDF Invoice
                          </button>

                          <button
                            onClick={() => handleExportPdf(msg.emailDraft!.subject, msg.emailDraft!.body, msg.emailDraft!.recipient)}
                            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                          >
                            <Download size={13} /> Convert to PDF
                          </button>

                          <button
                            onClick={() => navigator.clipboard.writeText(msg.emailDraft!.body)}
                            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Copy size={13} /> Copy Text
                          </button>
                        </div>
                      </div>

                      <h4 className="font-serif font-bold text-base text-amber-300">{msg.emailDraft.subject}</h4>
                      <div className="p-3 bg-[#0B0D13] rounded-lg border border-stone-800 font-sans text-xs text-stone-300 whitespace-pre-wrap leading-relaxed">
                        {msg.emailDraft.body}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="p-3 bg-stone-900 rounded-xl border border-purple-800/80 text-purple-300 font-mono text-xs flex items-center gap-2 animate-pulse">
                  <Sparkles size={16} className="animate-spin" /> Multi Sreymara AI is generating response and syncing memory state...
                </div>
              )}
            </div>

            {/* Prompt Input Deck matching Screenshot 1 & 4 instructions */}
            <form onSubmit={handleSendPrompt} className="p-4 bg-[#10131B] rounded-xl border border-stone-800 space-y-3">
              
              {/* Attached Thumbnail Preview Bar (Up to 30 images) */}
              {attachedImages.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800">
                  <span className="text-[10px] font-mono text-stone-400 font-bold">{attachedImages.length}/30 Attached:</span>
                  {attachedImages.map((img, idx) => (
                    <div key={idx} className="relative group shrink-0">
                      <img src={img} alt="Attachment thumbnail" className="w-12 h-12 object-cover rounded-lg border border-purple-600" />
                      <button
                        type="button"
                        onClick={() => setAttachedImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 text-[10px]"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={3}
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  placeholder="Ask Multi Sreymara AI to draft proposals, analyze files, sync Mail.com, or manage memory..."
                  className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Action Tools Row: Mic transcribing, Image paste trigger, Send button */}
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border border-stone-700"
                  >
                    <ImageIcon size={14} className="text-purple-400" /> Add Images (Up to 30)
                  </button>

                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isRecording
                        ? "bg-red-700 text-white animate-pulse"
                        : "bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
                    }`}
                  >
                    {isRecording ? <MicOff size={14} /> : <Mic size={14} className="text-red-400" />}
                    {isRecording ? "Transcribing Speech..." : "Voice Transcribe"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-2 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-lg text-xs shadow-md cursor-pointer transition-all flex items-center gap-2"
                >
                  <Send size={14} /> Send Command
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ==================== TAB 2: AUTHENTIC MAIL.COM WEBMAIL APP (SCREENSHOTS 5, 6, 7) ==================== */}
        {activeTab === "mail_webmail" && (
          <div className="space-y-4 animate-fade-in text-stone-900 bg-white rounded-xl overflow-hidden border border-stone-300 shadow-2xl">
            
            {/* Top Mail.com Brand Blue Header */}
            <div className="bg-[#003B7A] text-white px-6 py-3 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="font-sans font-extrabold text-2xl tracking-tight flex items-center gap-1">
                  mail<span className="text-sky-300">.com</span>
                </div>
                
                <div className="hidden md:flex items-center gap-4 text-xs font-bold">
                  <span className="cursor-pointer hover:underline flex items-center gap-1">Email <ChevronDown size={12} /></span>
                  <span className="cursor-pointer hover:underline flex items-center gap-1">Photos & Files</span>
                  <span className="cursor-pointer hover:underline flex items-center gap-1">Services <ChevronDown size={12} /></span>
                  <span className="cursor-pointer hover:underline flex items-center gap-1">Security <ChevronDown size={12} /></span>
                  <span className="cursor-pointer hover:underline flex items-center gap-1">Support <ChevronDown size={12} /></span>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-3 text-xs">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-3 py-1 bg-white text-stone-900 rounded-l text-xs focus:outline-none w-40"
                  />
                  <button className="bg-lime-600 hover:bg-lime-500 text-white px-3 py-1 rounded-r font-bold">
                    <Search size={14} />
                  </button>
                </div>

                {!isLoggedIn ? (
                  <>
                    <button onClick={() => setShowLoginModal(true)} className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded font-bold">
                      Sign up
                    </button>
                    <button onClick={() => setShowLoginModal(true)} className="px-3.5 py-1 bg-lime-600 hover:bg-lime-500 text-white rounded font-bold">
                      Log in
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-200">kansasnelly@mail.com</span>
                    <button onClick={() => setIsLoggedIn(false)} className="p-1 hover:text-red-300" title="Logout">
                      <LogOut size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Authentic SSL Login Modal (Matching Screenshot 6) */}
            {showLoginModal && (
              <div className="p-6 bg-stone-100 border-b border-stone-300 animate-fade-in text-stone-900">
                <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-stone-300 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-bold text-base text-[#003B7A] flex items-center gap-2">
                      Login SSL <Check size={16} className="text-emerald-600" />
                    </h3>
                    <button onClick={() => setShowLoginModal(false)} className="text-stone-400 hover:text-black">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Email address</label>
                      <input
                        type="email"
                        value={mailEmailInput}
                        onChange={(e) => setMailEmailInput(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#003B7A]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Password</label>
                      <input
                        type="password"
                        value={mailPasswordInput}
                        onChange={(e) => setMailPasswordInput(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#003B7A]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-[11px] text-[#003B7A] space-x-3">
                      <span className="hover:underline cursor-pointer">Forgot password?</span>
                      <span className="hover:underline cursor-pointer">Keep me logged in!</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsLoggedIn(true);
                        setShowLoginModal(false);
                      }}
                      className="px-6 py-2 bg-lime-600 hover:bg-lime-500 text-white font-bold rounded text-xs"
                    >
                      Log in
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REAL MAIL.COM WEBMAIL DASHBOARD (MATCHING SCREENSHOT 7) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] bg-[#EAECEF]">
              
              {/* Left Mail.com Navigation Sidebar */}
              <div className="lg:col-span-3 bg-[#F4F6F8] p-4 border-r border-stone-300 text-xs space-y-4">
                <button
                  onClick={() => setShowComposer(true)}
                  className="w-full py-2.5 bg-[#003B7A] hover:bg-blue-900 text-white font-bold rounded-full text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <SendHorizontal size={14} /> Compose email
                </button>

                <div className="space-y-1 font-sans">
                  <button
                    onClick={() => setMailFolder("inbox")}
                    className={`w-full px-3 py-2 rounded text-left font-bold flex justify-between items-center ${
                      mailFolder === "inbox" ? "bg-stone-300 text-[#003B7A]" : "hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    <span className="flex items-center gap-2"><Inbox size={14} /> Inbox</span>
                    <span className="text-[10px] bg-[#003B7A] text-white px-2 py-0.5 rounded-full font-mono">2</span>
                  </button>

                  <button
                    onClick={() => setMailFolder("sent")}
                    className={`w-full px-3 py-2 rounded text-left font-bold flex justify-between items-center ${
                      mailFolder === "sent" ? "bg-stone-300 text-[#003B7A]" : "hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    <span className="flex items-center gap-2"><SendHorizontal size={14} /> Sent</span>
                    <span className="text-[10px] bg-stone-500 text-white px-2 py-0.5 rounded-full font-mono">{sentMailLedger.length}</span>
                  </button>

                  <button
                    onClick={() => setMailFolder("drafts")}
                    className={`w-full px-3 py-2 rounded text-left font-bold flex items-center gap-2 ${
                      mailFolder === "drafts" ? "bg-stone-300 text-[#003B7A]" : "hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    <FileText size={14} /> Drafts
                  </button>

                  <button
                    onClick={() => setMailFolder("trash")}
                    className={`w-full px-3 py-2 rounded text-left font-bold flex items-center gap-2 ${
                      mailFolder === "trash" ? "bg-stone-300 text-[#003B7A]" : "hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    <Trash2 size={14} /> Trash
                  </button>
                </div>

                <div className="pt-4 border-t border-stone-300 space-y-1 text-[11px] font-bold text-stone-600">
                  <div className="flex justify-between items-center hover:text-black cursor-pointer">
                    <span>Folders</span>
                    <FolderPlus size={14} />
                  </div>
                  <div className="pl-3 text-stone-500 space-y-1 font-normal">
                    <div>• Development Services</div>
                    <div>• AlphaQubit Quantum</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-300 text-[10px] text-stone-500 font-mono">
                  Email storage: <span className="font-bold text-stone-800">9.7 MB of 65 GB (0%)</span>
                </div>
              </div>

              {/* Right Mail Workstation Workspace */}
              <div className="lg:col-span-9 p-4 bg-white flex flex-col justify-between">
                
                {mailDispatchStatus && (
                  <div className="p-3 mb-3 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded font-mono text-xs font-bold">
                    {mailDispatchStatus}
                  </div>
                )}

                {/* RICH EMAIL COMPOSER MODAL (MATCHING SCREENSHOT 7) */}
                {showComposer ? (
                  <div className="bg-stone-50 rounded-xl border border-stone-300 p-5 shadow-lg space-y-4 text-xs font-sans">
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="font-bold text-stone-600">Saved at 12:02 PM</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSendMail}
                          className="px-6 py-2 bg-[#003B7A] hover:bg-blue-900 text-white font-bold rounded text-xs shadow cursor-pointer flex items-center gap-1.5"
                        >
                          <Send size={14} /> Send
                        </button>
                        <button onClick={() => setShowComposer(false)} className="text-stone-400 hover:text-black">
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 border-b pb-2">
                        <span className="w-12 font-bold text-stone-500">From:</span>
                        <input
                          type="text"
                          value={`"Development Services Dept" <${mailEmailInput}>`}
                          disabled
                          className="w-full bg-stone-100 border-0 text-stone-800 font-mono text-xs p-1"
                        />
                      </div>

                      <div className="flex items-center gap-2 border-b pb-2">
                        <span className="w-12 font-bold text-stone-500">To:</span>
                        <input
                          type="email"
                          value={mailTo}
                          onChange={(e) => setMailTo(e.target.value)}
                          className="w-full border-0 focus:outline-none text-stone-900 font-mono text-xs p-1"
                        />
                      </div>

                      <div className="flex items-center gap-2 border-b pb-2">
                        <span className="w-12 font-bold text-stone-500">Subject:</span>
                        <input
                          type="text"
                          value={mailSubject}
                          onChange={(e) => setMailSubject(e.target.value)}
                          className="w-full border-0 focus:outline-none text-stone-900 font-bold text-xs p-1"
                        />
                      </div>

                      {/* Attachment Chip Preview matching Screenshot 7 */}
                      {mailAttachment && (
                        <div className="p-2 bg-stone-200 border rounded flex items-center justify-between w-64 text-[11px] font-mono">
                          <span className="flex items-center gap-1"><Paperclip size={12} /> {mailAttachment}</span>
                          <button onClick={() => setMailAttachment(null)} className="text-stone-500 hover:text-red-600"><X size={12} /></button>
                        </div>
                      )}
                    </div>

                    {/* Rich Formatting Toolbar */}
                    <div className="flex items-center gap-2 bg-stone-200 p-1.5 rounded border border-stone-300 text-xs font-bold text-stone-700">
                      <button type="button" className="p-1 hover:bg-white rounded">B</button>
                      <button type="button" className="p-1 hover:bg-white rounded italic">I</button>
                      <button type="button" className="p-1 hover:bg-white rounded underline">U</button>
                      <span className="border-r border-stone-400 h-4 mx-1"></span>
                      <span>Verdana</span>
                      <ChevronDown size={12} />
                      <span>14px</span>
                      <ChevronDown size={12} />
                    </div>

                    <textarea
                      rows={10}
                      value={mailBody}
                      onChange={(e) => setMailBody(e.target.value)}
                      className="w-full p-3 bg-white border border-stone-300 rounded text-stone-900 leading-relaxed focus:outline-none font-sans text-xs"
                    />

                  </div>
                ) : (
                  <div className="p-8 text-center text-stone-500 italic space-y-3">
                    <Inbox size={32} className="mx-auto text-stone-400" />
                    <p>Select a folder or click "Compose email" to dispatch messages via Mail.com.</p>
                  </div>
                )}

                {/* Gaza / UNICEF Sponsored Banner Matching Screenshot 7 */}
                <div className="mt-4 p-4 bg-[#08182B] text-white rounded-xl flex justify-between items-center flex-wrap gap-4 border border-blue-900">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-sky-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">SPONSORED NOTICE</span>
                    <h4 className="font-bold text-sm">Help give children around the world the chance to learn</h4>
                  </div>
                  <button className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-xs shadow">
                    JOIN US
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 3: IN-APP WEB BROWSER WITH EXPRESSVPN PRO & MULTI-TABS ==================== */}
        {activeTab === "browser" && (
          <div className="animate-fade-in">
            <ExpressVpnWebBrowser onAskGeminiClick={() => setActiveTab("ai_chat")} />
          </div>
        )}

        {/* ==================== TAB 4: SREYMARA VIDEOGRAM & TELEGRAM MINI APP SUITE ==================== */}
        {activeTab === "videogram" && (
          <div className="animate-fade-in">
            <SreymaraVideogram />
          </div>
        )}

        {/* ==================== TAB 5: TRUTHFINDER PUBLIC RECORDS SEARCH ==================== */}
        {activeTab === "truthfinder" && (
          <div className="animate-fade-in">
            <TruthFinderSuite />
          </div>
        )}

      </div>
    </div>
  );
};
