"use client"

import { ResponsiveBar } from "@nivo/bar"
import { Category, Transaction } from "@/types/money"
import type { BarDatum } from "@nivo/bar"
import { getChartData } from "@/lib/finance"

interface ChartsProps {
  transactions: Transaction[]
  categories: Category[]
}

export default function Charts({ transactions, categories }: ChartsProps) {
  const chartData = getChartData(transactions, categories).map(data => ({
    ...data,
    // Add index signature to satisfy BarDatum type
    [data.name]: data.name,
  })) as unknown as BarDatum[]

  return (
    <div className="h-[300px] md:h-[400px] bg-secondary p-4 md:p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
      <ResponsiveBar
        data={chartData}
        keys={["income", "expense"]}
        indexBy="name"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        colors={["#10B981", "#EF4444"]}
        borderRadius={4}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
          },
        ]}
      />
    </div>
  )
}
