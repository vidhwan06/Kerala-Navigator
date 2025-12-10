import { TripDashboard } from '@/components/dashboard/TripDashboard';
import { PageHeader } from '@/components/shared/PageHeader';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Optional: We could add a PageHeader here, but the Dashboard has its own Welcome Header */}
            <TripDashboard />
        </div>
    );
}
