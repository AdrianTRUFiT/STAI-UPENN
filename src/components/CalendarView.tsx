import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Bell, 
  ArrowRight,
  Info,
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles
} from "lucide-react";

interface CalendarViewProps {
  calendarEvents: any[];
  tasks: any[];
  familyPlanningItems: any[];
  expenses: any[];
  travelItems: any[];
  setActiveTab: (tab: string) => void;
}

export default function CalendarView({
  calendarEvents,
  tasks,
  familyPlanningItems,
  expenses,
  travelItems,
  setActiveTab
}: CalendarViewProps) {
  // Current active month in view: "june" | "july" | "august"
  const [activeMonth, setActiveMonth] = useState<"june" | "july" | "august">("june");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Month configurations
  const monthsData = {
    june: {
      name: "June 2026",
      startDayOfWeek: 1, // Monday
      daysInMonth: 30,
      prevMonthDays: 31, // May has 31
    },
    july: {
      name: "July 2026",
      startDayOfWeek: 3, // Wednesday
      daysInMonth: 31,
      prevMonthDays: 30, // June has 30
    },
    august: {
      name: "August 2026",
      startDayOfWeek: 6, // Saturday
      daysInMonth: 31,
      prevMonthDays: 31, // July has 31
    }
  };

  const getMonthNum = (m: "june" | "july" | "august") => {
    if (m === "june") return 5; // 0-indexed month (June is 5)
    if (m === "july") return 6;
    return 7;
  };

  // Compile all events, tasks, expenses, family items, travel into a single visual ledger
  const compileEventsForDate = (day: number, month: "june" | "july" | "august") => {
    const list: any[] = [];
    const dateStr = `2026-0${getMonthNum(month) + 1}-${day.toString().padStart(2, "0")}`;

    // 1. Unified Calendar Events (timeline events)
    calendarEvents.forEach(evt => {
      if (evt.date === dateStr) {
        list.push({
          id: `calendar-${evt.id || evt.title}`,
          title: evt.title,
          type: "timeline",
          category: "Timeline Event",
          urgency: evt.isMandatory ? "high" : "low",
          time: evt.time || "All Day",
          description: evt.description,
          detail: `Location: ${evt.location || "Online"}`,
          tab: "journey",
          color: "bg-blue-50 text-[#011F5B] border-blue-200"
        });
      }
    });

    // 2. Tasks with dates
    tasks.forEach(task => {
      if (task.dueDate === dateStr) {
        list.push({
          id: `task-${task.id}`,
          title: task.title,
          type: "task",
          category: `${task.category.toUpperCase()} CHECK`,
          urgency: !task.completed ? "high" : "low",
          time: "Due Today",
          description: `Required Transition Task. Assigned to ${task.owner.toUpperCase()}.`,
          detail: task.completed ? "✓ Completed" : "⚠ Pending submittal",
          tab: "ready", // or plan
          color: task.completed ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-900 border-amber-200"
        });
      }
    });

    // 3. Family Planning Items
    familyPlanningItems.forEach(fp => {
      if (fp.dueDate === dateStr) {
        list.push({
          id: `fp-${fp.id}`,
          title: fp.title,
          type: "family_action",
          category: `COORDINATOR ACTION`,
          urgency: fp.status === "pending" ? "high" : "low",
          time: "Target Date",
          description: fp.notes || "Action coordinator planning item.",
          detail: `Status: ${fp.status.replace("_", " ")} | Assigned to ${fp.assignedTo}`,
          tab: "ready",
          color: "bg-purple-50 text-purple-850 border-purple-200"
        });
      }
    });

    // 4. Planned Expenses
    expenses.forEach(exp => {
      if (exp.date === dateStr) {
        list.push({
          id: `expense-${exp.id}`,
          title: `Penn Expense: ${exp.name}`,
          type: "expense",
          category: "FINANCES LEDGER",
          urgency: exp.status === "planned" ? "high" : "low",
          time: `$${exp.amount}`,
          description: `Cost Allocation. Paid by ${exp.paidBy}.`,
          detail: exp.notes || "Allocated for student transition.",
          tab: "finances",
          color: "bg-[#990000]/5 text-[#990000] border-red-200"
        });
      }
    });

    // 5. Travel Deadlines
    travelItems.forEach(tr => {
      if (tr.deadlineDate === dateStr) {
        list.push({
          id: `travel-${tr.id}`,
          title: `Travel: ${tr.title}`,
          type: "travel",
          category: "TRAVEL HUB",
          urgency: tr.status !== "booked" ? "high" : "low",
          time: "Departure/Booking",
          description: `Segment Status: ${tr.status.toUpperCase()}.`,
          detail: `${tr.startLocation} ➔ ${tr.endLocation} | Est: $${tr.estimatedCost}`,
          tab: "travel",
          color: "bg-amber-50 text-amber-900 border-amber-200"
        });
      }
    });

    // 6. Hardcoded requested examples to ensure they display exactly as the user specified:
    // "June 24-30: PennPay Due, July 5: Travel Planning Begins, July 15: Packing Window Opens, July 25: Final Travel Review, Aug 20: Move-In, Aug 21: NSO Begins, Aug 24: Classes Begin"
    if (month === "june" && day >= 24 && day <= 30) {
      if (day === 24) {
        list.push({
          id: "manual-june-pay",
          title: "PennPay Authorized Payer Due Date Window Opens",
          type: "milestone",
          category: "FINANCIAL MILESTONE",
          urgency: "high",
          time: "Critical Period",
          description: "Initialize PennPay accounts. Add parents as authorized payers to avoid late processing blocks.",
          detail: "June 24 to June 30 Window",
          tab: "finances",
          color: "bg-[#990000]/10 text-[#990000] border-red-200 font-bold"
        });
      }
    }
    if (month === "july" && day === 5) {
      if (!list.some(x => x.title.includes("Travel Planning Begins"))) {
        list.push({
          id: "manual-july-travel",
          title: "Travel Planning Coordination Begins",
          type: "milestone",
          category: "TRAVEL INITIATIVE",
          urgency: "low",
          time: "Planning Trigger",
          description: "Initialize bookings for ORD to PHL flights or Amtrak reservations.",
          detail: "Locks travel coordinates and Sheraton hotel room near campus.",
          tab: "travel",
          color: "bg-blue-50 text-[#011F5B] border-blue-200"
        });
      }
    }
    if (month === "july" && day === 15) {
      if (!list.some(x => x.title.includes("Packing Window Opens"))) {
        list.push({
          id: "manual-july-packing",
          title: "Dorm Packing Window Opens",
          type: "milestone",
          category: "LOGISTICS MILESTONE",
          urgency: "low",
          time: "Packing Window",
          description: "Finalize checklist of items to buy or bring. Coordinate micro-refrigerator and carpets with Ware roommate.",
          detail: "Refer to READY center packing hub",
          tab: "ready", // or housing
          color: "bg-teal-50 text-teal-900 border-teal-200"
        });
      }
    }
    if (month === "july" && day === 25) {
      if (!list.some(x => x.title.includes("Final Travel Review"))) {
        list.push({
          id: "manual-july-review",
          title: "Final Coordination Travel & Baggage Review",
          type: "milestone",
          category: "TRAVEL HEALTH CHECK",
          urgency: "high",
          time: "Review Deadline",
          description: "Audit baggage limits, confirm ticket codes AA-99824X, and align shuttle logistics.",
          detail: "Double check baggage size limits for moving packages",
          tab: "travel",
          color: "bg-rose-50 text-red-700 border-rose-200"
        });
      }
    }
    if (month === "august" && day === 20) {
      list.push({
        id: "manual-august-movein",
        title: "Campus Move-In Unpacking Window Begins",
        type: "milestone",
        category: "CAMPUS ARRIVAL",
        urgency: "high",
        time: "Arrival Window",
        description: "Official campus access. Pick up Penn Identity cards and room keys at Ware entrance.",
        detail: "August 20-21 Move-In Timeslots",
        tab: "journey",
        color: "bg-green-50 text-green-900 border-green-200 font-black"
      });
    }
    if (month === "august" && day === 21) {
      if (!list.some(x => x.title.includes("NSO Begins"))) {
        list.push({
          id: "manual-august-nso",
          title: "New Student Orientation (NSO) Official Start",
          type: "milestone",
          category: "ACADEMIC ORIENTATION",
          urgency: "high",
          time: "NSO Kickoff",
          description: "Introduction sessions, President's welcoming reception, and student bonding seminars.",
          detail: "Mandatory freshman participation required",
          tab: "journey",
          color: "bg-[#011F5B] text-white border-blue-800"
        });
      }
    }
    if (month === "august" && day === 24) {
      list.push({
        id: "manual-august-classes",
        title: "Mandatory College Assemblies & Warm-Up Sessions",
        type: "milestone",
        category: "ACADEMIC WELCOME",
        urgency: "high",
        time: "Academic Session",
        description: "College Hall gatherings, final academic advising checks, and campus introductions.",
        detail: "Prerequisite to primary classes start",
        tab: "journey",
        color: "bg-blue-550 text-white border-blue-600 font-bold"
      });
    }

    return list;
  };

  const getMonthDetails = (month: "june" | "july" | "august") => {
    return monthsData[month];
  };

  const currentMonthData = getMonthDetails(activeMonth);

  // Generate date cells
  const dateCells: any[] = [];
  
  // Fill previous month padding cells
  for (let i = currentMonthData.startDayOfWeek - 1; i >= 0; i--) {
    dateCells.push({
      dayNum: currentMonthData.prevMonthDays - i,
      dayType: "prev",
      events: []
    });
  }

  // Fill current month cells
  for (let i = 1; i <= currentMonthData.daysInMonth; i++) {
    const dayEvents = compileEventsForDate(i, activeMonth);
    dateCells.push({
      dayNum: i,
      dayType: "current",
      events: dayEvents,
      hasHighAlert: dayEvents.some(e => e.urgency === "high")
    });
  }

  // Fill next month padding cells to complete full week rows
  const totalCellsSoFar = dateCells.length;
  const cellsNeeded = Math.ceil(totalCellsSoFar / 7) * 7;
  const paddingNextDays = cellsNeeded - totalCellsSoFar;
  for (let i = 1; i <= paddingNextDays; i++) {
    dateCells.push({
      dayNum: i,
      dayType: "next",
      events: []
    });
  }

  // Flat list of all current month active events for the side list
  const allMonthEvents: any[] = [];
  for (let d = 1; d <= currentMonthData.daysInMonth; d++) {
    const dayEvts = compileEventsForDate(d, activeMonth);
    if (dayEvts.length > 0) {
      allMonthEvents.push({
        day: d,
        events: dayEvts
      });
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (activeMonth === "august") setActiveMonth("july");
      else if (activeMonth === "july") setActiveMonth("june");
    } else {
      if (activeMonth === "june") setActiveMonth("july");
      else if (activeMonth === "july") setActiveMonth("august");
    }
    setSelectedDay(null);
  };

  // Selected events display logic
  const selectedDayEvents = selectedDay ? compileEventsForDate(selectedDay, activeMonth) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-[#1D1D1F]">
      
      {/* Title & Explainer Banner with UPenn colors */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-3xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#011F5B] rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
              <CalendarIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#011F5B] text-lg tracking-tight">STAI Unified Transition Calendar</h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Live chronological cross-view of checklists, bills, travel coordinates, and freshman milestones.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-205 flex items-center gap-2 max-w-sm">
            <span className="text-amber-500 text-lg">💡</span>
            <p className="leading-tight font-medium font-sans">
              <strong>Same underlying records:</strong> Changes you make to timeline milestones, tasks, and travel deadlines update the calendar immediately!
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-550 pt-1.5 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#990000]/10 border border-[#990000] inline-block" />
            <span>Finances / PennPay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-50 border border-blue-250 inline-block" />
            <span>Academic Milestones</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-50 border border-emerald-250 inline-block" />
            <span>Tasks Checklist</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-100 border border-purple-250 inline-block" />
            <span>Family Planning Coordinator</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-50 border border-amber-250 inline-block" />
            <span>Travel Logistics</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-650 animate-ping inline-block" />
            <span className="text-red-700 font-extrabold text-[10px] uppercase">Immediate Action Day</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: THE GRID CALENDAR (8cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex flex-col h-full min-h-[520px]">
            
            {/* Calendar Controls */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <button 
                onClick={() => navigateMonth("prev")}
                disabled={activeMonth === "june"}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-35 disabled:hover:bg-white cursor-pointer transition"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-[#011F5B] font-sans tracking-tight">
                  {monthsData[activeMonth].name}
                </span>
                <span className="text-[10px] bg-slate-100 border border-slate-205 py-0.5 px-2 rounded-full font-bold text-slate-500 font-mono">
                  ACTIVE FRAME
                </span>
              </div>

              <button 
                onClick={() => navigateMonth("next")}
                disabled={activeMonth === "august"}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-35 disabled:hover:bg-white cursor-pointer transition"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Sunday-Saturday Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1.5 flex-1 select-none">
              {dateCells.map((cell, idx) => {
                const isCurrentMonth = cell.dayType === "current";
                const isDaySelected = isCurrentMonth && selectedDay === cell.dayNum;
                const hasEvents = cell.events && cell.events.length > 0;
                
                // Urgent alert pulsing border
                const ringClass = cell.hasHighAlert 
                  ? "ring-2 ring-red-400 ring-offset-1 ring-offset-white" 
                  : "";

                return (
                  <div
                    key={`${activeMonth}-cell-${idx}`}
                    onClick={() => {
                      if (isCurrentMonth) {
                        setSelectedDay(cell.dayNum);
                      }
                    }}
                    className={`min-h-[64px] rounded-xl p-1.5 border relative flex flex-col justify-between transition cursor-pointer ${
                      !isCurrentMonth 
                        ? "bg-slate-50/40 border-slate-100 text-slate-300 pointer-events-none" 
                        : isDaySelected
                          ? "bg-[#011F5B]/5 border-[#011F5B] ring-2 ring-[#011F5B]/30"
                          : "bg-white border-gray-150 hover:bg-slate-50/60"
                    } ${ringClass}`}
                  >
                    {/* Date label */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-black ${
                        !isCurrentMonth 
                          ? "text-slate-300" 
                          : isDaySelected 
                            ? "text-[#011F5B]" 
                            : "text-gray-800"
                      }`}>
                        {cell.dayNum}
                      </span>
                      {/* Active indicator dot */}
                      {hasEvents && (
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          cell.hasHighAlert ? "bg-red-650 animate-ping" : "bg-blue-600"
                        }`} />
                      )}
                    </div>

                    {/* Compact layout events representation */}
                    <div className="mt-1 space-y-0.5 flex-1 flex flex-col justify-end overflow-hidden max-h-[46px]">
                      {isCurrentMonth && cell.events.slice(0, 2).map((ev: any, evIdx: number) => {
                        const isHigh = ev.urgency === "high";
                        return (
                          <div 
                            key={ev.id}
                            className={`text-[8px] px-1 py-0.5 rounded-sm font-bold truncate ${
                              isHigh 
                                ? "bg-red-50 text-red-700 border border-red-100" 
                                : "bg-slate-100 text-slate-700 border border-slate-150"
                            }`}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                      {isCurrentMonth && cell.events.length > 2 && (
                        <div className="text-[7px] text-gray-400 font-extrabold text-right select-none">
                          +{cell.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Hint */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-500 font-medium">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Click on any highlighted day in the grid above to load and explore real-time coordinate details.</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: EVENTS AND DRILLDOWN (4cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* DAY DETAILS CARD */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs">
            <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
              <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                {selectedDay 
                  ? `Details: Day ${selectedDay}` 
                  : `${monthsData[activeMonth].name} Schedule`
                }
              </h4>
              <span className="text-[9px] bg-[#011F5B]/15 text-[#011F5B] px-2 py-0.5 rounded-full font-bold">
                {selectedDay ? `DATE: 2026-0${getMonthNum(activeMonth) + 1}-${selectedDay}` : "ALL DAYS LIST"}
              </span>
            </div>

            {selectedDay ? (
              <div className="space-y-4">
                {selectedDayEvents.length === 0 ? (
                  <div className="p-8 text-center text-slate-400/85 text-xs italic">
                    <p className="mb-2">No synchronized milestones on this day.</p>
                    <button 
                      onClick={() => setSelectedDay(null)}
                      className="text-[#011F5B] hover:underline font-bold text-[10px]"
                    >
                      Show Month Summary List
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-[10px] text-[#011F5B] font-bold">
                      {selectedDayEvents.length} transition element{selectedDayEvents.length > 1 ? "s" : ""} active:
                    </div>
                    {selectedDayEvents.map((evt) => (
                      <div 
                        key={evt.id}
                        className={`p-3.5 border rounded-xl flex flex-col gap-2 relative shadow-3xs ${evt.color}`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-black/5">
                            {evt.category}
                          </span>
                          <span className="text-[9px] font-mono font-bold tracking-tight">
                            {evt.time}
                          </span>
                        </div>
                        
                        <div>
                          <h5 className="font-bold text-xs leading-snug">{evt.title}</h5>
                          <p className="text-[11px] opacity-90 mt-1 leading-normal font-sans font-medium">{evt.description}</p>
                          <p className="text-[10px] opacity-75 mt-1 font-mono italic">{evt.detail}</p>
                        </div>

                        <div className="pt-2 border-t border-black/5 mt-0.5 flex justify-end">
                          <button
                            onClick={() => {
                              setActiveTab(evt.tab);
                            }}
                            className="text-[10px] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            Jump to {evt.tab.toUpperCase()} Hub <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // MONTHLY DOCK CHRONOLOGY LIST
              <div className="space-y-4">
                <div className="text-[11px] text-gray-500 font-bold">
                  Chronological schedule of key dates:
                </div>

                <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                  {allMonthEvents.map((dayGroup) => (
                    <div key={`month-group-${dayGroup.day}`} className="border-l-2 border-slate-200 pl-3.5 py-0.5">
                      <div className="text-xs font-black text-gray-900 mb-1.5 flex items-center justify-between">
                        <span>Day {dayGroup.day}</span>
                        <span className="text-[9px] text-gray-400 font-mono font-bold">2026-00-{dayGroup.day}</span>
                      </div>
                      <div className="space-y-2">
                        {dayGroup.events.map((evt: any) => (
                          <div 
                            key={evt.id}
                            onClick={() => setSelectedDay(dayGroup.day)}
                            className="group p-2.5 bg-slate-50 hover:bg-slate-100 border border-gray-150 rounded-lg cursor-pointer transition flex flex-col gap-1"
                          >
                            <div className="flex justify-between items-center text-[8px] font-extrabold text-gray-400">
                              <span>{evt.category}</span>
                              <span className="text-slate-500">{evt.time}</span>
                            </div>
                            <h6 className="font-bold text-[11px] text-slate-800 leading-tight group-hover:text-[#011F5B] transition">
                              {evt.title}
                            </h6>
                            {evt.urgency === "high" && (
                              <span className="text-[8px] text-red-650 bg-rose-50 border border-rose-100 font-bold w-fit px-1 rounded-sm mt-0.5">
                                ⚠ High alert
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {allMonthEvents.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs italic">
                      No events mapped for this month view.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC METRIC INSIGHT */}
          <div className="bg-[#011F5B]/5 border border-blue-105 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#011F5B] animate-pulse" />
              <span className="text-xs font-extrabold text-[#011F5B] uppercase tracking-wider font-sans">
                Adaptive STAI Radar Link
              </span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-sans font-medium">
              The calendar works dynamically as an instant scheduler. As you proceed with packing tasks, travel booking logs, and tuition deadlines, items sync smoothly to maintain high student compliance.
            </p>
            <div className="mt-1">
              <button 
                onClick={() => {
                  setActiveTab("journey");
                }}
                className="w-full py-2 bg-[#011F5B] hover:bg-[#001743] shadow-3xs text-white rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Navigate to Timeline View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
