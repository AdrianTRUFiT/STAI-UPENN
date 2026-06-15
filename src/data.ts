import { ReadinessArea, Task, CalendarEvent, JourneyMilestone, DiscoverItem } from "./types";

export const initialReadinessAreas: ReadinessArea[] = [
  {
    id: "travel",
    title: "Travel Logistics",
    status: "in_progress",
    description: "Flights, campus shuttle, hotel reservations, and returning travel coordination.",
    icon: "Plane",
    lastUpdated: "June 14, 2026",
    notes: "Adrian's return flight is booked. Gabby's Amtrak ticket is confirmed."
  },
  {
    id: "housing",
    title: "Housing & Dorm Room",
    status: "complete",
    description: "Dorm assignment, roommate agreement details, and mailing address rules.",
    icon: "Home",
    lastUpdated: "June 15, 2026",
    notes: "Assigned to the Quad (Ware College House). Dorm layout guidelines checked."
  },
  {
    id: "technology",
    title: "Technology Setup",
    status: "needs_attention",
    description: "PennKey registration, Duo Mobile dual-factor authentication, and school laptop purchase.",
    icon: "Laptop",
    lastUpdated: "June 10, 2026",
    notes: "PennKey setup completed, but Duo MFA needs to be registered on Gabby's new phone."
  },
  {
    id: "orientation",
    title: "Orientation Prep",
    status: "in_progress",
    description: "NSO (New Student Orientation) schedules, mandatory assemblies, and placement exams.",
    icon: "Compass",
    lastUpdated: "June 12, 2026",
    notes: "Mandatory Convocation is on the schedule. Placements in Math and Spanish should be finalized."
  },
  {
    id: "health",
    title: "Health & Immunizations",
    status: "complete",
    description: "Vaccine records upload, Student Health Insurance plan selection, and emergency contacts.",
    icon: "ShieldAlert",
    lastUpdated: "June 15, 2026",
    notes: "Immunization records are approved by Penn Student Health. PSIP selection submitted."
  },
  {
    id: "packing",
    title: "Packing List",
    status: "in_progress",
    description: "Dorm room essentials, weather-appropriate clothing, and pre-purchased items.",
    icon: "PackageOpen",
    lastUpdated: "June 13, 2026",
    notes: "Purchased Twin XL sheets. Need to finalize bathroom supply list and communal items."
  },
  {
    id: "move_in",
    title: "Move-In Slot & Unpacking",
    status: "in_progress",
    description: "Move-in timeslot, key pickup procedures, Quad parking passes, and unloading help.",
    icon: "Compass",
    lastUpdated: "June 15, 2026",
    notes: "Selected move-in slot: August 21, 2026 at 10:00 AM."
  },
  {
    id: "student_accounts",
    title: "Student Accounts & PennPay",
    status: "needs_attention",
    description: "Direct deposit, PennPay authorized payers, and selecting freshmen dining meal plans.",
    icon: "CreditCard",
    lastUpdated: "June 08, 2026",
    notes: "Adrian needs to be added as an Authorized Payer on PennPay to clear the initial semester bill."
  }
];

