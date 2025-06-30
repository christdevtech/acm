import React from 'react'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Props = {
  project: RequiredDataFromCollectionSlug<'projects'>
}

export const FundingCard: React.FC<Props> = ({ project }) => {
  const { targetAmount, totalDonated } = project

  // Calculate progress percentage
  const progressPercentage =
    targetAmount && totalDonated ? Math.min((totalDonated / targetAmount) * 100, 100) : 0

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
      <div className="space-y-4">
        {/* Goal and raised amounts */}
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {totalDonated ? formatCurrency(totalDonated) : 'FCFA 0'}
          </div>
          <div className="text-sm text-gray-600">
            raised of {targetAmount ? formatCurrency(targetAmount) : 'goal not set'}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Progress percentage */}
        <div className="text-center text-sm text-gray-600">
          {progressPercentage.toFixed(1)}% funded
        </div>

        {/* Donate button */}
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          Donate Now
        </button>
      </div>
    </div>
  )
}