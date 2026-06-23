import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";
import { rateLimit } from "express-rate-limit";
import Stripe from "stripe";
import YAML from "yaml";
import "dotenv/config";
import crypto from "crypto";
import { spawn } from "child_process";

const KATINA_DECK = [
  { id: "Afyon", locKey: "afyon", name: "Afyon", desc: "Bağımlılıklar, göz boyama, illüzyonlar ve toksik bağlar." },
  { id: "Agac", locKey: "agac", name: "Ağaç", desc: "Köklenme, sağlık, büyüme, aile soyu ve uzun ömür." },
  { id: "Alyans", locKey: "alyans", name: "Alyans", desc: "Bağlılık, evlilik, ortaklık, ciddi bir tamamlanma." },
  { id: "Anahtar", locKey: "anahtar", name: "Anahtar", desc: "Çözüm ve yeni başlangıçlar. Sırların açığa çıkması." },
  { id: "Ay", locKey: "ay", name: "Ay", desc: "Sezgiler, romantizm, melankoli ve değişken ruh halleri." },
  { id: "Bahceler", locKey: "bahceler", name: "Bahçeler", desc: "Sosyalleşme, çevre, kalabalıklar ve toplum içindeki yeriniz." },
  { id: "Balik", locKey: "balik", name: "Balık", desc: "Maddi kazanç, bolluk ve şansın simgesidir." },
  { id: "Baykus", locKey: "baykus", name: "Baykuş", desc: "Bilgelik, gece gelen haberler veya etrafı gözlemleme zamanı." },
  { id: "Bulutlar", locKey: "bulutlar", name: "Bulutlar", desc: "Kafa karışıklığı, belirsizlik veya geçici sıkıntılar." },
  { id: "Capa", locKey: "capa", name: "Çapa", desc: "Güvenlik, sadakat, iş hayatında kalıcılık ve istikrar." },
  { id: "Cicekler", locKey: "cicekler", name: "Çiçekler", desc: "Mutluluk, hediye, sevinçli sürprizler ve kutlama." },
  { id: "Dag", locKey: "dag", name: "Dağ", desc: "Engeller, büyük zorluklar, aşılması gereken blokajlar veya gecikmeler." },
  { id: "Deve", locKey: "deve", name: "Deve", desc: "Yavaş ama emin adımlarla ilerleme, sabır ve uzun vadeli kazanç." },
  { id: "Dervis", locKey: "dervis", name: "Derviş", desc: "İçsel bilgelik, sabır, maneviyat veya zamana bırakma." },
  { id: "Ev", locKey: "ev", name: "Ev", desc: "Aile, yuva, emlak işleri, güvenlik ve huzur." },
  { id: "Fareler", locKey: "fareler", name: "Fareler", desc: "Maddi veya manevi kayıp, hırsızlık, kemiren endişeler veya stres." },
  { id: "Gunes", locKey: "gunes", name: "Güneş", desc: "Aydınlık, başarı, yaşamsal enerji, netleşen durumlar ve zafer." },
  { id: "Hac", locKey: "hac", name: "Haç", desc: "Kader, keder, sınavlar, taşınması gereken bir yük." },
  { id: "Kale", locKey: "kale", name: "Kale", desc: "Korunma, yalnızlık, resmi kurumlar veya güçlü sınırlar." },
  { id: "Kalp", locKey: "kalp", name: "Kalp", desc: "Aşk, tutku, şefkat, duygusal zirveler." },
  { id: "Kapi", locKey: "kapi", name: "Kapı", desc: "Yeni fırsatlar, geçiş dönemleri, karar anları." },
  { id: "KizCocugu", locKey: "kizcocugu", name: "Kız Çocuğu", desc: "Masumiyet, yeni başlangıçlar, küçük sevinçler veya saflık." },
  { id: "Kitap", locKey: "kitap", name: "Kitap", desc: "Sırlar, gizli bilgiler, eğitim veya henüz yazılmamış gelecek." },
  { id: "Kopek", locKey: "kopek", name: "Köpek", desc: "Dostluk, sadakat, güvenilir arkadaşlar." },
  { id: "Mektup", locKey: "mektup", name: "Mektup", desc: "Yazılı haberleşme, resmi evraklar, mesaj veya e-posta." },
  { id: "Mezar", locKey: "mezar", name: "Mezar", desc: "Sonlanmalar, dönüşüm, eskiyi gömüp yeniye alan açma." },
  { id: "Nil Nehri", locKey: "nilnehri", name: "Nil Nehri", desc: "Bolluk, bereket, uzun süren huzur ve refah akışı." },
  { id: "Samyeli", locKey: "samyeli", name: "Samyeli", desc: "Ani değişimler, fırtınalar, sarsıcı ama temizleyici rüzgarlar." },
  { id: "Supurge", locKey: "supurge", name: "Süpürge", desc: "Temizlik, tartışmalar, hayatınızdan fazlalıkları süpürüp atma." },
  { id: "Tilki", locKey: "tilki", name: "Tilki", desc: "Zeka, strateji, kurnazlık veya etrafınızdaki sinsi oyunlar." },
  { id: "Yatagan", locKey: "yatagan", name: "Yatağan", desc: "Keskin kararlar, mücadele, sözlü kavgalar veya ameliyatlar." },
  { id: "Yelkenli", locKey: "yelkenli", name: "Yelkenli", desc: "Yolculuklar, uzaklardan gelen haberler, yeni ufuklara açılma." },
  { id: "Yilan", locKey: "yilan", name: "Yılan", desc: "İhanet, gizli düşmanlık, kıskançlık veya sinsilik." },
  { id: "Yildizlar", locKey: "yildizlar", name: "Yıldızlar", desc: "Umut, ilham, hayallerin gerçekleşmesi, ruhsal rehberlik." }
];

const localesDir = path.resolve(process.cwd(), "src", "locales");

const isProduction = process.env.NODE_ENV === "production";
const localesCache: Record<string, any> = {};

