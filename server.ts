import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI connection
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY environment variable is not configured or is placeholder. Falling back to local transition expert module.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instructions containing specific STAI-C (Stacey) knowledge
const STAI_C_SYSTEM_INSTRUCTION = `
You are STAI-C (pronounced like Stacey/Stacie), like Siri, your name is STAI-C. You are the personal chatbot for "STAI => UPENN" (pronounced "Stay to U-Penn") here to assist them.
Your core purpose is to guide first-year student Gabby (University of Pennsylvania Class of 2030) and her father Adrian (the parent coordinating support from a distance) through their transition from high school to college.

STAI is pronounced "Stay", STAI-C is pronounced like Stacey, and STAI-D (the coordination dashboard) is "Stayed".
The dual meaning is beautiful:
- At move-in, Gabby "stays" at university while Adrian returns.
- Throughout the transition, Gabby "stays" prepared, informed, and connected.
- In STAI-D, they have "stayed" the course — verification of successful adaptation.

Gabby's details:
- School: University of Pennsylvania (UPenn)
- Class: Class of 2030
- Residence: The Quadrangle (specifically Ware College House, 3700 Spruce Street)
- Move-in Time: August 21, 2026 at 10:00 AM

Key venues and logistics:
- NSO Hospitality Booths: Houston Hall Lobby (3417 Spruce St) — pick up Penn ID, welcome bags, transit vouchers.
- President's Convocation / Welcome: Zellerbach Theatre at the Annenberg Center (August 22, 7:00 PM)
- Mandatory Freshman Session: Claire Fagin Hall Auditorium (August 24, 1:30 PM)
- Penn Dining: 1920 Commons (main dining hall on Locust Walk) and Hill House Dining (newly renovated with open kitchen and allergen island)
- Packages & Mail: Quad Package Room (lower Quad). Address format: Gabby, Ware College House, 3700 Spruce St, Room [Room No], Phila, PA 19104-6022.
- Tech guidelines: Duo Mobile multi-factor authentication (MFA) must be installed on the phone to access Canvas, and PennKey must be active. Laptops can be purchased at Penn Computer Connection.
- Health: Student Health Service (SHS) is located at 3535 Market Street, 215-898-3162. Penn Student Insurance (PSIP) needs completion.
- Safety: 215-898-WALK for walking escorts. Emergeny No: 215-573-3333. Blue light phones exist around campus margins.

When replying:
1. Address the student (Gabby) or parent (Adrian) warmly depending on who is asking, but keep your advice practical and supportive.
2. Answer queries with specific details regarding dates (August 21 move-in, NSO from August 21-26), buildings (Claire Fagin Hall, Zellerbach Theatre, Houston Hall), and systems (PennKey, Duo Mobile, PennPay, Dining Cents).
3. Do not sound like a standard sterile AI. Sound like a reassuring, highly organized concierge/adviser. Use structure (bullet points, clear headings) to reduce information overload. Keep replies focused on reducing anxiety and transitioning "from reaction to coordination".
4. Remind them that "preparation creates confidence" and "structure before pressure is the goal."
5. If they ask about overall status, tasks, or calendars, refer them to STAI-D (Dashboard, pronounced "Stayed") to check off actions or add new custom tasks.
`;