export const initialTasks: Task[] = [
  // Travel
  {
    id: "t1",
    category: "travel",
    title: "Book return flight home for Adrian",
    description: "Reserve the flight home for Adrian after move-in is completed and Gabby is settled in.",
    dueDate: "2026-06-30",
    completed: true,
    assignedTo: "parent",
    purchases: ["Return Flight Ticket"],
    type: "family"
  },
  {
    id: "t2",
    category: "travel",
    title: "Reserve high-speed airport shuttle or transit",
    description: "Arrange transportation from Philadelphia International Airport (PHL) to UPenn's campus.",
    dueDate: "2026-07-15",
    completed: false,
    assignedTo: "both",
    type: "family"
  },
  {
    id: "t2_p1",
    category: "travel",
    title: "Download local SEPTA Transit App",
    description: "Learn routes for Philly trolley, regional rails, and campus margins.",
    dueDate: "2026-08-10",
    completed: false,
    assignedTo: "student",
    type: "personal"
  },
  {
    id: "t2_p2",
    category: "travel",
    title: "Create Philly Favorites & Emergency Contacts list",
    description: "Pin spots, local diners near spruce, and campus medical limits in contact cards.",
    dueDate: "2026-08-18",
    completed: false,
    assignedTo: "student",
    type: "personal"
  },
  // Housing
  {
    id: "t3",
    category: "housing",
    title: "Coordinate dorm essentials with Quad roommate",
    description: "Reach out to Roommate regarding shared items like fridge, microwave, rug, and TV to avoid duplicates.",
    dueDate: "2026-07-01",
    completed: true,
    assignedTo: "student",
    type: "personal"
  },
  {
    id: "t4",
    category: "housing",
    title: "Understand UPenn mail system rules & address format",
    description: "Verify where packages go (e.g. Quad Package Room) and check if pre-arrivals can be shipped in advance.",
    dueDate: "2026-08-01",
    completed: false,
    assignedTo: "parent",
    documents: ["UPenn Mail & Package Guidelines"],
    type: "required"
  },
  {
    id: "t3_p1",
    category: "housing",
    title: "Order shared micro-fridge and dorm layout rugs",
    description: "Split cost and purchase certified low-wattage electronics safe for ancient Quad outlets.",
    dueDate: "2026-07-25",
    completed: false,
    assignedTo: "both",
    type: "personal"
  },
  // Tech
  {
    id: "t5",
    category: "technology",
    title: "Configure Duo Mobile 2FA on new phone",
    description: "Enable dual-factor authentication linked to PennKey for secure access to Canvas and PennInTouch.",
    dueDate: "2026-06-25",
    completed: false,
    assignedTo: "student",
    type: "required"
  },
  {
    id: "t6",
    category: "technology",
    title: "Order school laptop via Penn Computer Connection",
    description: "Purchase the engineering/humanities spec laptop covered by Penn key warranties and on-campus support.",
    dueDate: "2026-07-10",
    completed: false,
    assignedTo: "both",
    cost: 1450,
    purchases: ["MacBook Air 15-inch"],
    type: "personal"
  },
  // Orientation
  {
    id: "t7",
    category: "orientation",
    title: "Review Penn Reading Project book selection",
    description: "Obtain and read the assigned Penn Reading Project book for group discussions during NSO.",
    dueDate: "2026-08-15",
    completed: false,
    assignedTo: "student",
    purchases: ["Selected Reading Book"],
    type: "required"
  },
  {
    id: "t8",
    category: "orientation",
    title: "Register for Wharton First-Year Festival events",
    description: "Secure spots for first-year welcome events and network with peer advisors.",
    dueDate: "2026-08-05",
    completed: false,
    assignedTo: "student",
    type: "required"
  },
  // Health
  {
    id: "t9",
    category: "health",
    title: "Upload official immunization records to SHS",
    description: "Ensure the UPenn Student Health Service form is completed and signed by doctor.",
    dueDate: "2026-06-15",
    completed: true,
    assignedTo: "student",
    documents: ["Official Vaccine Record of Gabby"],
    type: "required"
  },
  // Packing
  {
    id: "t10",
    category: "packing",
    title: "Buy extra-long Twin XL bed sheets & mattress topper",
    description: "Dorm beds require Twin XL size sheets. Mattress foam topper is highly recommended.",
    dueDate: "2026-07-20",
    completed: true,
    assignedTo: "parent",
    cost: 85,
    purchases: ["Twin XL Sheet Set", "Memory Foam Mattress Topper"],
    type: "personal"
  },
  {
    id: "t11",
    category: "packing",
    title: "First-aid kit and emergency medicine bag",
    description: "Prepare cold remedies, pain relievers, bandages, thermometer, and prescriptive refills.",
    dueDate: "2026-08-05",
    completed: false,
    assignedTo: "both",
    purchases: ["Advil", "DayQuil", "Thermometer", "Emergency Bandages"],
    type: "personal"
  },
  {
    id: "t11_p1",
    category: "packing",
    title: "Order custom LEDs and whiteboard calendars",
    description: "Small visual notes whiteboard for door interactions.",
    dueDate: "2026-07-28",
    completed: false,
    assignedTo: "student",
    type: "personal"
  },
  // Student Accounts
  {
    id: "t12",
    category: "student_accounts",
    title: "Set up Adrian as PennPay Authorized Payer",
    description: "Gabby must add Adrian's email to PennPay so he can view bills and directly coordinate tuition payment.",
    dueDate: "2026-06-30",
    completed: false,
    assignedTo: "student",
    type: "required"
  },
  {
    id: "t13",
    category: "student_accounts",
    title: "Select UPenn Dining Meal Plan",
    description: "Choose optimal dining option (First-Year 15 or 10) including Dining Cents and Guest Swipes.",
    dueDate: "2026-07-05",
    completed: true,
    assignedTo: "both",
    documents: ["UPenn Dining Agreement Form"],
    type: "required"
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Add Parent to PennPay Deadline",
    date: "2026-06-30",
    time: "5:00 PM EST",
    location: "Online / PennPay Portal",
    description: "Critical for billing access before first installment is due.",
    assignedTo: "student"
  },
  {
    id: "e2",
    title: "Pre-Orientation/Math Placement Exam Due",
    date: "2026-07-15",
    time: "11:59 PM EST",
    location: "Online / Canvas Portal",
    description: "Placement evaluation used for freshman course registration permissions.",
    assignedTo: "student",
    isMandatory: true
  },
  {
    id: "e3",
    title: "Ship Dorm Packages to Campus Mailroom",
    date: "2026-08-01",
    time: "All Day",
    location: "Penn Package Pick-up Locations",
    description: "Start of allowed window to send luggage/boxes directly to Quad mailing hubs.",
    assignedTo: "parent"
  },
  {
    id: "e4",
    title: "First-Year NSO Move-In Day",
    date: "2026-08-21",
    time: "10:00 AM EST",
    location: "The Quadrangle (Ware Entrance)",
    description: "Unload the car, pick up Penn ID, meet roommates, and assemble high-priority elements.",
    assignedTo: "both",
    isMandatory: true
  },
  {
    id: "e5",
    title: "NSO President's Welcome Convocation",
    date: "2026-08-22",
    time: "7:00 PM EST",
    location: "Zellerbach Theatre / Annenberg Center",
    description: "Official University welcome for all freshman class students and secondary parent reception.",
    assignedTo: "both",
    isMandatory: true
  },
  {
    id: "e6",
    title: "Mandatory College Hall Prep Session",
    date: "2026-08-24",
    time: "1:30 PM EST",
    location: "Claire Fagin Hall (Auditorium)",
    description: "Important introductory advising and safety protocols.",
    assignedTo: "student",
    isMandatory: true
  },
  {
    id: "e7",
    title: "First Day of Penn Fall Semester Classes",
    date: "2026-08-27",
    time: "8:30 AM EST",
    location: "UPenn Campus Halls",
    description: "Academics officially start! Real adaptation begins.",
    assignedTo: "student",
    isMandatory: true
  }
];

