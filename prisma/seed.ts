import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

const ketoFoods = [
  // 肉類
  { name: '鶏むね肉（皮なし）', protein: 23.3, fat: 1.9, carbs: 0, calories: 116 },
  { name: '鶏もも肉（皮付き）', protein: 17.3, fat: 14.2, carbs: 0, calories: 204 },
  { name: '豚肩ロース', protein: 17.1, fat: 19.2, carbs: 0.1, calories: 253 },
  { name: '豚バラ肉', protein: 14.4, fat: 35.4, carbs: 0.1, calories: 395 },
  { name: '牛肩ロース', protein: 17.9, fat: 17.4, carbs: 0.1, calories: 240 },
  { name: '牛バラ肉', protein: 14.4, fat: 32.9, carbs: 0.2, calories: 371 },
  { name: 'ベーコン', protein: 12.9, fat: 39.1, carbs: 0.3, calories: 405 },
  { name: 'ソーセージ', protein: 11.5, fat: 28.5, carbs: 3.0, calories: 321 },

  // 魚介類
  { name: 'サーモン（生）', protein: 20.1, fat: 16.1, carbs: 0.1, calories: 233 },
  { name: 'さば（生）', protein: 20.6, fat: 16.8, carbs: 0.3, calories: 247 },
  { name: 'まぐろ（赤身）', protein: 26.4, fat: 1.4, carbs: 0.1, calories: 125 },
  { name: 'えび', protein: 21.6, fat: 0.6, carbs: 0.1, calories: 97 },

  // 卵・乳製品
  { name: '卵（全卵・1個約60g）', protein: 12.3, fat: 10.3, carbs: 0.3, calories: 151 },
  { name: 'チーズ（チェダー）', protein: 25.7, fat: 33.8, carbs: 1.4, calories: 423 },
  { name: 'クリームチーズ', protein: 8.2, fat: 33.0, carbs: 2.3, calories: 346 },
  { name: 'バター', protein: 0.6, fat: 81.0, carbs: 0.2, calories: 745 },
  { name: '生クリーム', protein: 2.0, fat: 45.0, carbs: 3.1, calories: 433 },

  // 野菜（低糖質）
  { name: 'ブロッコリー', protein: 4.3, fat: 0.5, carbs: 5.2, calories: 33 },
  { name: 'ほうれん草', protein: 2.2, fat: 0.4, carbs: 3.1, calories: 20 },
  { name: 'アボカド', protein: 2.5, fat: 18.7, carbs: 6.2, calories: 187 },
  { name: 'きゅうり', protein: 1.0, fat: 0.1, carbs: 3.0, calories: 14 },
  { name: 'レタス', protein: 1.2, fat: 0.2, carbs: 2.8, calories: 12 },
  { name: 'もやし', protein: 1.7, fat: 0.1, carbs: 2.6, calories: 14 },
  { name: 'キャベツ', protein: 1.3, fat: 0.2, carbs: 5.2, calories: 23 },

  // ナッツ類
  { name: 'アーモンド', protein: 19.6, fat: 51.8, carbs: 10.8, calories: 606 },
  { name: 'くるみ', protein: 14.6, fat: 68.8, carbs: 4.2, calories: 713 },
  { name: 'マカダミアナッツ', protein: 8.3, fat: 76.7, carbs: 6.0, calories: 751 },

  // オイル
  { name: 'オリーブオイル', protein: 0, fat: 100, carbs: 0, calories: 921 },
  { name: 'MCTオイル', protein: 0, fat: 100, carbs: 0, calories: 900 },
  { name: 'ココナッツオイル', protein: 0, fat: 100, carbs: 0, calories: 921 },
]

async function main() {
  console.log('Seeding keto foods...')

  // Check if foods already exist
  const existingFoods = await prisma.food.count()
  if (existingFoods === 0) {
    await prisma.food.createMany({
      data: ketoFoods,
    })
  } else {
    console.log('Foods already exist, skipping...')
  }

  // Create default keto goals
  const existingGoal = await prisma.dailyGoal.findFirst({
    where: { isActive: true },
  })

  if (!existingGoal) {
    await prisma.dailyGoal.create({
      data: {
        protein: 120,
        fat: 150,
        carbs: 20,
        calories: 2000,
        isActive: true,
      },
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
