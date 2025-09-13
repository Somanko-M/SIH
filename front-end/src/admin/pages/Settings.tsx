import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="alerts">Enable Email Alerts</Label>
            <Switch id="alerts" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoReports">Auto-generate Reports</Label>
            <Switch id="autoReports" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