export const initialJourneyMilestones: JourneyMilestone[] = [
  {
    id: "m1",
    title: "Accepted",
    status: "completed",
    description: "Admission offer received, enrollment deposit paid, PennKey account registered.",
    dateText: "Completed March 2026",
    actions: ["Activate PennKey", "Submit Class of 2030 Photos"],
    personalActions: ["Purchase UPenn freshman sweater", "Announce commitment on social media"]
  },
  {
    id: "m2",
    title: "Housing",
    status: "completed",
    description: "Quad housing assigned to Ware College House, roommate notified, health service forms submitted.",
    dateText: "Completed May 2026",
    actions: ["Agree on roommate rules", "Submit immunization forms"],
    personalActions: ["Order retro Eagles poster", "Purchase LED strip lights"]
  },
  {
    id: "m3",
    title: "Travel",
    status: "current",
    description: "Securing trains, flights, local hotel rooms for move-in week, and campus transit vouchers.",
    dateText: "June - July 2026",
    actions: ["Confirm Move-In Date", "Verify Arrival Window"],
    personalActions: ["Book Adrian's flight", "Download local SEPTA transit app", "Create Philadelphia favorites list"]
  },
  {
    id: "m4",
    title: "Packing",
    status: "upcoming",
    description: "Buying Twin XL bedding, laptops via Penn Connection, health kits, and preparing shipment boxes.",
    dateText: "July 2026",
    actions: ["Setup Penn dual-factor app", "Confirm Duo MFA setup"],
    personalActions: ["Order Twin XL foam & sheets", "Buy customized study desk lamp"]
  },
  {
    id: "m5",
    title: "Move-In",
    status: "upcoming",
    description: "Arriving at the Quad, unloading, picking up PennID at NSO Hospitality Booths, and setting up tech.",
    dateText: "August 21-23, 2026",
    actions: ["Key pickup at Ware House", "Collect official UPenn Student ID card"],
    personalActions: ["Coordinate move-in playlist", "Assemble study command center"]
  },
  {
    id: "m6",
    title: "Orientation",
    status: "upcoming",
    description: "Mandatory freshman assemblies at Zellerbach Theatre, faculty advising, and roommate icebreakers.",
    dateText: "August 21-26, 2026",
    actions: ["Attend Convocation ceremony", "Complete language assessment exams"],
    personalActions: ["Find nearby local specialty coffee spots", "Take photos at Locust Walk landmarks"]
  },
  {
    id: "m7",
    title: "First Week",
    status: "upcoming",
    description: "Locating lecture halls on campus, settling syllabus rules, finding study group resources.",
    dateText: "Late August 2026",
    actions: ["Confirm dining swipe counts", "Confirm lecture room buildings"],
    personalActions: ["Join freshmen pick-up soccer games", "Schedule check-in with Adrian"]
  },
  {
    id: "m8",
    title: "First Semester",
    status: "upcoming",
    description: "Navigating midterms, student group signups at Houston Hall, and settling into academic schedules.",
    dateText: "Sept - Dec 2026",
    actions: ["Meet with Whartonomics advisor", "Plan Thanksgiving visit"],
    personalActions: ["Join consulting/finance club advisory", "Organize winter coat delivery"]
  },
  {
    id: "m9",
    title: "Thriving",
    status: "upcoming",
    description: "Moving from reactive transition to pure independent flow, confidence, and campus leadership.",
    dateText: "Spring 2027 & Beyond",
    actions: ["Maintain active GPA check-ins", "Prepare spring housing selections"],
    personalActions: ["Explore undergraduate research sponsorships", "Nominate peers for campus committees"]
  }
];

