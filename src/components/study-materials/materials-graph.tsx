"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface MaterialsGraphProps {
  data: { name: string; total: number }[];
}

export const MaterialsGraph: React.FC<MaterialsGraphProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <p className="text-sm text-muted-foreground">
          No materials in this folder.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Bar
          dataKey="total"
          style={
            {
              fill: "hsl(var(--foreground))",
              opacity: 0.9,
            } as React.CSSProperties
          }
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
