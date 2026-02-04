import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { MacroRings } from "@/components/dashboard/macro-rings";
import { TodaysMeals } from "@/components/dashboard/todays-meals";
import { PantryHealth } from "@/components/dashboard/pantry-health";
import { WaterTracker } from "@/components/dashboard/water-tracker";
import { ExpiringItems } from "@/components/dashboard/expiring-items";
import { MissingIngredients } from "@/components/dashboard/missing-ingredients";
import { WeeklyTrend } from "@/components/dashboard/weekly-trend";
import { CanCookNow } from "@/components/dashboard/can-cook-now";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <WelcomeCard />

      {/* Quick actions */}
      <QuickActions />

      {/* Nutrition + Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MacroRings />
        <TodaysMeals />
      </div>

      {/* Ready to Cook — full width for 3-card grid */}
      <CanCookNow />

      {/* Expiring + Missing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExpiringItems />
        <MissingIngredients />
      </div>

      {/* Health + Water + Weekly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <PantryHealth />
        <WaterTracker />
        <WeeklyTrend />
      </div>
    </div>
  );
}