export const discoverItems: DiscoverItem[] = [
  {
    id: "d1",
    category: "dining",
    title: "UPenn Dining Services & Plans",
    description: "First-year dining contracts, Dining Cents, and prime student swipe structures.",
    details: [
      "1920 Commons: Traditional buffet and central dining hall on Locust Walk. Excellent micro-bites and late-night grab-and-go options.",
      "Hill House Dining: Incredibly popular with first-years. Newly upgraded with open action-cook stations, vast salad bars, and custom allergen-free limits.",
      "Dining Cents: Tax-free, dollar-for-dollar balances built into meal plans used at on-campus coffee chains, gourmet cafes, and Houston Market.",
      "Falk Kosher Dining: Superb certified kosher dining and buffet selections at Steinhardt Hall on 39th Street.",
      "Guest Swipes: General first-year meal plans are packaged with 10 complimentary guest passes. Perfect for Adrian during move-in or family week events!"
    ],
    location: "Locust Walk & Hill House sectors",
    linkText: "View Interactive Menus"
  },
  {
    id: "d2",
    category: "housing",
    title: "First-Year Housing: The Quadrangle",
    description: "Logistics and living structures in Ware, Fisher-Hassenfeld, and Riepe College Houses.",
    details: [
      "Communal Layouts: Featuring traditional gothic architecture, high ceilings, hard-surface flooring, and solid twin XL bed heights.",
      "Basement Laundry: Mobile-app operated, water-saving washing facilities. Front-load HE soap solutions strongly advised.",
      "House Staff Teams: Every hall is monitored by a faculty Director, live-in Graduate Associates (GAs), and sophomore/junior Peer Advisors.",
      "Outlets & Safety: Historic Quad structures have sparse power points. Heavy-duty tri-wire surge protected strips are mandatory."
    ],
    location: "The Quad (Spruce Street Front)",
    linkText: "Read Quad Living Guidelines"
  },
  {
    id: "d3",
    category: "pennkey",
    title: "PennKey Registration & Security",
    description: "Activating your PennKey ID, accessing Canvas portals, and setting up multi-factor Duo authentication.",
    details: [
      "Activation Code: Freshman receive unique setup links via secure email to claims their official user ID and setup security questions.",
      "Duo Mobile 2FA: Every login to PennInTouch, PennPath, and Canvas requires confirmation on mobile device via DUO app push alerts.",
      "Authentication Sync: Keep Duo active on a modern backup number. If you change your phone, submit a direct support card to prevent lockouts.",
      "Troubleshooting Desk: On-campus technical desks are standing by during move-in inside the lobby of Van Pelt Library."
    ],
    location: "Van Pelt Library (Ground Level)",
    linkText: "Access PennKey Setup Tool"
  },
  {
    id: "d4",
    category: "pennpay",
    title: "PennPay Student Bills & Billing Setup",
    description: "Enrolling parents as authorized billing managers, direct deposits, and important semester billing schedules.",
    details: [
      "Authorized Payers: Security regulations mandate that Gabby must explicitly add Adrian's email in PennPay to unlock joint billing status.",
      "Direct Deposit: Link standard client-side bank checks for instantaneous transfer of refunds or university workspace student wages.",
      "Fall Bill Deadline: General freshman fall installment bills close in mid-July. Unresolved balances are assessed deferred service fees."
    ],
    location: "Franklin Building (3451 Walnut St)",
    linkText: "Authorize Parents on PennPay"
  },
  {
    id: "d5",
    category: "orientation",
    title: "New Student Orientation (NSO) 2026 Mandates",
    description: "Compulsory freshman welcoming ceremonies, peer workshops, and placement exams.",
    details: [
      "Mandatory Convocation: Official freshman welcome with the President at the massive Zellerbach Theatre on August 22 at 7:00 PM.",
      "Penn Reading Project: Class-wide book assigned for direct round-robin discussions with faculty partners in Ware College House.",
      "Assessment Deadlines: Standard placements in mathematics, chemistry, and foreign languages must close via Canvas before August courses start."
    ],
    location: "Campus-Wide / Annenberg Theatre",
    linkText: "View Complete NSO Schedule"
  },
  {
    id: "d6",
    category: "movein",
    title: "Move-In Logistics & Timeslots",
    description: "Coordinating move-in time selections, loading permits, and Quad parking maps.",
    details: [
      "Assigned Slot: August 21, 2026 beginning at 10:00 AM. Traffic surrounding Spruce is dense; tight compliance is demanded.",
      "Unloading Zone: 20-minute temporary parking passes will be issued to cars at Ware House gate checkpoints. Staff will assist unloading.",
      "PennID Verification: Active physical or virtual PennPass must be presented to bypass turnstiles and claim dorm key packets at help desks."
    ],
    location: "Ware College House Gate",
    linkText: "Download Move-In Pass"
  },
  {
    id: "d7",
    category: "health",
    title: "Health Services & Vaccine Forms",
    description: "Immunizations records uploads, SHS doctor locations, and PSIP medical insurance rules.",
    details: [
      "SHS Operations: Located at 3535 Market Street, offering complete medical support, emergency triage, and prescription coordination.",
      "Immunization Uploads: Doctor-signed vaccine files must be processed and verified on the Student Health Portal prior to move-in day.",
      "Insurance Waivers: PSIP is auto-billed. Submit details of personal health insurance plans online by August 1 to claim the waiving credit."
    ],
    location: "Student Health Service (3535 Market St)",
    linkText: "Submit SHS Health Forms"
  },
  {
    id: "d8",
    category: "penncard",
    title: "PennCard Student ID Processing",
    description: "Generating your physical Penn ID card, remote photo submits, and safe card uses.",
    details: [
      "Photo Upload Deadline: Upload high-resolution vertical headshots on Penn's Card Portal before July 10, 2026.",
      "Retrieval Hub: Unclaimed physical cards are available at Houston Hall NSO Hospitality Booths starting on August 21.",
      "Dorm Building Gates: Cards are embedded with wireless RFID. Tap entry gates at Ware House and dining doors for quick check-ins."
    ],
    location: "Houston Hall (Hospitality Booths)",
    linkText: "Upload PennCard Photo"
  },
  {
    id: "d9",
    category: "safety",
    title: "Campus Security & 24/7 Escorts",
    description: "Physical escort walking options, Blue Light intercom boxes, and guardian tracking apps.",
    details: [
      "Physical Walking Escorts: Call 215-898-WALK. A uniformed Penn Public Safety officer will walk Gabby to any location near campus 24/7.",
      "Blue Light Phones: Strategically located around block margins. Touch the speaker button to contact Penn Police dispatched directly.",
      "Penn Guardian App: Live GPS-sharing security software that triggers instant dispatcher location alerts during urgent calls."
    ],
    location: "Division of Public Safety (4040 Chestnut St)",
    linkText: "Download Penn Guardian App"
  },
  {
    id: "d10",
    category: "packages",
    title: "Packages & Quad Mailroom Layout",
    description: "Mailing address formats, Quad package rooms, and crucial pre-arrival shipping rules.",
    details: [
      "Mailing Address: Gabby, Room [Room No], Ware College House, 3700 Spruce Street, Philadelphia, PA 19104-6022.",
      "Quad Package Room: Centrally operated parcel room located in lower Quad level. Take the barcode pickup notification details and Penn ID.",
      "Pre-Arrival Windows: Mailroom is closed to pre-shipments prior to August 1, 2026 due to extreme storage space limitations."
    ],
    location: "Quad Package Room (Lower Quad Level)",
    linkText: "Review Shipping Regulations"
  },
  {
    id: "d11",
    category: "transportation",
    title: "Campus Transportation & Shuttles",
    description: "SEPTA regional rails, campus shuttle networks, and travel coordinates from Philadelphia Intl Airport.",
    details: [
      "Penn Transit Shuttle: Highly popular free door-to-door shuttle buses operating across campus boundaries after 6:00 PM.",
      "SEPTA Trolleys: Under-street routes intersecting Spruce with direct fast transit into Center City Philadelphia.",
      "Airport Access (PHL): Take the SEPTA Airport Line regional train from PHL terminals directly to Penn Medicine Station (Penn's edge)."
    ],
    location: "Penn Medicine Station / Spruce St margin",
    linkText: "View Interactive Transit Map"
  },
  {
    id: "d12",
    category: "resources",
    title: "Houston Hall Resources & Advisors",
    description: "Freshman support desks, career assistance, libraries, and central administrative advisors.",
    details: [
      "Weigle Information Commons (WIC): Situated in Van Pelt Library. High-intensity study booths, collaborative zones, and media gear.",
      "College House Deans: Professional academic advising teams located on the primary levels of Ware College House for course checks.",
      "VPUL Administrative Help: Guidance for mental wellness support, student group funding, extracurricular clubs, and safety."
    ],
    location: "Houston Hall Central (3417 Spruce St)",
    linkText: "Schedule Advising Appointment"
  },
  {
    id: "d13",
    category: "admissions",
    title: "Admissions & Accepted Student Tasks",
    description: "Final class transcripts submissions, high school graduation certifications, and initial profile completion.",
    details: [
      "Final High School Transcripts: Official final high school grades must be transmitted to Penn Admissions directly from registrar before July 1.",
      "Profile Completion: Log into the Penn admissions checklist portal to certify enrollment deposits and upload code-of-conduct paperwork.",
      "Family Portal Access: Sign Adrian up for the UPenn Parent Association newsletter to receive official schedules and safety newsletters."
    ],
    location: "Admissions Office (Claudia Cohen Hall)",
    linkText: "Penn Admissions Portal"
  }
];
