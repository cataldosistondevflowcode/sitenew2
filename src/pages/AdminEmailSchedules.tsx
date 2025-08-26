import { EmailScheduleManager } from '@/components/admin/EmailScheduleManager';

export default function AdminEmailSchedules() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <EmailScheduleManager />
      </div>
    </div>
  );
}
