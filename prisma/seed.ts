import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const SEED_USERNAMES = ['torvalds', 'gaearon', 'yyx990803', 'sindresorhus', 'tj']

async function main() {
  console.log('Seeding default CardConfigs for well-known users...')

  for (const username of SEED_USERNAMES) {
    await prisma.cardConfig.upsert({
      where: { shareSlug: username },
      create: {
        name: `${username}'s Card`,
        username,
        theme: 'default',
        cards: ['profile', 'stats', 'streak', 'heatmap', 'langs', 'repos'],
        isPublic: true,
        shareSlug: username,
        userId: 'seed',
      },
      update: {},
    })
    console.log(`  ✓ CardConfig for ${username}`)
  }

  console.log('Seed complete.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
