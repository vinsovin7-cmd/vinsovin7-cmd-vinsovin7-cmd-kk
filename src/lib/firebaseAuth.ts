import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Gmail & Profile Scopes
provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/userinfo.email");
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

// In-Memory Access Token Caching (Never store in localStorage/sessionStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    if (!accessToken) {
      throw new Error("Failed to retrieve OAuth access token from Google authentication");
    }
    cachedAccessToken = accessToken;
    return { user: result.user, accessToken };
  } catch (error: any) {
    console.error("Gmail Google Sign-In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logoutGmail = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Real Gmail API Integration Helpers
export interface RealGmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  bodyText?: string;
  isRead: boolean;
  category?: "primary" | "ecosystem" | "match" | "news";
}

export const fetchGmailMessages = async (accessToken: string): Promise<RealGmailMessage[]> => {
  try {
    const listRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    if (!listRes.ok) {
      throw new Error(`Gmail API returned status ${listRes.status}`);
    }
    const listData = await listRes.json();
    const messageSummaries = listData.messages || [];

    const detailedMessages: RealGmailMessage[] = await Promise.all(
      messageSummaries.map(async (msgItem: { id: string; threadId: string }) => {
        try {
          const itemRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgItem.id}?format=full`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          );
          if (!itemRes.ok) return null;
          const itemData = await itemRes.json();

          const headers = itemData.payload?.headers || [];
          const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === "subject");
          const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from");
          const toHeader = headers.find((h: any) => h.name.toLowerCase() === "to");
          const dateHeader = headers.find((h: any) => h.name.toLowerCase() === "date");

          const isUnread = itemData.labelIds?.includes("UNREAD") ?? false;

          let body = itemData.snippet || "";
          if (itemData.payload?.body?.data) {
            try {
              body = atob(itemData.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
            } catch (e) {
              // fallback to snippet
            }
          }

          return {
            id: itemData.id,
            threadId: itemData.threadId,
            snippet: itemData.snippet || "",
            subject: subjectHeader?.value || "(No Subject)",
            from: fromHeader?.value || "Unknown Sender",
            to: toHeader?.value || "me",
            date: dateHeader?.value ? new Date(dateHeader.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
            bodyText: body,
            isRead: !isUnread,
            category: "primary"
          };
        } catch (e) {
          return null;
        }
      })
    );

    return detailedMessages.filter((m): m is RealGmailMessage => m !== null);
  } catch (err) {
    console.error("Failed to fetch Gmail messages:", err);
    throw err;
  }
};

export const sendGmailMessage = async (
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<boolean> => {
  try {
    const emailLines = [
      `To: ${to}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${subject}`,
      "",
      bodyText
    ];
    const emailRaw = emailLines.join("\r\n");
    const encodedEmail = btoa(unescape(encodeURIComponent(emailRaw)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw: encodedEmail })
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to send email via Gmail API:", err);
    return false;
  }
};
