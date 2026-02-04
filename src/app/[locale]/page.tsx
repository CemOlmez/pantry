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
      {/* Welcome banner */}
      <WelcomeCard />

      {/* Quick actions */}
      <QuickActions />

      {/* Row 1: Nutrition + Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MacroRings />
        <TodaysMeals />
      </div>

      {/* Row 2: Pantry Health + Water */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PantryHealth />
        <WaterTracker />
      </div>

      {/* Row 3: Expiring + Missing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExpiringItems />
        <MissingIngredients />
      </div>

      {/* Row 4: Weekly Trend + Cook Now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyTrend />
        <CanCookNow />
      </div>
    </div>
  );
}
