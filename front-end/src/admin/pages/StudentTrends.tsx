import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const trends = [
  { month: "Jan", stress: 60, anxiety: 40 },
  { month: "Feb", stress: 55, anxiety: 42 },
  { month: "Mar", stress: 70, anxiety: 50 },
  { month: "Apr", stress: 65, anxiety: 48 },
];

export default function StudentTrends() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Wellbeing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="stress" stroke="#f59e0b" />
              <Line type="monotone" dataKey="anxiety" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
