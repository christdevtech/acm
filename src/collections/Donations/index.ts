import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import {
  recalculateProjectTotalOnDonationChange,
  recalculateProjectTotalOnDonationDelete,
} from './hooks/calculateProjectTotal'

export const Donations: CollectionConfig = {
  slug: 'donations',
  access: {
    create: anyone, // Allow public donations
    delete: authenticated,
    read: authenticated, // Only authenticated users can view donation details
    update: authenticated,
  },
  admin: {
    useAsTitle: 'donorName',
    defaultColumns: ['donorName', 'amount', 'project', 'donatedAt', 'status'],
  },
  fields: [
    {
      name: 'donorName',
      type: 'text',
      required: true,
      label: 'Donor Name',
    },
    {
      name: 'donorEmail',
      type: 'email',
      required: true,
      label: 'Donor Email',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Donation amount in XAF',
      },
    },
    {
      name: 'originalDonationAmount',
      type: 'number',
      admin: { description: 'Donation amount in the currency of the donnor' },
      defaultValue: 0,
    },
    {
      name: 'donorCurrency',
      type: 'select',
      defaultValue: 'USD',
      options: [
        {
          label: 'USD',
          value: 'USD',
        },
        {
          label: 'EUR',
          value: 'EUR',
        },
        {
          label: 'GBP',
          value: 'GBP',
        },
        {
          label: 'XAF',
          value: 'XAF',
        },
      ],
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Donor Message',
    },
    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: false,
      label: 'Anonymous Donation',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        {
          label: 'Skrill',
          value: 'skrill',
        },
        {
          label: 'Mobile Money (MTN or Orange)',
          value: 'fapshi',
        },
      ],
    },
    {
      name: 'transactionId',
      type: 'text',
      label: 'Transaction ID',
      admin: {
        description: 'Payment processor transaction ID',
      },
    },
    {
      name: 'donatedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    afterChange: [recalculateProjectTotalOnDonationChange],
    afterDelete: [recalculateProjectTotalOnDonationDelete],
  },
  timestamps: true,
}
