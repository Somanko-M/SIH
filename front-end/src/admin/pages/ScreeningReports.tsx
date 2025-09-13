import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", screened: 120, flagged: 15 },
  { month: "Feb", screened: 150, flagged: 20 },
  { month: "Mar", screened: 180, flagged: 12 },
  { month: "Apr", screened: 140, flagged: 18 },
];

export default function ScreeningReports() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Screening Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="screened" fill="#3b82f6" />
              <Bar dataKey="flagged" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
