import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export type SubscriptionPlan = Prisma.SubscriptionPlanGetPayload<{}>;
export type UserSubscription = Prisma.UserSubscriptionGetPayload<{
  include: { plan: true }
}>;

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: [
        {
          price: 'asc'
        }
      ]
    });
    
    return plans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'active'
      },
      include: {
        plan: true
      }
    });
    
    return subscription;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
}

export async function createSubscription(userId: string, planId: string): Promise<UserSubscription> {
  try {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Default to 1 month subscription

    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        startDate: new Date(),
        endDate,
        status: 'active'
      },
      include: {
        plan: true
      }
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await prisma.userSubscription.update({
      where: {
        id: subscriptionId
      },
      data: {
        status: 'cancelled',
        autoRenew: false
      }
    });

    return subscription;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
} 