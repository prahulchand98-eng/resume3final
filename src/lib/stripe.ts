import Stripe from 'stripe';
import { PLAN_CREDITS } from './types';

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
}

export const STRIPE_PLANS: Record<string, { label: string; credits: number; price: string; priceId: string | undefined }> = {
  basic: {
    label: 'Basic',
    credits: PLAN_CREDITS.basic,
    price: '$9.99/mo',
    priceId: process.env.STRIPE_PRICE_BASIC,
  },
  pro: {
    label: 'Pro',
    credits: PLAN_CREDITS.pro,
    price: '$24.99/mo',
    priceId: process.env.STRIPE_PRICE_PRO,
  },
  premium: {
    label: 'Premium',
    credits: PLAN_CREDITS.premium,
    price: '$35.99/mo',
    priceId: process.env.STRIPE_PRICE_PREMIUM,
  },
};

export function planFromPriceId(priceId: string): string {
  for (const [plan, data] of Object.entries(STRIPE_PLANS)) {
    if (data.priceId === priceId) return plan;
  }
  return 'basic';
}
