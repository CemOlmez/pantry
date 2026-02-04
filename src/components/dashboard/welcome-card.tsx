"use client";

import { Refrigerator, CalendarDays, BookOpen, ShoppingCart } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const stats = [
  { icon: Refrigerator, value: "23", label: "items", sublabel: "in pantry" },
  { icon: CalendarDays, value: "3", label: "meals", sublabel: "planned today" },
  { icon: BookOpen, value: "12", label: "recipes", sublabel: "saved" },
  { icon: ShoppingCart, value: "5", label: "items", sublabel: "to buy" },
];

export function WelcomeCard() {
  const greeting = getGreeting();
  const date = formatDate();

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Main gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #E8913A 0%, #D47E2A 40%, #C46E25 60%, #B5652A 100%)",
        }}
      />

      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 welcome-shimmer" />

      {/* Mesh / dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/[0.07]" />
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/[0.05]" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/[0.06]" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/[0.04]" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/[0.03]" />

      {/* Diagonal accent stripe */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "linear-gradient(120deg, transparent 30%, #fff 50%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left side - Greeting */}
          <div className="space-y-1.5">
            <p className="text-white/70 text-xs sm:text-sm font-medium tracking-wide uppercase">
              {date}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {greeting}
            </h1>
            <p className="text-white/60 text-sm sm:text-base font-medium">
              Here&apos;s your kitchen at a glance
            </p>
          </div>

          {/* Right side - Stat pills in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full md:w-auto md:min-w-[280px] lg:min-w-[320px]">
            {stats.map((stat) => (
              <div
                key={stat.sublabel}
                className="flex items-center gap-2.5 bg-white/[0.12] backdrop-blur-sm rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 transition-colors hover:bg-white/[0.18]"
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/[0.12]">
                  <stat.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white/90" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm sm:text-base leading-tight">
                    {stat.value}{" "}
                    <span className="font-semibold text-white/80">
                      {stat.label}
                    </span>
                  </p>
                  <p className="text-white/50 text-[10px] sm:text-xs leading-tight">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
