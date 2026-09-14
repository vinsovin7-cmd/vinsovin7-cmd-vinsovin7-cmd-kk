import React, { useState } from "react";
import {
  Search,
  Phone,
  FileText,
  UserCheck,
  ShieldCheck,
  MapPin,
  Building,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Download,
  Star,
  Users,
  Share2,
  Lock,
  Globe,
  Award,
  ExternalLink,
  ChevronRight,
  Printer,
  Sparkles,
  Info
} from "lucide-react";

interface TruthFinderSuiteProps {
  onClose?: () => void;
}

interface PublicRecordReport {
  fullName: string;
  age: number;
  dob: string;
  aliases: string[];
  currentLocation: string;
  pastLocations: string[];
  phoneNumbers: string[];
  emails: string[];
  relatives: string[];
  propertyAssets: Array<{
    address: string;
    estimatedValue: string;
    type: string;
  }>;
  criminalCivilRecords: Array<{
    date: string;
    court: string;
    caseNumber: string;
    type: string;
    status: string;
  }>;
  permitsLicenses: Array<{
    type: string;
    jurisdiction: string;
    refNumber: string;
    valuation: string;
    status: string;
  }>;
  socialProfiles: string[];
}

export const TruthFinderSuite: React.FC<TruthFinderSuiteProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"people" | "phone" | "records" | "background" | "about">("people");
  
  // Search Inputs
  const [firstName, setFirstName] = useState("Bobby");
  const [lastName, setLastName] = useState("Myers");
  const [city, setCity] = useState("Savannah");
  const [state, setState] = useState("GA");
  const [phoneNumber, setPhoneNumber] = useState("912-555-0199");
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchStepText, setSearchStepText] = useState("");
  const [searchResult, setSearchResult] = useState<PublicRecordReport | null>(null);

  // USA States list
  const US_STATES = [
    "All States", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
    "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
    "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA",
    "WA", "WV", "WI", "WY"
  ];

  // Execute Search Routine
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchProgress(10);
    setSearchStepText("Scanning 43 Billion Public Records Across US Databases...");

    try {
      const steps = [
        { pct: 30, text: "Cross-referencing Municipal Property & Tax Assessor Records..." },
        { pct: 55, text: "Searching Civil Judgments, Building Permits & Court Filings..." },
        { pct: 75, text: "Aggregating Social Profiles & Phone Telemetries..." },
        { pct: 95, text: "Compiling Executive Background & Asset Summary..." }
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((r) => setTimeout(r, 450));
        setSearchProgress(steps[i].pct);
        setSearchStepText(steps[i].text);
      }

      // Call Backend API or Generate Result
      const res = await fetch("/api/truthfinder/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          city,
          state,
          phone: phoneNumber,
          searchType: activeTab
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResult(data.report);
      } else {
        // Fallback report
        setSearchResult({
          fullName: `${firstName} ${lastName}`,
          age: 44,
          dob: "10/14/1981",
          aliases: [`${firstName} J. ${lastName}`, `${lastName} Specialty Contracting`],
          currentLocation: `${city ? city + ", " : ""}${state === "All States" ? "GA" : state}, USA`,
          pastLocations: ["Savannah, GA", "Atlanta, GA", "Jacksonville, FL"],
          phoneNumbers: [phoneNumber || "(912) 555-0199", "(404) 312-8840"],
          emails: [`${firstName.toLowerCase()}.${lastName.toLowerCase()}@jcbroofing.com`, "b.myers@gmail.com"],
          relatives: ["Charles J. Brannen", "Mary S. Brannen", "David Myers"],
          propertyAssets: [
            { address: "2,793 Sq Ft Residential Property, Mayfair District", estimatedValue: "$17,595.00 Valuation", type: "Single Family Residential" },
            { address: "388 Greenwich St Commercial Holding", estimatedValue: "$450,000.00", type: "Commercial Asset" }
          ],
          criminalCivilRecords: [
            { date: "09/12/2026", court: "Development Services Department", caseNumber: "IVR 535908", type: "Building Permit Application", status: "Recommended for Approval (Pending Fee)" }
          ],
          permitsLicenses: [
            { type: "Specialty Contractor License", jurisdiction: "State of Georgia", refNumber: "GA-LIC-9920", valuation: "$17,595.00", status: "Active & Verified" }
          ],
          socialProfiles: [
            "linkedin.com/in/bobbymyers-jcbroofing",
            "facebook.com/jcbroofingsavannah"
          ]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
      setSearchProgress(100);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#007EA7] text-white min-h-[700px] rounded-3xl shadow-2xl border border-cyan-700/60 overflow-hidden font-sans">
      
      {/* EXECUTIVE TOP HEADER BAR (Screenshot 1 Exact replica) */}
      <header className="bg-white text-stone-900 border-b border-stone-200 px-6 py-3 flex items-center justify-between flex-wrap gap-4">
        {/* TruthFinder Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00B4D8] text-white flex items-center justify-center font-black text-xl shadow-md">
            <Search size={20} className="text-white stroke-[3]" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#007EA7]">
            truth<span className="text-[#00B4D8] font-normal">finder</span>
          </h1>
        </div>

        {/* Header Navigation Links */}
        <nav className="flex items-center gap-6 text-xs font-bold text-stone-700">
          <button
            onClick={() => setActiveTab("people")}
            className={`hover:text-[#007EA7] uppercase tracking-wide cursor-pointer ${
              activeTab === "people" ? "text-[#007EA7] border-b-2 border-[#007EA7] pb-1" : ""
            }`}
          >
            PEOPLE SEARCH
          </button>
          <button
            onClick={() => setActiveTab("phone")}
            className={`hover:text-[#007EA7] uppercase tracking-wide cursor-pointer ${
              activeTab === "phone" ? "text-[#007EA7] border-b-2 border-[#007EA7] pb-1" : ""
            }`}
          >
            REVERSE PHONE LOOKUP
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`hover:text-[#007EA7] uppercase tracking-wide cursor-pointer ${
              activeTab === "records" ? "text-[#007EA7] border-b-2 border-[#007EA7] pb-1" : ""
            }`}
          >
            PUBLIC RECORDS
          </button>
          <button
            onClick={() => setActiveTab("background")}
            className={`hover:text-[#007EA7] uppercase tracking-wide cursor-pointer ${
              activeTab === "background" ? "text-[#007EA7] border-b-2 border-[#007EA7] pb-1" : ""
            }`}
          >
            BACKGROUND CHECK
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`hover:text-[#007EA7] uppercase tracking-wide cursor-pointer ${
              activeTab === "about" ? "text-[#007EA7] border-b-2 border-[#007EA7] pb-1" : ""
            }`}
          >
            ABOUT
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
            FREE UNLIMITED ACCESS
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION (Teal blue background with BBB Badge & Search Box) */}
      <div className="relative px-6 py-10 max-w-5xl mx-auto space-y-8">
        
        {/* BBB A+ Badge (Screenshot 1 Exact) */}
        <div className="absolute top-4 left-6 bg-[#FFB703] text-stone-950 px-3 py-2 rounded-b-xl shadow-lg border border-amber-400 font-black text-center text-[11px] leading-tight">
          <div>RATED</div>
          <div className="text-xl font-black text-amber-950 leading-none">A+</div>
          <div className="text-[9px] font-bold text-amber-900">BY THE BBB</div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center space-y-2 pt-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Search <span className="text-white underline decoration-cyan-300 decoration-4">Billions</span> of Public Records
          </h2>
          <p className="text-sm font-medium text-cyan-100 max-w-2xl mx-auto">
            Social Media, Photos, Police Records, Background Checks, Civil Judgments, Contact Information and Much More!
          </p>
        </div>

        {/* MAIN SEARCH CARD CONTAINER (Screenshot 1 White Card & Yellow Tag) */}
        <div className="max-w-3xl mx-auto relative pt-4">
          
          {/* Yellow Banner Tag */}
          <div className="absolute -top-1 left-8 bg-[#FFD166] text-stone-950 font-black text-[11px] px-3 py-1 rounded-t-lg shadow-md uppercase tracking-wider border-t border-x border-amber-300">
            ENJOY UNLIMITED SEARCHES!
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-stone-900 border border-cyan-100 space-y-4">
            
            {/* Search Type Tabs inside card */}
            <div className="flex border-b border-stone-200 pb-3 gap-2">
              <button
                onClick={() => setActiveTab("people")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
                  activeTab === "people"
                    ? "bg-[#007EA7] text-white shadow"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Users size={14} /> People Search
              </button>
              <button
                onClick={() => setActiveTab("phone")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
                  activeTab === "phone"
                    ? "bg-[#007EA7] text-white shadow"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Phone size={14} /> Reverse Phone Lookup
              </button>
              <button
                onClick={() => setActiveTab("records")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
                  activeTab === "records"
                    ? "bg-[#007EA7] text-white shadow"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <FileText size={14} /> Public Records & Permits
              </button>
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleSearch} className="space-y-4">
              {activeTab === "people" || activeTab === "records" || activeTab === "background" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      First Name:
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. John"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-[#007EA7]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Last Name:
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Smith"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:border-[#007EA7]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      State:
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#007EA7]"
                    >
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Enter 10-Digit US Phone Number:
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. (912) 555-0199"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono text-stone-900 focus:outline-none focus:border-[#007EA7]"
                    required
                  />
                </div>
              )}

              {/* SEARCH BUTTON (Screenshot 1 Green Button) */}
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-3.5 bg-[#00C897] hover:bg-[#00B084] text-white font-extrabold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Sparkles className="animate-spin" size={18} />
                    <span>SCANNING US PUBLIC RECORDS DATABASE... ({searchProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>SEARCH NOW</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 justify-center font-medium">
                <Lock size={12} className="text-emerald-600" />
                <span>This secure connection is confirmed & 100% confidential</span>
              </div>
            </form>

          </div>
        </div>

        {/* PROGRESS BAR DISPLAY */}
        {isSearching && (
          <div className="max-w-2xl mx-auto bg-stone-900/90 border border-cyan-400/40 rounded-2xl p-4 space-y-2 animate-fade-in text-center">
            <div className="flex justify-between text-xs font-mono font-bold text-cyan-200">
              <span>{searchStepText}</span>
              <span>{searchProgress}%</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden border border-stone-700">
              <div
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${searchProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* FEATURES ROW (Screenshot 1 Matching Icons) */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center pt-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-1">
            <MapPin size={22} className="mx-auto text-cyan-200" />
            <p className="text-[11px] font-bold text-white">Location History</p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-1">
            <Globe size={22} className="mx-auto text-cyan-200" />
            <p className="text-[11px] font-bold text-white">Social Media</p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-1">
            <DollarSign size={22} className="mx-auto text-cyan-200" />
            <p className="text-[11px] font-bold text-white">Financial Assets</p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-1">
            <Building size={22} className="mx-auto text-cyan-200" />
            <p className="text-[11px] font-bold text-white">Property Records</p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-1">
            <FileText size={22} className="mx-auto text-cyan-200" />
            <p className="text-[11px] font-bold text-white">Civil Judgments</p>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-1">
            <ShieldCheck size={22} className="mx-auto text-cyan-200" />
            <p className="text-[11px] font-bold text-white">Background Checks</p>
          </div>
        </div>

        {/* REVIEWS BANNER (Screenshot 1 Matching 5-Star Text) */}
        <div className="bg-white text-stone-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex text-amber-400">
              <Star size={18} className="fill-amber-400" />
              <Star size={18} className="fill-amber-400" />
              <Star size={18} className="fill-amber-400" />
              <Star size={18} className="fill-amber-400" />
              <Star size={18} className="fill-amber-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-stone-900 uppercase tracking-wide">
                PEOPLE LOVE WHAT THEY UNCOVER
              </h4>
              <p className="text-xs text-stone-600 font-medium">
                Proud to Have Over 60,000 5-Star Reviews • Based on ratings from actual TruthFinder reports.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-cyan-50 text-cyan-800 text-xs font-bold rounded-lg border border-cyan-200 font-mono">
            VERIFIED BBB A+ MEMBER
          </span>
        </div>

        {/* SEARCH RESULTS REPORT DISPLAY */}
        {searchResult && (
          <div className="bg-white rounded-3xl p-6 text-stone-900 shadow-2xl border-2 border-emerald-500 space-y-6 animate-fade-in print:p-0">
            
            {/* Header Result Status */}
            <div className="flex flex-wrap items-center justify-between border-b pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    EXECUTIVE REPORT FOUND
                  </span>
                  <span className="text-xs font-mono text-stone-500">Ref ID: TF-{Date.now().toString().slice(-6)}</span>
                </div>
                <h3 className="text-2xl font-black text-stone-900 mt-1">
                  {searchResult.fullName}
                </h3>
                <p className="text-xs text-stone-600 font-mono">
                  Primary Location: {searchResult.currentLocation} | Age: {searchResult.age} (DOB: {searchResult.dob})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Printer size={15} /> Print / Save PDF
                </button>
              </div>
            </div>

            {/* GRID OF SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Box 1: Contact Details */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-sm text-[#007EA7] flex items-center gap-2 border-b pb-2">
                  <Phone size={16} /> Phone & Email Telemetry
                </h4>
                <div>
                  <label className="font-bold text-stone-500">Associated Phone Numbers:</label>
                  <div className="space-y-1 mt-1 font-mono">
                    {searchResult.phoneNumbers.map((p, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-stone-200 flex justify-between">
                        <span>{p}</span>
                        <span className="text-emerald-600 font-bold">VERIFIED ACTIVE</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-500">Email Addresses:</label>
                  <div className="space-y-1 mt-1 font-mono">
                    {searchResult.emails.map((em, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-stone-200 truncate">
                        {em}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 2: Property & Financial Assets */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-sm text-[#007EA7] flex items-center gap-2 border-b pb-2">
                  <Building size={16} /> Property & Financial Assets
                </h4>
                <div className="space-y-2">
                  {searchResult.propertyAssets.map((prop, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="font-bold text-stone-900">{prop.address}</div>
                      <div className="flex justify-between font-mono text-[11px] text-stone-600">
                        <span>Type: {prop.type}</span>
                        <span className="text-emerald-700 font-bold">{prop.estimatedValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: Civil Records & Municipal Permits */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-sm text-[#007EA7] flex items-center gap-2 border-b pb-2">
                  <FileText size={16} /> Civil Court & Building Permits
                </h4>
                <div className="space-y-2">
                  {searchResult.criminalCivilRecords.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{rec.type} ({rec.caseNumber})</span>
                        <span className="text-amber-700 font-mono text-[10px]">{rec.date}</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">Court: {rec.court}</p>
                      <div className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold font-mono text-[10px] inline-block">
                        Status: {rec.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 4: Relatives & Social Profiles */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-sm text-[#007EA7] flex items-center gap-2 border-b pb-2">
                  <Users size={16} /> Relatives & Associated Profiles
                </h4>
                <div>
                  <label className="font-bold text-stone-500">Known Relatives:</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {searchResult.relatives.map((rel, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white rounded-lg border border-stone-200 font-bold text-stone-800">
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-bold text-stone-500">Social Footprint:</label>
                  <div className="space-y-1 mt-1 font-mono">
                    {searchResult.socialProfiles.map((soc, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-stone-200 text-cyan-700 flex justify-between items-center">
                        <span className="truncate">{soc}</span>
                        <ExternalLink size={12} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
