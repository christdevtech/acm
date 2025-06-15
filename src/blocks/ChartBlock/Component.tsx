'use client'

import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Sector } from 'recharts'
import { cn } from '@/utilities/ui'

import type { ChartBlock as ChartBlockProps } from '@/payload-types'

type Props = {
  className?: string
} & ChartBlockProps

interface ChartDataItem {
  label: string
  value: number
  color: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: ChartDataItem
  }>
  label?: string
}

interface LegendProps {
  payload?: Array<{
    value: string
    type: string
    color: string
    payload: ChartDataItem
  }>
}

interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

interface ActiveShapeProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: ChartDataItem
  percent: number
  value: number
  [key: string]: any
}

const RADIAN = Math.PI / 180

// Active shape renderer for hover effects
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        cornerRadius={10}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle + 3}
        endAngle={endAngle - 3}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        cornerRadius={10}
        fill={fill}
      />
    </g>
  )
}

// Static label renderer for all segments
const renderStaticLabel = (props: CustomLabelProps & { payload: ChartDataItem }) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <path
        d={`M${cx + outerRadius * cos},${cy + outerRadius * sin}L${mx},${my}L${ex},${ey}`}
        stroke={payload.color}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        className="dark:fill-white"
        fontSize={16}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#666"
        className="dark:fill-gray-300"
        fontSize={15}
      >
        {payload.label}
      </text>
    </g>
  )
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data?.payload.label}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{data?.value}%</span>
        </p>
      </div>
    )
  }
  return null
}

// Custom legend component
const CustomLegend = ({ payload }: LegendProps) => {
  return (
    <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-lg" style={{ backgroundColor: entry.color }} />
          <span className="text-base text-slate-900 dark:text-gray-300">
            <span className="font-semibold">{entry.payload.value}%</span> {entry.payload.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export const ChartBlock: React.FC<Props> = (props) => {
  const {
    className,
    title,
    subtitle,
    chartType = 'donut',
    chartData,
    showLegend = true,
    showPercentages = true,
  } = props

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className={cn('container my-16', className)}>
        <div className="text-center py-8">
          <p className="text-gray-500">No chart data available</p>
        </div>
      </div>
    )
  }

  // Transform the data for recharts
  const transformedData = chartData.map((item: ChartDataItem) => ({
    label: item.label,
    value: item.value,
    color: item.color,
  }))

  return (
    <div className={cn('container my-16', className)}>
      <div className="bg-card dark:bg-gray-800 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left Side - Header and Legend */}
          <div className="flex-1 lg:max-w-md text-center lg:text-left">
            {title && (
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{subtitle}</p>
            )}
            {showLegend && (
              <div className="mt-6">
                <CustomLegend
                  payload={transformedData.map((item, index) => ({
                    value: item.label,
                    type: 'rect',
                    color: item.color,
                    payload: item,
                  }))}
                />
              </div>
            )}
          </div>

          {/* Right Side - Chart Container */}
          <div className="flex-1 w-full lg:w-[60%] overflow-visible">
            <div className="w-full h-[500px] overflow-visible">
              <ResponsiveContainer style={{ overflow: 'visible' }} width="100%" height="100%">
                <PieChart
                  className="overflow-visible"
                  style={{ maxWidth: 'none', overflow: 'visible' }}
                >
                  <Pie
                    className="overflow-visible"
                    style={{ overflow: 'visible', maxWidth: 'none' }}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={transformedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={showPercentages ? renderStaticLabel : false}
                    outerRadius={120}
                    innerRadius={chartType === 'donut' ? 70 : 0}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                    onMouseEnter={onPieEnter}
                    paddingAngle={5}
                    cornerRadius={10}
                  >
                    {transformedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* <Tooltip content={<CustomTooltip />} /> */}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
