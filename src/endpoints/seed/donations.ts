import { RequiredDataFromCollectionSlug } from 'payload'
import type { Project } from '@/payload-types'

type DonationArgs = {
  project: Project
}

export const donations: (args: DonationArgs) => RequiredDataFromCollectionSlug<'donations'>[] = ({
  project,
}) => {
  return [
    {
      donorName: 'John Smith',
      donorEmail: 'john.smith@example.com',
      amount: 25000,
      originalDonationAmount: 50,
      donorCurrency: 'USD',
      project: project.id,
      message: 'Happy to support this important cause. Clean water is a basic human right.',
      isAnonymous: false,
      status: 'completed',
      paymentMethod: 'skrill',
      transactionId: 'txn_1234567890',
      donatedAt: new Date('2024-01-15').toISOString(),
    },
    {
      donorName: 'Marie Dubois',
      donorEmail: 'marie.dubois@example.com',
      amount: 15000,
      originalDonationAmount: 25,
      donorCurrency: 'EUR',
      project: project.id,
      message: 'Merci pour ce projet formidable!',
      isAnonymous: false,
      status: 'completed',
      paymentMethod: 'fapshi',
      transactionId: 'pp_9876543210',
      donatedAt: new Date('2024-02-03').toISOString(),
    },
    {
      donorName: 'Anonymous Donor',
      donorEmail: 'anonymous@example.com',
      amount: 10000,
      originalDonationAmount: 10000,
      donorCurrency: 'XAF',
      project: project.id,
      message: null,
      isAnonymous: true,
      status: 'completed',
      paymentMethod: 'fapshi',
      transactionId: 'mtn_5555666677',
      donatedAt: new Date('2024-02-20').toISOString(),
    },
    {
      donorName: 'David Wilson',
      donorEmail: 'david.wilson@example.com',
      amount: 30000,
      originalDonationAmount: 45,
      donorCurrency: 'GBP',
      project: project.id,
      message: 'Keep up the excellent work! Education is the key to progress.',
      isAnonymous: false,
      status: 'completed',
      paymentMethod: 'fapshi',
      transactionId: 'bt_1122334455',
      donatedAt: new Date('2024-03-10').toISOString(),
    },
    {
      donorName: 'Sarah Johnson',
      donorEmail: 'sarah.johnson@example.com',
      amount: 5000,
      originalDonationAmount: 10,
      donorCurrency: 'USD',
      project: project.id,
      message: 'Small contribution but with big hopes for the project success.',
      isAnonymous: false,
      status: 'pending',
      paymentMethod: 'skrill',
      transactionId: 'txn_pending123',
      donatedAt: new Date().toISOString(),
    },
  ]
}
