import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create subscription plans
  const plans = [
    {
      id: 'plan_free',
      name: 'Free',
      tier: 'FREE',
      price: 0,
      interval: 'monthly',
      features: JSON.stringify([
        "Basic product listings",
        "View demo classes",
        "Basic forum access",
        "Limited agreements"
      ])
    },
    {
      id: 'plan_basic',
      name: 'Basic',
      tier: 'BASIC',
      price: 29.99,
      interval: 'monthly',
      features: JSON.stringify([
        "Enhanced product listings",
        "Access to paid demo classes",
        "Full forum access",
        "Priority support",
        "Unlimited agreements"
      ])
    },
    {
      id: 'plan_premium',
      name: 'Premium',
      tier: 'PREMIUM',
      price: 99.99,
      interval: 'monthly',
      features: JSON.stringify([
        "Featured product listings",
        "Host unlimited demo classes",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access",
        "Bulk operations"
      ])
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise',
      tier: 'ENTERPRISE',
      price: 299.99,
      interval: 'monthly',
      features: JSON.stringify([
        "White-label solution",
        "Dedicated account manager",
        "Custom integration support",
        "SLA guarantees",
        "Advanced security features",
        "Custom API limits",
        "Team management"
      ])
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 