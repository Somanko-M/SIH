import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const resources = [
  { id: 1, title: "Stress Management Guide", type: "PDF", downloads: 320 },
  { id: 2, title: "Meditation Audio", type: "MP3", downloads: 210 },
  { id: 3, title: "Time Management Video", type: "MP4", downloads: 415 },
];

export default function ResourceManager() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Downloads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.downloads}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