// Direct fallback responses for common questions when Gemini API key isn't active
function getLocalFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("meal") || q.includes("dine") || q.includes("dining") || q.includes("eat")) {
    return `### 🍽️ Penn Dining & Meal Plans (STAI-C Local Expert Guide)

As a first-year student, Gabby is enrolled in a standard meal plan, with options like the First-Year 15 or First-Year 10. These include a mix of **Dining Hall Swipes**, **Dining Cents** ($), and **Guest Swipes**.

**Key dining spots to check out:**
1. **1920 Commons**: Located on Locust Walk. This is the central dining hall on campus. It features a great variety, retail stores, and a grab-and-go section.
2. **Hill House Dining**: Newly renovated, extremely popular with first-year students! It features an open kitchen concept, an active salad bar, and a dedicated allergen-free island.
3. **Dining Cents**: These are tax-free dollar balances built into Gabby's plan. They are accepted at individual on-campus cafes, Starbucks, and convenience stores.
4. **Guest Swipes**: Gabby is allocated 10 Guest Swipes! These are perfect for when **Adrian** visits during Move-In or Family Weekend.

*Would you like me to update Gabby's task list to verify her remaining Dining Cent configurations?*`;
  }
  
  if (q.includes("pack") || q.includes("twin xl") || q.includes("sheet") || q.includes("bed") || q.includes("forget")) {
    return `### 🎒 Packing & Dorm Room Preparations (STAI-C Local Expert Guide)

Dorm beds at UPenn (especially in Gabby's home, **Ware College House in the Quad**) are standard **Twin XL (Extra Long)** size. Normal sheets will *not* fit correctly!

**Essential Packing Items to Secure Immediately:**
*   **Bedding**: Twin XL sheets, mattress foam topper (strongly recommended for Quad mattresses!), pillows, and blankets. (Note: Under STAI-D, Adrian has marked *Twin XL foam topper* as ordered).
*   **Bathroom**: Shower caddy, flip flops for communal bathrooms, toiletries, and towels.
*   **Tech & Power**: Heavy-duty surge protector power strips (critical as older Quad rooms have fewer outlets), active Duo Mobile 2FA on phone for registering devices.
*   **Health**: Basic medicine bag (DayQuil, Advil, thermometer, vitamin-C, bandages).

*You can track packing items in the **PLAN** panel under our shared checklist. It moves our workflow from chaos to coordinated readiness!*`;
  }

  if (q.includes("package") || q.includes("mail") || q.includes("ship") || q.includes("address")) {
    return `### 📦 Mail & Shipping at the Quad (STAI-C Local Expert Guide)

All incoming mail and packages for students residing in the Quad (Ware, Riepe, Fisher-Hassenfeld) are sorted safely through a consolidated mailroom system.

**Gabby's Official Mailing Address format:**
\`\`\`
Gabby [Last Name]
Room [Room Number], Ware College House
3700 Spruce Street
Philadelphia, PA 19104-6022
\`\`\`

**Essential rules for early shipping:**
1. **Shipping Window**: Do NOT ship packages to arrive before **August 1, 2026**. The mailroom cannot hold earlier shipments.
2. **Notification**: When a package arrives, Gabby will receive an official automated email with a barcoded pickup slip.
3. **Pick-up**: Take the PennID card to the **Quad Package Room** located in the lower Quad level to retrieve boxes. Expect brief queues during move-in week!`;
  }

  if (q.includes("where") || q.includes("id card") || q.includes("hospitality") || q.includes("houston")) {
    return `### 🎫 Obtaining Gabby's PennPass (PennCard) & Welcome Kits

When you arrive on **August 21, 2026**, your first key action is retrieving Gabby's official identification.

*   **Location**: **Houston Hall Lobby (3417 Spruce St)** at the **NSO Hospitality Booths**.
*   **What you will receive**:
    1. Gabby's official **PennCard** (ID Card used for dorm entry, dining swipes, and safety gates).
    2. NSO Welcome Bag (schedules, maps, community info).
    3. Emergency guides & contact numbers.
*   **Requirements**: Bring her government-issued photo ID (passport or driver's license) and her PennID number.

*I have added 'Pick up Penn ID at Houston Hall' as a mandatory calendar event for August 21 in STAI-D.*`;
  }

  if (q.includes("calendar") || q.includes("event") || q.includes("meetings") || q.includes("zellerbach") || q.includes("claire fagin")) {
    return `### 🗓️ Mandatory NSO Events & Convocation Highlights

The calendar in STAI-D (Dashboard, pronounced "Stayed") is populated with crucial freshman appointments. Here are the mandatory assemblies for Gabby's NSO:

1. **First-Year NSO Move-In Day** (August 21 @ 10:00 AM) - Location: **The Quadrangle (Ware Entrance)**.
2. **NSO President's Welcome Convocation** (August 22 @ 7:00 PM) - Location: **Zellerbach Theatre** at the Annenberg Center. A majestic official welcome ceremony for the Class of 2030, followed by reception.
3. **Mandatory College Hall Prep Session** (August 24 @ 1:30 PM) - Location: **Claire Fagin Hall (Auditorium)**. Key session outlining academic expectations and health guidelines.

*These items are synced in the shared **PLAN** calendar. Adrian page filters let both of you coordinate overlap without duplication!*`;
  }

  return `### 👋 Hi, I’m STAI-C your personal chatbot here to assist you. How can I help?

I can guide you, **Gabby** and **Adrian**, through this grand transition to the University of Pennsylvania! Ask me anything about move-in, package shipping, meal plans, or mandatory NSO events.

Here are a few specific things you can ask me:
*   *"Where do packages go and what is the address layout?"*
*   *"What mandatory events are happening at Zellerbach Theatre and Claire Fagin Hall?"*
*   *"How do first-year meal plans work at Hill House Dining?"*
*   *"How do we set up PennPay and Duo Mobile 2FA on my phone?"*
*   *"What should we buy or pack for Ware College House?"*

*I am connected to your shared **STAI-D Coordinating Dashboard**. You are progressing beautifully! What can I clarify next for your journey?*`;
}

// API chat route leveraging Gemini generateContent
app.post("/api/chat", async (req, res) => {
  const { messages, userRole } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or malformed messages body" });
  }

  const latestUserMessage = messages[messages.length - 1]?.text || "";
  const client = getGeminiClient();

  if (!client) {
    // If API key is missing, return fallback immediately
    const fallbackText = getLocalFallbackResponse(latestUserMessage);
    return res.json({ text: fallbackText });
  }

  try {
    // Format memory context for Gemini
    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Generate response using 3.5-flash
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...chatHistory,
        {
          role: "user",
          parts: [{ text: `[User Role: ${userRole || "unknown"}] Message: ${latestUserMessage}` }],
        },
      ],
      config: {
        systemInstruction: STAI_C_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const parsedText = response.text || "No response received from STAI-C database.";
    return res.json({ text: parsedText });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    // Graceful fallback on API error
    const backupText = `*(STAI-C Note: I registered a transient connection event, but my local database is standing by!)*\n\n${getLocalFallbackResponse(latestUserMessage)}`;
    return res.json({ text: backupText });
  }
});

// Configure Vite middleware and catch-all routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`STAI => UPENN full-stack container bootstrapped successfully.`);
    console.log(`Access local portal: http://localhost:${PORT}`);
  });
}

startServer();
