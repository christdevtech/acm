'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X, Heart } from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/payload-types'
import { Logo } from '../Logo/Logo'
// Background image will be referenced directly in the Image component

interface DonationModalProps {
  children: React.ReactNode
  preselectedProject?: string
}

interface DonationFormData {
  projectId?: string
  amount: string
  customAmount: string
  frequency: 'one-time' | 'monthly'
  paymentMethod: 'fapshi' | 'skrill'
}

interface PaymentFormData {
  email: string
  phone?: string
  fullName: string
}

export const DonationModal: React.FC<DonationModalProps> = ({ children, preselectedProject }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const [donationData, setDonationData] = useState<DonationFormData>({
    projectId: preselectedProject || '',
    amount: '1000',
    customAmount: '',
    frequency: 'one-time',
    paymentMethod: 'fapshi',
  })

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    email: '',
    phone: '',
    fullName: '',
  })

  const getPaymentName = (method: string) => {
    switch (method) {
      case 'fapshi':
        return 'MTN / Orange Mobile Money'
      case 'skrill':
        return 'Skrill'
      default:
        return 'Direct Transfer'
    }
  }

  // Fetch active projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          '/api/projects?where[status][in]=active,in_progress,planning&limit=100',
        )
        const data = await response.json()
        setProjects(data.docs || [])
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }

    if (isOpen) {
      fetchProjects()
    }
  }, [isOpen])

  const predefinedAmounts = [
    { label: '1000 XAF', value: '1000' },
    { label: '5000 XAF', value: '5000' },
    { label: '10000 XAF', value: '10000' },
    { label: '25000 XAF', value: '25000' },
  ]

  const handleAmountChange = (value: string) => {
    setDonationData((prev) => ({
      ...prev,
      amount: value,
      customAmount: value === 'custom' ? prev.customAmount : '',
    }))
  }

  const handleCustomAmountChange = (value: string) => {
    setDonationData((prev) => ({
      ...prev,
      customAmount: value,
      amount: 'custom',
    }))
  }

  const getSelectedAmount = () => {
    return donationData.amount === 'custom' ? donationData.customAmount : donationData.amount
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      const amount = getSelectedAmount()
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid donation amount')
        return
      }
      setCurrentStep(2)
    }
  }

  const handleBackStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Here you would integrate with Fapshi or Skrill payment processing
      const amount = getSelectedAmount()
      const paymentPayload = {
        ...donationData,
        ...paymentData,
        amount: parseFloat(amount),
      }

      console.log('Processing payment:', paymentPayload)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert('Payment processed successfully!')
      setIsOpen(false)
      setCurrentStep(1)
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setCurrentStep(1)
    setDonationData({
      projectId: preselectedProject || '',
      amount: '1000',
      customAmount: '',
      frequency: 'one-time',
      paymentMethod: 'fapshi',
    })
    setPaymentData({
      email: '',
      phone: '',
      fullName: '',
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          resetModal()
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          {/* Left Column - Image (hidden on mobile) */}
          <div className="hidden md:flex relative bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center p-8">
            <div className="absolute inset-0 bg-black/20">
              <Image src="/assets/donate.png" alt="Hero Image" fill className="object-cover" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center leading-loose">
                We Can
                <br />
                Save The
                <br />
                Future
              </h2>
            </div>
          </div>

          {/* Right Column - Form Content */}
          <div className="p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-start">
                <Logo />
                <div>
                  <p className="text-sm text-foreground">
                    Africa Change Makers: Bringing People Together to Create Lasting Change
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Donation Form */}
            {currentStep === 1 && (
              <div className="flex-1 space-y-6">
                <h4 className="text-xl font-semibold text-foreground mb-4">
                  Choose a donation type
                </h4>

                {/* Project Selection */}
                <div className="space-y-2">
                  <Label htmlFor="project">Donation project or cause (optional)</Label>
                  <select
                    id="project"
                    value={donationData.projectId}
                    onChange={(e) =>
                      setDonationData((prev) => ({ ...prev, projectId: e.target.value }))
                    }
                    className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a project (optional)</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label>Choose a donation amount</Label>
                  <RadioGroup
                    value={donationData.amount}
                    onValueChange={handleAmountChange}
                    className="gap-4 grid grid-cols-2 lg:grid-cols-3"
                  >
                    {predefinedAmounts.map((amount) => (
                      <div key={amount.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={amount.value} id={amount.value} />
                        <Label htmlFor={amount.value} className="cursor-pointer">
                          {amount.label}
                        </Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2 lg:col-span-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="cursor-pointer">
                        Custom amount
                      </Label>
                    </div>
                  </RadioGroup>

                  {donationData.amount === 'custom' && (
                    <Input
                      type="number"
                      placeholder="Enter custom amount in XAF"
                      value={donationData.customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Frequency Selection */}
                <div className="space-y-3">
                  <Label>Choose a donation frequency</Label>
                  <RadioGroup
                    value={donationData.frequency}
                    onValueChange={(value: 'one-time' | 'monthly') =>
                      setDonationData((prev) => ({ ...prev, frequency: value }))
                    }
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="cursor-pointer">
                        Monthly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="cursor-pointer">
                        One time
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={donationData.paymentMethod}
                    onValueChange={(value: 'fapshi' | 'skrill') =>
                      setDonationData((prev) => ({ ...prev, paymentMethod: value }))
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fapshi" id="fapshi" />
                      <Label htmlFor="fapshi" className="cursor-pointer">
                        Fapshi (MTN & Orange Money)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="skrill" id="skrill" />
                      <Label htmlFor="skrill" className="cursor-pointer">
                        Skrill
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Go to checkout
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Form */}
            {currentStep === 2 && (
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold text-foreground">Payment Details</h4>
                  <div className="text-sm text-muted-foreground">
                    Amount: {getSelectedAmount()} XAF ({donationData.frequency})
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={paymentData.fullName}
                      onChange={(e) =>
                        setPaymentData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={paymentData.email}
                      onChange={(e) =>
                        setPaymentData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {donationData.paymentMethod === 'fapshi' && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (MTN/Orange) *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., 670000000"
                        value={paymentData.phone}
                        onChange={(e) =>
                          setPaymentData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Payment Summary</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{getSelectedAmount()} XAF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="capitalize">{donationData.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="capitalize">
                        {getPaymentName(donationData.paymentMethod)}
                      </span>
                    </div>
                    {donationData.projectId && (
                      <div className="flex justify-between">
                        <span>Project:</span>
                        <span>
                          {projects.find((p) => p.id === donationData.projectId)?.title ||
                            'Selected Project'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={handleBackStep} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      !paymentData.fullName ||
                      !paymentData.email ||
                      (donationData.paymentMethod === 'fapshi' && !paymentData.phone)
                    }
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    {loading
                      ? 'Processing...'
                      : `Pay with ${getPaymentName(donationData.paymentMethod)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
