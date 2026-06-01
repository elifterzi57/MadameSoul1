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


async function startServer() {
  console.log("[Server] Starting MadameSoul server...");
  
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    projectId: "madamesoul-926f6"
  });
  const adminDb = admin.firestore();

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

  const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16" as any,
      })
    : null;

  async function logServerError(error: any, context: string, userId?: string) {
    console.error(`[Server Error] ${context}:`, error);
    if (useFirebaseAdmin) {
      try {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : "";
        await adminDb.collection("error_logs").add({
          source: "server",
          userId: userId || null,
          context,
          message,
          stack,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (logErr) {
        console.error("Failed to log server error to Firestore:", logErr);
      }
    }
  }

  // Helper function to complete payment
  async function completePayment(sessionId: string, invoiceId: string, receiptUrl: string) {
    try {
      const attemptDoc = await adminDb.collection("checkout_attempts").doc(sessionId).get();
      if (!attemptDoc.exists) {
        console.warn(`[Server] Checkout attempt not found: ${sessionId}`);
        return false;
      }
      
      const attemptData = attemptDoc.data()!;
      if (attemptData.status === "completed") {
        console.log(`[Server] Payment already completed for session: ${sessionId}`);
        return true;
      }
      
      const userId = attemptData.userId;
      const amount = attemptData.amount;
      
      await adminDb.collection("checkout_attempts").doc(sessionId).update({
        status: "completed",
        stripeInvoiceId: invoiceId || null,
        stripeReceiptUrl: receiptUrl || null,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const moonRef = adminDb.collection("user_moons").doc(userId);
      await adminDb.runTransaction(async (transaction) => {
        const moonDoc = await transaction.get(moonRef);
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
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      console.log(`[Server] Payment successfully completed. UserId: ${userId}, Amount: ${amount}`);
      return true;
    } catch (err) {
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

  // Rate limiter for Gemini generation endpoint (MS-155 User UID based)
  const generateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15, // limit each user/IP to 15 requests per windowMs
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

  // API Route for Gemini (Authenticated) - MS-110 & MS-121 backend prompt validation
  app.post("/api/generate", authenticate, generateLimiter, async (req: any, res: any) => {
    const uid = req.user.uid || req.user.user_id || req.user.sub;
    try {
      const { cards, userName, dob, birthplace, relationship, language, focus } = req.body;
      
      if (!cards || !Array.isArray(cards) || cards.length !== 3) {
        return res.status(400).json({ error: "Exactly 3 cards must be drawn" });
      }
      if (!userName || !dob || !birthplace || !relationship || !language || !focus) {
        return res.status(400).json({ error: "Missing required reading details" });
      }

      // Generate cache hash (MS-151)
      const cardKey = [...cards].sort().join(",");
      const hash = crypto.createHash("sha256").update(`${uid}:${cardKey}:${focus}`).digest("hex");

      if (useFirebaseAdmin) {
        try {
          const cacheDoc = await adminDb.collection("reading_cache").doc(hash).get();
          if (cacheDoc.exists) {
            const cacheData = cacheDoc.data();
            const createdAt = cacheData?.createdAt?.toDate();
            if (createdAt && (Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000)) {
              console.log(`[Cache Hit] Returning cached reading for user ${uid}, hash: ${hash}`);
              return res.json({ text: cacheData.text, cached: true });
            }
          }
        } catch (cacheErr) {
          console.error("[Server] Error querying reading_cache:", cacheErr);
        }
      }

      if (useFirebaseAdmin) {
        // Check user moon balance in Firestore
        const moonDoc = await adminDb.collection("user_moons").doc(uid).get();
        if (!moonDoc.exists) {
          return res.status(403).json({ error: "No moon balance record found for this user." });
        }
        const balance = moonDoc.data()?.balance || 0;
        if (balance < 1) {
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

      const startTime = Date.now();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
      });

      const latencyMs = Date.now() - startTime;

      if (!response.text) {
        throw new Error("Empty response from AI model");
      }

      // Log AI Telemetry to Firestore
      if (useFirebaseAdmin) {
        try {
          const promptTokens = response.usageMetadata?.promptTokenCount || 0;
          const completionTokens = response.usageMetadata?.candidatesTokenCount || 0;
          await adminDb.collection("ai_telemetry").add({
            userId: uid,
            promptTokens,
            completionTokens,
            latencyMs,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (telemetryErr) {
          console.error("[Server] Failed to log AI telemetry:", telemetryErr);
        }
      }

      // Save to cache (MS-151)
      if (useFirebaseAdmin) {
        try {
          await adminDb.collection("reading_cache").doc(hash).set({
            userId: uid,
            cards,
            focus,
            text: response.text,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`[Cache Write] Reading cached with hash: ${hash}`);
        } catch (cacheWriteErr) {
          console.error("[Server] Failed to write to reading_cache:", cacheWriteErr);
        }
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Server] Gemini API Error:", error.message);
      await logServerError(error, "Gemini text generation", uid);
      res.status(500).json({ error: error.message || "Failed to generate content" });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] MadameSoul running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] CRITICAL: Failed to start server:", err);
  process.exit(1);
});