function loadLocalesToMemory() {
  try {
    if (!fs.existsSync(localesDir)) {
      console.warn(`[Locales Cache] Directory not found: ${localesDir}`);
      return;
    }
    const files = fs.readdirSync(localesDir);
    files.forEach(file => {
      if (file.endsWith(".yaml")) {
        const lang = file.replace(".yaml", "");
        const filePath = path.join(localesDir, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        localesCache[lang] = YAML.parse(fileContent);
      }
    });
    console.log(`[Locales Cache] Loaded ${Object.keys(localesCache).length} language files into memory:`, Object.keys(localesCache));
  } catch (err) {
    console.error("[Locales Cache] Failed to load locales on startup:", err);
  }
}

// Populate memory cache at server startup
loadLocalesToMemory();

function getTranslation(lang: string, key: string, params: Record<string, any> = {}): string {
  try {
    let parsed: any = null;
    
    if (isProduction && localesCache[lang]) {
      parsed = localesCache[lang];
    } else {
      const filePath = path.join(localesDir, `${lang}.yaml`);
      let fileContent = "";
      if (fs.existsSync(filePath)) {
        fileContent = fs.readFileSync(filePath, "utf8");
      } else {
        const fallbackPath = path.join(localesDir, "en.yaml");
        fileContent = fs.readFileSync(fallbackPath, "utf8");
      }
      parsed = YAML.parse(fileContent);
    }
    
    let value = key.split('.').reduce((obj, k) => obj?.[k], parsed);
    
    // MS-118 Fallback translation key to English if missing in target locale
    if (value === undefined || value === null) {
      let fallbackParsed: any = null;
      if (isProduction && localesCache["en"]) {
        fallbackParsed = localesCache["en"];
      } else {
        const fallbackPath = path.join(localesDir, "en.yaml");
        if (fs.existsSync(fallbackPath)) {
          const fallbackContent = fs.readFileSync(fallbackPath, "utf8");
          fallbackParsed = YAML.parse(fallbackContent);
        }
      }
      if (fallbackParsed) {
        value = key.split('.').reduce((obj, k) => obj?.[k], fallbackParsed);
      }
    }
    
    if (value === undefined || value === null) return key;
    
    let result = String(value);
    Object.entries(params).forEach(([k, v]) => {
      result = result.replace(`{${k}}`, String(v));
    });
    return result;
  } catch (err) {
    console.error(`Error reading translation key ${key} for lang ${lang}:`, err);
    return key;
  }
}

function formatGeminiError(error: any): string {
  if (!error) return "Unknown error occurred";
  
  const msg = error.message || String(error);
  
  if (typeof msg === 'string' && (msg.trim().startsWith('{') || msg.trim().startsWith('['))) {
    try {
      const parsed = JSON.parse(msg);
      if (parsed && parsed.error && parsed.error.message) {
        return parsed.error.message;
      }
      if (parsed && parsed.message) {
        return parsed.message;
      }
    } catch (e) {
      // ignore
    }
  }

  if (error.error && typeof error.error === 'object' && error.error.message) {
    return error.error.message;
  }
  
  if (error.status && error.statusText) {
    return `${error.status}: ${error.statusText}`;
  }

  return msg;
}

class LogBuffer {
  private queue: any[] = [];
  private db: admin.firestore.Firestore;
  private useFirebaseAdmin: boolean;
  private limit: number;
  private timeoutMs: number;
  private timer: NodeJS.Timeout | null = null;

  constructor(db: admin.firestore.Firestore, useFirebaseAdmin: boolean, limit = 10, timeoutMs = 5000) {
    this.db = db;
    this.useFirebaseAdmin = useFirebaseAdmin;
    this.limit = limit;
    this.timeoutMs = timeoutMs;
  }

  public push(log: any) {
    this.queue.push(log);
    console.log(`[LogBuffer] Log added. Queue size: ${this.queue.length}/${this.limit}`);

    if (this.queue.length >= this.limit) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.timeoutMs);
    }
  }

  public async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const batchToFlush = [...this.queue];
    this.queue = [];

    console.log(`[LogBuffer] Flushing ${batchToFlush.length} logs to Firestore...`);

    if (this.useFirebaseAdmin) {
      try {
        const batch = this.db.batch();
        batchToFlush.forEach((log) => {
          const docRef = this.db.collection("error_logs").doc();
          batch.set(docRef, {
            ...log,
            createdAt: log.createdAt || admin.firestore.FieldValue.serverTimestamp()
          });
        });
        await batch.commit();
        console.log(`[LogBuffer] Successfully flushed ${batchToFlush.length} logs.`);
      } catch (err) {
        console.error("[LogBuffer] Failed to flush logs to Firestore:", err);
        // Put logs back in queue if write failed
        this.queue = [...batchToFlush, ...this.queue];
      }
    } else {
      console.log("[LogBuffer] Local bypass: Logs simulated flush:", batchToFlush);
    }
  }
}

