import React from 'react'
import BudgetForm from '@/components/ui/BudgetForm'
import PriceSummaryCard from '@/components/ui/PriceSummaryCard'

export default function CalculatorPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-xl mx-auto bg-primary-500">
        <PriceSummaryCard
            total={250000}
            indirectCosts={2000}
            profit={50000}
          />
        <BudgetForm />
      </div>
    </div>
  )
}
