import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Active Users" value="1,245" description="Students using the platform" />
          <StatCard title="Screenings Completed" value="312" description="Total assessments taken" />
          <StatCard title="Resources Added" value="58" description="Wellness articles & videos" />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