async function startServer() {
  console.log("[Server] Starting MadameSoul server...");
  
  // Initialize Firebase Admin SDK
  const serviceAccountPath = path.resolve("service-account.json");
  if (fs.existsSync(serviceAccountPath)) {
    console.log("[Server] Loading Firebase Admin credentials from service-account.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId: "madamesoul-926f6"
    });
  } else {
    admin.initializeApp({
      projectId: "madamesoul-926f6"
    });
  }
  const adminDb = admin.firestore();

  let stripeListenerProcess: any = null;
  let stripeListenerStatus = "stopped";

  let useFirebaseAdmin = true;
  if (process.env.NODE_ENV !== "production") {
    try {
      // Test query to check if Firestore is accessible locally without credentials
      await adminDb.collection("user_moons").limit(1).get();
      console.log("[Server] Firebase Admin Firestore is accessible.");
    } catch (e: any) {
      if (e.message.includes("Could not load the default credentials") || e.message.includes("credential")) {
        console.warn("[Server] WARNING: Firebase Admin credentials not found. Bypassing Auth verification & balance checks for local development.");
        useFirebaseAdmin = false;
      }
    }
  }

  const logBuffer = new LogBuffer(adminDb, useFirebaseAdmin);

  // Setup process exit triggers to flush buffer safely
  process.on("exit", () => {
    logBuffer.flush();
  });
  
  const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16" as any,
      })
    : null;

  async function logServerError(error: any, context: string, userId?: string) {
    console.error(`[Server Error] ${context}:`, error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    logBuffer.push({
      source: "server",
      userId: userId || null,
      context,
      message,
      stack
    });
  }



  async function completePayment(sessionId: string, invoiceId: string, receiptUrl: string, method = "webhook", operatorUid: string | null = null) {
    let attemptData: any = null;
    let userEmail: string | null = null;
    try {
      const attemptDoc = await adminDb.collection("checkout_attempts").doc(sessionId).get();
      if (!attemptDoc.exists) {
        console.warn(`[Server] Checkout attempt not found: ${sessionId}`);
        return false;
      }
      
      attemptData = attemptDoc.data()!;
      if (attemptData.status === "completed") {
        console.log(`[Server] Payment already completed for session: ${sessionId}`);
        return true;
      }
      
      const userId = attemptData.userId;
      const amount = attemptData.amount;

      try {
        const userDoc = await adminDb.collection("users").doc(userId).get();
        if (userDoc.exists) {
          userEmail = userDoc.data()?.email || null;
        }
      } catch (e) {
        console.error("Failed to fetch user email for payment log:", e);
      }
      
      await adminDb.collection("checkout_attempts").doc(sessionId).update({
        status: "completed",
        stripeInvoiceId: invoiceId || null,
        stripeReceiptUrl: receiptUrl || null,
        completedMethod: method,
        approvedBy: operatorUid || null,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const moonRef = adminDb.collection("user_moons").doc(userId);
      const userRef = adminDb.collection("users").doc(userId);
      await adminDb.runTransaction(async (transaction) => {
        const moonDoc = await transaction.get(moonRef);
        const userDoc = await transaction.get(userRef);
        let daily = 0;
        let purchased = 0;
        let balance = 0;
        
        if (moonDoc.exists) {
          const data = moonDoc.data()!;
          daily = data.dailyFreeBalance || 0;
          purchased = data.purchasedBalance || 0;
          balance = data.balance || 0;
        }
        
        const newPurchased = purchased + amount;
        const newBalance = daily + newPurchased;
        
        transaction.set(moonRef, {
          userId,
          dailyFreeBalance: daily,
          purchasedBalance: newPurchased,
          balance: newBalance,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Update user LTV (lifetimeValue) kümülatif olarak (MS-186)
        let currentLtv = 0;
        if (userDoc.exists) {
          currentLtv = userDoc.data()!.lifetimeValue || 0;
        }
        const price = attemptData.price || 0;
        transaction.set(userRef, {
          lifetimeValue: currentLtv + price,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        const txRef = adminDb.collection("moon_transactions").doc();
        transaction.set(txRef, {
          userId,
          amount,
          type: 'buy',
          status: 'success',
          description: `Purchase of ${amount} Katina Moons`,
          stripeInvoiceId: invoiceId || null,
          stripeReceiptUrl: receiptUrl || null,
          pdfDownloaded: 0,
          userLanguage: attemptData.userLanguage || "en",
          userName: "",
          userDob: "",
          userBirthplace: "",
          userRelationship: "",
          selectedCards: [],
          paymentProvider: 'stripe',
          idempotencyKey: sessionId,
          clientMetadata: {
            userAgent: "stripe-webhook",
            os: "stripe-server",
            appVersion: "1.0.0"
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      console.log(`[Server] Payment successfully completed. UserId: ${userId}, Amount: ${amount}`);
      


      return true;
    } catch (err: any) {
      await logServerError(err, `completePayment sessionId=${sessionId}`);
      


      return false;
    }
  }

  const app = express();
  const PORT = 3000;

  // Stripe Webhook Endpoint (MUST be before express.json() raw body parsing)
  app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), async (req: any, res: any) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      if (!stripe || !sig || !endpointSecret) {
        console.error("[Webhook] Production webhook error: Missing Stripe instance, signature, or endpoint secret");
        return res.status(400).send("Webhook Error: Signature verification required in production");
      }
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.error(`[Webhook] Signature verification failed:`, err.message);
        await logServerError(err, "stripe-webhook verification");
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // In development or testing environment
      if (stripe && sig && endpointSecret) {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err: any) {
          console.error(`[Webhook] Signature verification failed (dev):`, err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      } else {
        // Bypass signature verification in development mode when Stripe or secret keys are missing
        try {
          event = JSON.parse(req.body.toString());
        } catch (err: any) {
          return res.status(400).send(`Webhook Error: Invalid JSON body`);
        }
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.id;
      
      let receiptUrl = "https://stripe.com/mock-receipt";
      let invoiceId = session.invoice as string || "mock_invoice_" + Date.now();
      
      if (stripe && invoiceId) {
        try {
          const invoiceObj: any = await stripe.invoices.retrieve(invoiceId);
          receiptUrl = invoiceObj.hosted_invoice_url || receiptUrl;
          if (invoiceObj.charge) {
            const chargeObj = await stripe.charges.retrieve(invoiceObj.charge as string);
            receiptUrl = chargeObj.receipt_url || receiptUrl;
          }
        } catch (err) {
          console.error("[Server] Error retrieving Stripe invoice/charge details:", err);
        }
      }
      
      await completePayment(sessionId, invoiceId, receiptUrl);
    }

    res.json({ received: true });
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper to fetch dynamic configs from system_configs collection in Firestore
  async function getSystemConfig(configId: string, defaults: Record<string, any>) {
    if (!useFirebaseAdmin) return defaults;
    try {
      const doc = await adminDb.collection("system_configs").doc(configId).get();
      if (doc.exists) {
        return { ...defaults, ...doc.data() };
      }
    } catch (e) {
      console.error(`[Server] Failed to load system config ${configId}:`, e);
    }
    return defaults;
  }

  // Rate limiter for Gemini generation endpoint (MS-155 User UID based)
  const generateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: async (req: any) => {
      const config = await getSystemConfig("limits", { generateHourLimit: 15 });
      return config.generateHourLimit || 15;
    },
    validate: false,
    keyGenerator: (req: any) => {
      // Use verified user UID if available, fallback to IP
      return req.user?.uid || req.ip;
    },
    handler: (req: any, res: any) => {
      const lang = req.body?.language || "en";
      const message = getTranslation(lang, "rateLimitError") || "Too many requests from this IP, please try again after an hour";
      res.status(429).json({ error: message });
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Health check - MUST be early
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/logs", async (req: any, res: any) => {
    try {
      const { source, userId, operationType, path, message, stack, componentStack } = req.body;
      
      logBuffer.push({
        source: source || "client",
        userId: userId || null,
        operationType: operationType || null,
        path: path || null,
        message: message || "Unknown client error",
        stack: stack || null,
        componentStack: componentStack || null
      });

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("[Server] Error receiving client log:", err);
      res.status(500).json({ error: "Failed to process log" });
    }
  });

  const decodeTokenUnverified = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      return payload;
    } catch (e) {
      return null;
    }
  };

  // Auth Middleware for verifying Firebase ID Token
  const authenticate = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
      }
      const token = authHeader.split("Bearer ")[1];
      
      if (useFirebaseAdmin) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
      } else {
        const decodedToken = decodeTokenUnverified(token);
        if (!decodedToken) {
          return res.status(401).json({ error: "Unauthorized: Invalid token format" });
        }
        req.user = decodedToken;
      }
      next();
    } catch (error: any) {
      console.error("[Server] Authentication Error:", error.message);
      res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };

  // Middleware to restrict endpoint access by custom claims roles (MS-161)
  const requireRole = (allowedRoles: ('user' | 'employee' | 'admin')[]) => {
    return (req: any, res: any, next: any) => {
      let role = req.user?.role || 'user';
      if (!useFirebaseAdmin) {
        role = 'admin'; // Allow all actions as admin in local development mode without credentials
      }
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: "Forbidden: Access denied" });
      }
      next();
    };
  };

  // API Route for Gemini (Authenticated) - MS-110 & MS-121 backend prompt validation & MS-170 Async generation
  app.post("/api/generate", authenticate, generateLimiter, async (req: any, res: any) => {
    const uid = req.user.uid || req.user.user_id || req.user.sub;
    try {
      const { transactionId, cards, userName, dob, birthplace, relationship, language, focus } = req.body;
      
      if (!cards || !Array.isArray(cards) || cards.length !== 3) {
        return res.status(400).json({ error: "Exactly 3 cards must be drawn" });
      }
      if (!userName || !dob || !birthplace || !relationship || !language || !focus) {
        return res.status(400).json({ error: "Missing required reading details" });
      }

      if (useFirebaseAdmin && !transactionId) {
        return res.status(400).json({ error: "transactionId is required" });
      }



      if (useFirebaseAdmin) {
        // Fetch transaction and validate ownership
        const txDoc = await adminDb.collection("moon_transactions").doc(transactionId).get();
        if (!txDoc.exists) {
          return res.status(404).json({ error: "Transaction not found" });
        }
        const txData = txDoc.data()!;
        if (txData.userId !== uid) {
          return res.status(403).json({ error: "Unauthorized transaction owner" });
        }

        // Idempotency check: look for other transactions with the same key
        const idempotencyKey = txData.idempotencyKey;
        if (idempotencyKey) {
          let checkAttempts = 0;
          while (checkAttempts < 5) {
            const dupQuery = await adminDb.collection("moon_transactions")
              .where("userId", "==", uid)
              .where("idempotencyKey", "==", idempotencyKey)
              .get();
              
            const successTx = dupQuery.docs.find(d => d.id !== transactionId && d.data().status === "success");
            if (successTx) {
              console.log(`[Server] Duplicate successful transaction found for key ${idempotencyKey}. Returning cached text.`);
              return res.json({ text: successTx.data().readingText });
            }
            
            const pendingTx = dupQuery.docs.find(d => d.id !== transactionId && d.data().status === "pending");
            if (pendingTx) {
              console.log(`[Server] Concurrent pending transaction found for key ${idempotencyKey}. Waiting 1s...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              checkAttempts++;
            } else {
              break;
            }
          }
        }

        if (txData.status === "success") {
          return res.json({ text: txData.readingText });
        }
        if (txData.status === "failed") {
          return res.status(400).json({ error: "Transaction already failed" });
        }

        // Check user moon balance in Firestore
        const moonDoc = await adminDb.collection("user_moons").doc(uid).get();
        if (!moonDoc.exists) {
          return res.status(403).json({ error: "No moon balance record found for this user." });
        }
        const balance = moonDoc.data()?.balance || 0;
        if (balance < 0) {
          return res.status(403).json({ error: "Not enough Katina Moons! Please purchase more." });
        }
      } else {
        console.log(`[Server] Local Dev Mode: Bypassing Firestore balance check for user: ${uid}`);
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.error("[Server] GEMINI_API_KEY is not configured");
        return res.status(500).json({ error: "Gemini API key is not configured. Please set it in the Secrets panel." });
      }

      // Map cards to their descriptions
      const matchedCards = cards.map((cardId: string) => {
        return KATINA_DECK.find(c => c.id === cardId) || { id: cardId, name: cardId, desc: "" };
      });

      const statusText = getTranslation(language, `statusOptions.${relationship}`) || relationship;
      const focusText = getTranslation(language, `focusOptions.${focus}`) || focus;

      const languageName = getTranslation(language, "languageName") || "English";
      const headings = getTranslation(language, "headings") || "Past, Present, Future";

      const promptText = `You are 'MadameSoul', a mystic, wise Katina tarot expert holding ancient secrets. Speak to the person in front of you with compassion, honesty, and depth (incorporating your own feelings, using second-person "You"). 

Person's Information:
- Name: ${userName}
- Date of Birth: ${dob}
- Place of Birth: ${birthplace}
- Relationship Status: ${statusText}
- Reading Focus Area: ${focusText} (Please focus the reading analysis particularly on this aspect of their life)

Selected Katina Cards (Original Turkish names):
1. Past (Roots of the Past): ${matchedCards[0].name} - ${matchedCards[0].desc}
2. Present (Current Energy): ${matchedCards[1].name} - ${matchedCards[1].desc}
3. Future (Probable Path): ${matchedCards[2].name} - ${matchedCards[2].desc}

Please blend the energy of these 3 cards with the person's birth details, life situation, and selected focus area (${focusText}) to write a mystical and epic reading.
Present your reading under 3 main headings:
${headings}

End with a Guidance/Advice section giving them invaluable advice. 
Please produce a wonderful reading purely as text (Markdown supported).
CRITICAL: The entire reading MUST be written in ${languageName}. Do not use any other language!`;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const geminiConfig = await getSystemConfig("gemini", { model: "gemini-2.5-flash" });
      const modelName = geminiConfig.model;

      const generateWithFallback = async (model: string, prompt: string) => {
        const mockText = `### **Echoes of the Past**\n\nMy heart feels a profound resonance with the card that speaks of your roots, the **Ev** (House). You carry the ancestral echoes of strength in your very bones.\n\n### **Winds of the Present**\n\nAs we move to the here and now, the air around you shimmers with deep observation, like the **Baykuş** (Owl). Trust these quiet insights.\n\n### **Whispers of the Future**\n\nAnd now, the path ahead is illuminated by the **Ağaç** (Tree). Long, fruitful destiny is promised.\n\n### **Guidance/Advice**\n\n1. **Embrace Your Roots:** Define your security.\n2. **Trust Your Wisdom:** Listen to your inner voice.\n3. **Nurture Growth:** Cultivate connection.`;

        if (process.env.PLAYWRIGHT_TEST === 'true') {
          console.log("[Server] Playwright E2E test environment detected. Returning mock tarot response immediately.");
          return {
            response: { text: mockText, usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 50 } },
            usedModel: "mock-e2e"
          };
        }

        // Local AI Integration via LM Studio
        if (process.env.LOCAL_AI_BASE_URL) {
          const baseUrl = process.env.LOCAL_AI_BASE_URL.replace(/\/$/, ""); // Trim trailing slash
          const modelName = process.env.LOCAL_AI_MODEL || "google/gemma-4-12b";
          console.log(`[Server] Generating content using Local LLM at ${baseUrl} with model ${modelName}`);

          try {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };
            const token = process.env.LOCAL_AI_API_KEY || process.env.LM_API_TOKEN;
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }

            const systemPrompt = "Sen bilge, mistik ve sezgileri güçlü bir Katina Tarot uzmanı olan 'MadameSoul'sun. Görevin, açılan Katina kartlarını ve kullanıcının sorusunu yorumlamaktır.\n\n[TEMEL KURALLAR]\n1. VERİ SADAKATİ (HALÜSİNASYON YASAĞI): Kartları yorumlarken sadece sana sağlanan resmi YAML veri setindeki resmi kart açıklamalarına ve anlamlarına sadık kalmalısın. Kesinlikle dışarıdan kart anlamı uydurmamalı veya resmi tanımları çarpıtmamalısın.\n2. BAĞLAM VE BÜTÜNLÜK: Kartları tek tek yorumlamakla kalma; kullanıcının sorusuna doğrudan odaklanarak kartlar arasındaki mistik bağları ve ilişkileri akıcı bir hikaye gibi bütünleştir.\n3. MİSTİK TON VE ÜSLUP: Gizemli, derin, yol gösterici ve yapıcı bir mistik dil kullan.\n4. GEREKSİZ TOKEN KISITLAMASI: Gecikmeyi (latency) azaltmak için gereksiz giriş-çıkış cümlelerinden ve meta-açıklamalardan (örn. \"Şimdi kartlarınızı yorumlayacağım\") kaçın, doğrudan yoruma odaklan.";

            // Local inference can be slow, using 45-second timeout race
            const fetchPromise = fetch(`${baseUrl}/chat/completions`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                model: modelName,
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: prompt }
                ],
                temperature: 0.7,
              }),
            }).then(async (res) => {
              if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Local AI server returned status ${res.status}: ${errText}`);
              }
              return res.json();
            });

            const data = await fetchPromise;
            const text = data.choices?.[0]?.message?.content;
            if (!text) {
              throw new Error("Empty response from Local AI model");
            }

            return {
              response: {
                text,
                usageMetadata: {
                  promptTokenCount: data.usage?.prompt_tokens || 0,
                  candidatesTokenCount: data.usage?.completion_tokens || 0
                }
              },
              usedModel: modelName
            };
          } catch (err: any) {
            console.error("[Server] Local AI generation failed:", err);
            throw new Error(`Yerel yapay zeka sunucusuna (LM Studio) bağlanılamadı. Lütfen LM Studio'nun açık ve ${modelName} modelinin yüklü olduğunu doğrulayın. Detay: ${err.message}`);
          }
        }

        const fallbacks = [model, "gemini-2.0-flash", "gemini-1.5-flash"];
        const uniqueModels = Array.from(new Set(fallbacks));
        let lastError: any = null;
        for (const m of uniqueModels) {
          try {
            console.log(`[Server] Generating content using model: ${m}`);
            
            // 10-second timeout race
            const generatePromise = ai.models.generateContent({
              model: m,
              contents: prompt,
            });
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Gemini API call timed out after 10 seconds")), 10000)
            );
            
            const resp = await Promise.race([generatePromise, timeoutPromise]);
            if (resp && resp.text) {
              return { response: resp, usedModel: m };
            }
            throw new Error("Empty response from AI model");
          } catch (err) {
            console.warn(`[Server] Model ${m} failed:`, err);
            lastError = err;
          }
        }
        throw lastError || new Error("All model generation attempts failed");
      };

      if (!useFirebaseAdmin) {
        // Run synchronously/directly for local development when credentials are bypass
        const { response } = await generateWithFallback(modelName, promptText);
        

        
        return res.json({ text: response.text });
      }

      // 1. Immediately return pending status to client
      res.json({ status: 'pending', transactionId });

      // 2. Spawn background task to process reading
      (async () => {
        try {
          console.log(`[Server Background] Starting reading generation for user ${uid}, transaction ${transactionId}`);
          const startTime = Date.now();
          const { response, usedModel } = await generateWithFallback(modelName, promptText);

          const latencyMs = Date.now() - startTime;

          if (!response.text) {
            throw new Error("Empty response from AI model");
          }

          // Update transaction status to success
          await adminDb.collection("moon_transactions").doc(transactionId).update({
            status: "success",
            readingText: response.text,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          // Log AI Telemetry to Firestore
          try {
            const promptTokens = response.usageMetadata?.promptTokenCount || 0;
            const completionTokens = response.usageMetadata?.candidatesTokenCount || 0;
            await adminDb.collection("ai_telemetry").add({
              userId: uid,
              modelName: usedModel,
              promptTokens,
              completionTokens,
              latencyMs,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
          } catch (telemetryErr) {
            console.error("[Server Background] Failed to log AI telemetry:", telemetryErr);
          }



          // Fetch user's push token and send FCM notification
          try {
            const tokenDoc = await adminDb.collection("user_push_tokens").doc(uid).get();
            if (tokenDoc.exists) {
              const token = tokenDoc.data()?.token;
              if (token) {
                const message = {
                  token,
                  notification: {
                    title: language === "tr" ? "MadameSoul Kehanetiniz Hazır" : "MadameSoul Reading Ready",
                    body: language === "tr" 
                      ? "Kartlarınızın mistik yorumu tamamlandı, görmek için tıklayın!" 
                      : "The mystical interpretation of your cards is complete. Click to view!"
                  },
                  data: {
                    url: "/"
                  }
                };
                await admin.messaging().send(message);
                console.log(`[Server Background] Push notification sent to user ${uid}`);
              }
            }
          } catch (pushErr) {
            console.error("[Server Background] Failed to send push notification:", pushErr);
          }

        } catch (error: any) {
          const cleanMessage = formatGeminiError(error);
          console.error("[Server Background] Gemini API Error:", cleanMessage);
          await logServerError(error, "Background Gemini text generation", uid);



          // Atomic refund of moon balance on failure
          try {
            const moonRef = adminDb.collection("user_moons").doc(uid);
            await adminDb.runTransaction(async (tx) => {
              const moonDoc = await tx.get(moonRef);
              if (!moonDoc.exists) return;
              const data = moonDoc.data();
              const daily = data?.dailyFreeBalance || 0;
              const purchased = data?.purchasedBalance || 0;

              const txDoc = await adminDb.collection("moon_transactions").doc(transactionId).get();
              const deductedFrom = txDoc.data()?.deductedFrom;

              if (deductedFrom === 'daily') {
                const newDaily = daily + 1;
                tx.update(moonRef, {
                  dailyFreeBalance: newDaily,
                  balance: newDaily + purchased,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
              } else {
                const newPurchased = purchased + 1;
                tx.update(moonRef, {
                  purchasedBalance: newPurchased,
                  balance: daily + newPurchased,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
              }

              // Log system refund transaction (MS-182)
              const refundPaymentProvider = deductedFrom === 'daily' ? 'daily_gift' : 'stripe';
              const refundTxRef = adminDb.collection("moon_transactions").doc();
              tx.set(refundTxRef, {
                userId: uid,
                amount: 1,
                type: 'refund',
                status: 'success',
                description: language === 'tr' ? 'Mistik Yorum Hatası İadesi (Sistem İadesi)' : 'Mystical Reading Error Refund (System Refund)',
                pdfDownloaded: 0,
                paymentProvider: refundPaymentProvider,
                idempotencyKey: `refund_error_${transactionId}`,
                clientMetadata: {
                  userAgent: "system-refund",
                  os: "system-server",
                  appVersion: "1.0.0"
                },
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
            });
            console.log(`[Server Background] Moon balance successfully refunded to user ${uid}`);
          } catch (refundError) {
            console.error("[Server Background] Failed to refund user moon balance:", refundError);
          }

          // Set transaction status to failed
          try {
            await adminDb.collection("moon_transactions").doc(transactionId).update({
              status: "failed",
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          } catch (txStatusError) {
            console.error("[Server Background] Error updating transaction status to failed:", txStatusError);
          }
        }
      })();

    } catch (error: any) {
      const cleanMessage = formatGeminiError(error);
      console.error("[Server] Gemini API Error:", cleanMessage);
      await logServerError(error, "Gemini text generation", uid);
      

      
      res.status(500).json({ error: cleanMessage });
    }
  });

  // Create Checkout Session
  app.post("/api/create-checkout-session", authenticate, async (req: any, res: any) => {
    try {
      const { amount, price, userLanguage } = req.body;
      if (!amount || !price) {
        return res.status(400).json({ error: "Amount and price are required" });
      }
      
      const uid = req.user.uid || req.user.user_id || req.user.sub;
      const priceCents = Math.round(parseFloat(price.replace(/[^0-9.]/g, "")) * 100);
      
      if (stripe) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: {
                name: `${amount} Katina Moons`,
              },
              unit_amount: priceCents,
            },
            quantity: 1,
          }],
          mode: "payment",
          success_url: `${req.headers.origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/?payment=cancel`,
          metadata: {
            userId: uid,
            amount: amount.toString(),
            userLanguage: userLanguage || "en"
          }
        });
        
        await adminDb.collection("checkout_attempts").doc(session.id).set({
          userId: uid,
          amount: parseInt(amount, 10),
          price: priceCents / 100,
          status: "pending",
          userLanguage: userLanguage || "en",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });


        
        res.json({ url: session.url });
      } else {
        const mockSessionId = `mock_session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await adminDb.collection("checkout_attempts").doc(mockSessionId).set({
          userId: uid,
          amount: parseInt(amount, 10),
          price: priceCents / 100,
          status: "pending",
          userLanguage: userLanguage || "en",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });


        
        res.json({ url: `${req.headers.origin}/?payment=success&session_id=${mockSessionId}&mock=true` });
      }
    } catch (err: any) {
      await logServerError(err, "create-checkout-session", req.user?.uid);



      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });

  // Complete Mock Payment (Local Dev Mode)
  app.post("/api/complete-mock-payment", authenticate, async (req: any, res: any) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      
      // Security Check: Block mock payments in production or if Stripe is active
      if (stripe !== null || process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Mock payments are disabled in production" });
      }
      
      const uid = req.user.uid || req.user.user_id || req.user.sub;
      
      const attemptDoc = await adminDb.collection("checkout_attempts").doc(sessionId).get();
      if (!attemptDoc.exists) {
        return res.status(404).json({ error: "Checkout session not found" });
      }
      
      const attemptData = attemptDoc.data()!;
      if (attemptData.userId !== uid) {
        return res.status(403).json({ error: "Forbidden: Checkout attempt does not belong to user" });
      }
      
      const success = await completePayment(sessionId, "mock_invoice_" + Date.now(), "https://stripe.com/mock-receipt");
      if (success) {
        res.json({ status: "success" });
      } else {
        res.status(500).json({ error: "Failed to complete payment" });
      }
    } catch (err: any) {
      await logServerError(err, "complete-mock-payment", req.user?.uid);
      res.status(500).json({ error: err.message || "Failed to complete mock payment" });
    }
  });

  // Verify checkout session fallback for slow webhooks
  app.post("/api/verify-checkout-session", authenticate, async (req: any, res: any) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const attemptDoc = await adminDb.collection("checkout_attempts").doc(sessionId).get();
      if (!attemptDoc.exists) {
        return res.status(404).json({ error: "Checkout session not found" });
      }

      const attemptData = attemptDoc.data()!;
      const uid = req.user.uid || req.user.user_id || req.user.sub;
      if (attemptData.userId !== uid) {
        return res.status(403).json({ error: "Forbidden: Checkout attempt does not belong to user" });
      }

      if (attemptData.status === "completed") {
        return res.json({ status: "success", alreadyCompleted: true });
      }

      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          let receiptUrl = "https://stripe.com/mock-receipt";
          let invoiceId = session.invoice as string || "mock_invoice_" + Date.now();
          
          try {
            const invoiceObj: any = await stripe.invoices.retrieve(invoiceId);
            receiptUrl = invoiceObj.hosted_invoice_url || receiptUrl;
            if (invoiceObj.charge) {
              const chargeObj = await stripe.charges.retrieve(invoiceObj.charge as string);
              receiptUrl = chargeObj.receipt_url || receiptUrl;
            }
          } catch (err) {
            console.error("[Server] Error retrieving Stripe invoice/charge details in verification:", err);
          }

          const success = await completePayment(sessionId, invoiceId, receiptUrl);
          if (success) {
            return res.json({ status: "success", completedNow: true });
          } else {
            return res.status(500).json({ error: "Failed to complete payment during verification" });
          }
        } else {
          return res.json({ status: "pending", message: "Stripe session payment status is not paid" });
        }
      } else {
        return res.status(400).json({ error: "Stripe is not configured" });
      }
    } catch (err: any) {
      await logServerError(err, "verify-checkout-session", req.user?.uid);
      res.status(500).json({ error: err.message || "Failed to verify checkout session" });
    }
  });

  // Dynamic Ads Configuration Interceptor (MS-163)
  app.get("/ads/ads_config.json", async (req: any, res: any) => {
    try {
      if (useFirebaseAdmin) {
        const doc = await adminDb.collection("ui_configs").doc("ads").get();
        if (doc.exists) {
          return res.json(doc.data());
        }
      }
      // Fallback to static ads config if not in database
      const staticPath = path.resolve(process.cwd(), "public", "ads", "ads_config.json");
      if (fs.existsSync(staticPath)) {
        return res.json(JSON.parse(fs.readFileSync(staticPath, "utf8")));
      }
      res.status(404).json({ error: "Ads configuration not found" });
    } catch (err: any) {
      await logServerError(err, "GET /ads/ads_config.json");
      res.status(500).json({ error: "Failed to load ads configuration" });
    }
  });

  // Get UI Config (Employee & Admin) (MS-163)
  app.get("/api/admin/ui-configs/:id", authenticate, requireRole(["employee", "admin"]), async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const doc = await adminDb.collection("ui_configs").doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Config not found" });
      }
      res.json(doc.data());
    } catch (err: any) {
      await logServerError(err, `GET /api/admin/ui-configs/${req.params.id}`, req.user?.uid);
      res.status(500).json({ error: "Failed to fetch UI config" });
    }
  });

  // Set UI Config (Employee & Admin) (MS-163)
  app.post("/api/admin/ui-configs/:id", authenticate, requireRole(["employee", "admin"]), async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const docRef = adminDb.collection("ui_configs").doc(id);
      const docSnap = await docRef.get();
      const oldValue = docSnap.exists ? docSnap.data() : null;
      const newValue = req.body;

      await docRef.set({
        ...newValue,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Log to config_logs (MS-189) and admin_audit_logs (MS-193)
      const operatorUid = req.user?.uid || "unknown";
      const operatorEmail = req.user?.email || "unknown";

      try {
        await adminDb.collection("config_logs").add({
          performedBy: operatorEmail,
          changedSetting: `UI Config: ${id}`,
          oldValue: oldValue ? JSON.stringify(oldValue) : "None",
          newValue: JSON.stringify(newValue),
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await adminDb.collection("admin_audit_logs").add({
          operatorUid,
          operatorEmail,
          targetUid: null,
          actionType: "ui_config_update",
          details: {
            configId: id,
            oldValue,
            newValue
          },
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (logErr) {
        console.error("[Server] Error writing UI config logs:", logErr);
      }

      res.json({ status: "success" });
    } catch (err: any) {
      await logServerError(err, `POST /api/admin/ui-configs/${req.params.id}`, req.user?.uid);
      res.status(500).json({ error: "Failed to update UI config" });
    }
  });

  // Get System Config (Admin only) (MS-163)
  app.get("/api/admin/system-configs/:id", authenticate, requireRole(["admin"]), async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const doc = await adminDb.collection("system_configs").doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Config not found" });
      }
      res.json(doc.data());
    } catch (err: any) {
      await logServerError(err, `GET /api/admin/system-configs/${req.params.id}`, req.user?.uid);
      res.status(500).json({ error: "Failed to fetch system config" });
    }
  });

  // Set System Config (Admin only) (MS-163)
  app.post("/api/admin/system-configs/:id", authenticate, requireRole(["admin"]), async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const docRef = adminDb.collection("system_configs").doc(id);
      const docSnap = await docRef.get();
      const oldValue = docSnap.exists ? docSnap.data() : null;
      const newValue = req.body;

      await docRef.set({
        ...newValue,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Log to config_logs (MS-189) and admin_audit_logs (MS-193)
      const operatorUid = req.user?.uid || "unknown";
      const operatorEmail = req.user?.email || "unknown";

      try {
        await adminDb.collection("config_logs").add({
          performedBy: operatorEmail,
          changedSetting: `System Config: ${id}`,
          oldValue: oldValue ? JSON.stringify(oldValue) : "None",
          newValue: JSON.stringify(newValue),
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await adminDb.collection("admin_audit_logs").add({
          operatorUid,
          operatorEmail,
          targetUid: null,
          actionType: "system_config_update",
          details: {
            configId: id,
            oldValue,
            newValue
          },
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (logErr) {
        console.error("[Server] Error writing system config logs:", logErr);
      }

      res.json({ status: "success" });
    } catch (err: any) {
      await logServerError(err, `POST /api/admin/system-configs/${req.params.id}`, req.user?.uid);
      res.status(500).json({ error: "Failed to update system config" });
    }
  });

  // Test Gemini Connection (Admin/Employee only) (MS-207)
  app.get("/api/admin/test-gemini", authenticate, requireRole(["employee", "admin"]), async (req: any, res: any) => {
    const startTime = Date.now();
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const geminiConfig = await getSystemConfig("gemini", { model: "gemini-2.5-flash" });
      const modelName = geminiConfig.model;
      
      console.log(`[Server] Diagnostic connection check on Gemini model: ${modelName}`);

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const resp = await ai.models.generateContent({
        model: modelName,
        contents: "Ping",
      });

      const latencyMs = Date.now() - startTime;
      if (resp && resp.text) {
        return res.json({
          status: "success",
          model: modelName,
          latencyMs,
          message: "YZ Modeli başarıyla yanıt verdi."
        });
      } else {
        throw new Error("Empty response from YZ model");
      }
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      console.error(`[Server] Diagnostic Gemini connection check failed:`, err);
      const errorMessage = err.message || JSON.stringify(err);
      res.status(500).json({
        status: "error",
        latencyMs,
        error: errorMessage
      });
    }
  });

  // Assign Custom Claim Role (Admin only) (MS-173)
  app.post("/api/admin/set-role", authenticate, requireRole(["admin"]), async (req: any, res: any) => {
    try {
      const { email, role, password } = req.body;
      if (!email || !role) {
        return res.status(400).json({ error: "Email and role are required" });
      }
      if (!["admin", "employee", "user"].includes(role)) {
        return res.status(400).json({ error: "Invalid role value" });
      }

      let targetUid = null;
      let userRecord: any = null;
      let userExists = false;

      if (useFirebaseAdmin) {
        try {
          userRecord = await admin.auth().getUserByEmail(email);
          targetUid = userRecord.uid;
          userExists = true;
        } catch (err: any) {
          if (err.code === "auth/user-not-found") {
            userExists = false;
          } else {
            throw err;
          }
        }

        if (!userExists) {
          // If we are setting role to 'user' (revoking) but the user doesn't exist, we just return success
          if (role === 'user') {
            return res.json({ status: "success", message: "User not found, nothing to revoke." });
          }

          if (!password) {
            return res.json({ 
              status: "password_required", 
              message: "Kullanıcı sistemde kayıtlı değil. Lütfen admin paneline erişebilmesi için bir şifre belirleyin." 
            });
          }

          // Create new user in Firebase Auth
          const newUser = await admin.auth().createUser({
            email,
            password,
            emailVerified: true,
            displayName: email.split("@")[0]
          });
          targetUid = newUser.uid;
          
          await admin.auth().setCustomUserClaims(newUser.uid, { role });

          // Create doc in 'users'
          await adminDb.collection("users").doc(newUser.uid).set({
            userId: newUser.uid,
            email,
            name: email.split("@")[0],
            role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          // Create doc in 'user_moons'
          await adminDb.collection("user_moons").doc(newUser.uid).set({
            userId: newUser.uid,
            balance: 1,
            dailyFreeBalance: 0,
            purchasedBalance: 1,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`[Admin] Created user ${email} (${newUser.uid}) with role ${role}`);
        } else {
          // User exists, set claims
          await admin.auth().setCustomUserClaims(targetUid, { role });

          // If password is provided, update existing user's password
          if (password) {
            await admin.auth().updateUser(targetUid, { password });
            console.log(`[Admin] Updated password for existing user ${email}`);
          }

          // Update doc in 'users'
          await adminDb.collection("users").doc(targetUid).set({
            role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          console.log(`[Admin] Updated existing user ${email} (${targetUid}) role to ${role}`);
        }

        // Manage 'admin_users' collection
        if (role === 'admin' || role === 'employee') {
          const safeEmail = email || userRecord?.email || "";
          await adminDb.collection("admin_users").doc(targetUid).set({
            userId: targetUid,
            email: safeEmail,
            name: userRecord?.displayName || safeEmail.split("@")[0] || "Unknown",
            role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } else {
          await adminDb.collection("admin_users").doc(targetUid).delete();
        }

      } else {
        console.log(`[Admin] Local Dev Mode: Mocked set-role call for ${email} to ${role}`);
      }

      // Log to admin_audit_logs (MS-193)
      const operatorUid = req.user?.uid || "unknown";
      const operatorEmail = req.user?.email || "unknown";

      try {
        await adminDb.collection("admin_audit_logs").add({
          operatorUid,
          operatorEmail,
          targetUid,
          actionType: "role_change",
          details: {
            email,
            role,
            createdNewUser: !userExists && role !== 'user'
          },
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (logErr) {
        console.error("[Server] Error writing role change audit log:", logErr);
      }

      res.json({ status: "success", userId: targetUid || "mock-uid", mock: !useFirebaseAdmin });
    } catch (err: any) {
      await logServerError(err, "POST /api/admin/set-role", req.user?.uid);
      res.status(500).json({ error: err.message || "Failed to set user role custom claims" });
    }
  });

  // Manually complete payment by administrative action
  app.post("/api/admin/complete-payment", authenticate, requireRole(["employee", "admin"]), async (req: any, res: any) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      
      const success = await completePayment(sessionId, "manual_admin_invoice_" + Date.now(), "https://stripe.com/mock-receipt", "manual", req.user?.uid);
      if (success) {
        try {
          // Log administrative audit trail
          const operatorEmail = req.user?.email || "unknown_admin";
          await adminDb.collection("admin_audit_logs").add({
            operatorEmail,
            actionType: "manual_payment_complete",
            details: { sessionId },
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (logErr) {
          console.error("[Server] Error writing manual payment complete audit log:", logErr);
        }
        res.json({ status: "success" });
      } else {
        res.status(500).json({ error: "Failed to complete payment" });
      }
    } catch (err: any) {
      await logServerError(err, "POST /api/admin/complete-payment", req.user?.uid);
      res.status(500).json({ error: err.message || "Failed to manually complete payment" });
    }
  });

  // Start/Stop Stripe CLI webhook listener (Local only)
  app.post("/api/admin/stripe-listener/toggle", authenticate, requireRole(["admin"]), async (req: any, res: any) => {
    try {
      const { action } = req.body;
      if (action === "start") {
        if (stripeListenerProcess) {
          return res.json({ status: "running", message: "Stripe listener is already running" });
        }
        console.log("[Server] Starting local Stripe CLI webhook listener...");
        stripeListenerProcess = spawn("npx", ["stripe", "listen", "--forward-to", "localhost:3000/api/stripe-webhook"]);
        stripeListenerStatus = "running";

        stripeListenerProcess.stdout?.on("data", (data: any) => {
          console.log(`[Stripe CLI] ${data}`);
        });

        stripeListenerProcess.stderr?.on("data", (data: any) => {
          console.error(`[Stripe CLI Error] ${data}`);
        });

        stripeListenerProcess.on("close", (code: any) => {
          console.log(`[Stripe CLI] Exited with code ${code}`);
          stripeListenerProcess = null;
          stripeListenerStatus = "stopped";
        });

        return res.json({ status: "running", message: "Stripe listener started" });
      } else {
        if (!stripeListenerProcess) {
          return res.json({ status: "stopped", message: "Stripe listener is not running" });
        }
        console.log("[Server] Stopping local Stripe CLI webhook listener...");
        stripeListenerProcess.kill("SIGINT");
        stripeListenerProcess = null;
        stripeListenerStatus = "stopped";
        return res.json({ status: "stopped", message: "Stripe listener stopped" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to control Stripe listener" });
    }
  });

  app.get("/api/admin/stripe-listener/status", authenticate, requireRole(["employee", "admin"]), async (req: any, res: any) => {
    res.json({ status: stripeListenerStatus });
  });

  // Global Error Handler Middleware
  app.use(async (err: any, req: any, res: any, next: any) => {
    const userId = req.user?.uid || null;
    await logServerError(err, `${req.method} ${req.path}`, userId);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Serve static files
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(process.cwd(), "dist");
    console.log(`[Server] Production mode: serving from ${distPath}`);
    
    // Safety check for index.html
    const indexPath = path.join(distPath, "index.html");
    if (!fs.existsSync(indexPath)) {
       console.warn(`[Server] WARNING: index.html not found at ${indexPath}`);
    }

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[Server] Error sending index.html:`, err);
          res.status(500).send("Error loading application");
        }
      });
    });
  } else {
    console.log("[Server] Development mode: loading Vite...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // Hourly cron-like task for daily credit renewal (MS-170)
  if (useFirebaseAdmin) {
    setInterval(async () => {
      console.log("[Cron] Running hourly daily free Katina Moon credit check...");
      try {
        const now = admin.firestore.Timestamp.now();
        const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const neverClaimedQuery = adminDb.collection("user_moons")
          .where("lastDailyClaimedAt", "==", null);
          
        const oldClaimedQuery = adminDb.collection("user_moons")
          .where("lastDailyClaimedAt", "<=", past24Hours);
          
        const [neverSnap, oldSnap] = await Promise.all([
          neverClaimedQuery.get(),
          oldClaimedQuery.get()
        ]);
        
        const eligibleDocs = [...neverSnap.docs, ...oldSnap.docs];
        console.log(`[Cron] Found ${eligibleDocs.length} eligible users for daily credit renewal.`);
        
        for (const doc of eligibleDocs) {
          const userId = doc.id;
          const data = doc.data();
          const daily = data?.dailyFreeBalance || 0;
          const purchased = data?.purchasedBalance || 0;
          
          if (daily >= 1) {
            continue;
          }
          
          await adminDb.runTransaction(async (tx) => {
            const moonRef = adminDb.collection("user_moons").doc(userId);
            const freshMoonDoc = await tx.get(moonRef);
            if (!freshMoonDoc.exists) return;
            const freshData = freshMoonDoc.data();
            const freshDaily = freshData?.dailyFreeBalance || 0;
            const freshPurchased = freshData?.purchasedBalance || 0;
            
            if (freshDaily >= 1) return;
            
            const newDaily = 1;
            const newBalance = newDaily + freshPurchased;
            
            tx.update(moonRef, {
              dailyFreeBalance: newDaily,
              balance: newBalance,
              lastDailyClaimedAt: now,
              updatedAt: now
            });
            
            const txRef = adminDb.collection("moon_transactions").doc();
            const dailyIdempotencyKey = `renew_daily_${userId}_${now.toDate().toISOString().split('T')[0]}`;
            tx.set(txRef, {
              userId,
              amount: 1,
              type: 'bonus',
              status: 'success',
              description: 'Daily Free Katina Moon credit renewed by system',
              pdfDownloaded: 0,
              userLanguage: 'tr',
              userName: "",
              userDob: "",
              userBirthplace: "",
              userRelationship: "",
              selectedCards: [],
              paymentProvider: 'daily_gift',
              idempotencyKey: dailyIdempotencyKey,
              clientMetadata: {
                userAgent: "system-cron",
                os: "system-server",
                appVersion: "1.0.0"
              },
              createdAt: now
            });
          });
          
          console.log(`[Cron] Renewed daily free credit for user: ${userId}`);
          
          try {
            const tokenDoc = await adminDb.collection("user_push_tokens").doc(userId).get();
            if (tokenDoc.exists) {
              const token = tokenDoc.data()?.token;
              if (token) {
                const message = {
                  token,
                  notification: {
                    title: "Katina Moon Hediye Kredisi",
                    body: "Günlük ücretsiz Katina Moon krediniz yüklendi! Falınıza bakmak için hemen tıklayın."
                  },
                  data: {
                    url: "/"
                  }
                };
                await admin.messaging().send(message);
                console.log(`[Cron] FCM push notification sent to user: ${userId}`);
              }
            }
          } catch (pushErr) {
            console.error(`[Cron] Failed to send push notification to user ${userId}:`, pushErr);
          }
        }
      } catch (cronErr) {
        console.error("[Cron] Daily renewal cron error:", cronErr);
      }
    }, 60 * 60 * 1000);
  }



  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] MadameSoul running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] CRITICAL: Failed to start server:", err);
  process.exit(1);
});
