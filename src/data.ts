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
    title: "Penn Dining Services",
    description: "Understanding your dining plans, Dining Cents, and local swipe locations.",
    details: [
      "1920 Commons: Main dining hall located on Locust Walk, offers buffet and retail options.",
      "Hill House Dining: Newly renovated first-year dining hall with an open kitchen, salad bar, and allergen-free island.",
      "Dining Cents ($): Tax-free funds included in meal plans used for purchasing continuous items in campus cafes or retail stores.",
      "Falk Kosher Dining: High-quality kosher meals available at Steinhardt Hall.",
      "Guest Swipes: All first-year plans include 10 guest swipes per semester to share with visiting parents or friends."
    ],
    linkText: "View Dining Menus"
  },
  {
    id: "d2",
    category: "housing",
    title: "First-Year Housing: The Quadrangle",
    description: "Home of first-year community. Formed of Ware, Fisher-Hassenfeld, and Riepe College Houses.",
    details: [
      "Address format: [Student Name], [Room Number], Ware College House, 3700 Spruce Street, Philadelphia, PA 19104-6022.",
      "Package Delivery: All deliveries (UPS, FedEx, USPS, Amazon) are routed to the Quad Package Room in the lower Quad.",
      "Laundry: Card/mobile-phone activated laundry facilities located in the basement of each house sector. High-efficiency detergent only.",
      "Dorm Layout: Rooms feature high ceilings, traditional hardwood style composite flooring, and twin XL bed frames."
    ],
    location: "370 Spruce St"
  },
  {
    id: "d3",
    category: "resources",
    title: "First-Year Resource Hub (Houston Hall)",
    description: "The historical heart of campus activities and centralized freshers help.",
    details: [
      "NSO Hospitality Booths: Located in Houston Hall lobby during move-in week to retrieve student student IDs, welcome kits, and local transit vouchers.",
      "Student Health Service (SHS): Primary medical care center for all Penn students, located at 3535 Market Street.",
      "VPUL (Vice Provost for University Life): Guidance for personal counseling, safety, and multicultural communities.",
      "Weigle Information Commons (WIC): Located in Van Pelt Library, offers media booths, study rooms, and technical support workshops."
    ],
    location: "Houston Hall (3417 Spruce St)",
    linkText: "Explore Campus Resources"
  },
  {
    id: "d4",
    category: "safety",
    title: "Penn Transit & Emergency Services",
    description: "Essential transportation options and 24/7 campus safety contacts designed to bring peace of mind.",
    details: [
      "Penn Walking Escort: Call 215-898-WALK for a physical safety escort on or near campus 24/7.",
      "Penn Transit Shuttle: Free shuttle bus service operating after 6:00 PM for all students with valid PennID.",
      "Blue Light Phones: Located throughout campus margins. Pick up to speak directly to Penn Police dispatch.",
      "Penn Guardian Mobile App: Fast one-touch direct connection to Penn comms dispatcher with GPS-sharing active."
    ],
    location: "Emergency services: 215-573-3333 (or 511 from campus phones)"
  }
];
