import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const StatCard = ({ title, value, description }: StatCardProps) => {
  return (
    <Card className="shadow-md rounded-2xl">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
        {description && <p className="text-gray-500">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;
