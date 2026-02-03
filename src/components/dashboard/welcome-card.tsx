"use client";


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

export function WelcomeCard() {
  const greeting = getGreeting();
  const date = formatDate();

  return (
    <div className="relative rounded-2xl overflow-hidden p-6"
      style={{
        background: "linear-gradient(135deg, #E8913A 0%, #D47E2A 50%, #B5652A 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/8" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative z-10">
        <p className="text-white/60 text-xs font-medium">{date}</p>
        <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
          {greeting}
        </h1>
        <p className="text-white/60 text-xs mt-0.5">
          Here&apos;s your kitchen at a glance
        </p>

      </div>
    </div>
  );
}
