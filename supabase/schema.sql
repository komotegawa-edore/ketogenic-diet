-- ============================================
-- Roopy Diet - Complete Database Schema
-- ============================================
-- Supabase SQL Editorでこのファイルを実行してください
-- https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new

-- ============================================
-- 1. テーブル作成
-- ============================================

-- Food テーブル（食品マスタ）
CREATE TABLE IF NOT EXISTS "Food" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  protein FLOAT NOT NULL DEFAULT 0,
  fat FLOAT NOT NULL DEFAULT 0,
  carbs FLOAT NOT NULL DEFAULT 0,
  calories FLOAT NOT NULL DEFAULT 0,
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "isCustom" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- DailyGoal テーブル（目標設定）
CREATE TABLE IF NOT EXISTS "DailyGoal" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  protein FLOAT NOT NULL DEFAULT 120,
  fat FLOAT NOT NULL DEFAULT 150,
  carbs FLOAT NOT NULL DEFAULT 20,
  calories FLOAT NOT NULL DEFAULT 2000,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Meal テーブル（食事記録）
CREATE TABLE IF NOT EXISTS "Meal" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- MealFood テーブル（食事に含まれる食品）
CREATE TABLE IF NOT EXISTS "MealFood" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "mealId" TEXT NOT NULL REFERENCES "Meal"(id) ON DELETE CASCADE,
  "foodId" TEXT NOT NULL REFERENCES "Food"(id) ON DELETE CASCADE,
  amount FLOAT NOT NULL DEFAULT 100, -- grams
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- UserProfile テーブル（ユーザープロフィール）
CREATE TABLE IF NOT EXISTS "UserProfile" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  height FLOAT, -- cm
  "targetWeight" FLOAT, -- kg
  "activityLevel" TEXT DEFAULT 'moderate',
  gender TEXT,
  "birthDate" DATE,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("userId")
);

-- WeightLog テーブル（体重記録）
CREATE TABLE IF NOT EXISTS "WeightLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight FLOAT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("userId", date)
);

-- ============================================
-- 2. Row Level Security (RLS) 有効化
-- ============================================

ALTER TABLE "Food" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Meal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MealFood" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeightLog" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. RLS ポリシー作成
-- ============================================

-- Food ポリシー
DROP POLICY IF EXISTS "Anyone can view system foods" ON "Food";
DROP POLICY IF EXISTS "Users can view own custom foods" ON "Food";
DROP POLICY IF EXISTS "Users can insert custom foods" ON "Food";
DROP POLICY IF EXISTS "Users can update own custom foods" ON "Food";
DROP POLICY IF EXISTS "Users can delete own custom foods" ON "Food";

CREATE POLICY "Anyone can view system foods" ON "Food"
  FOR SELECT USING ("userId" IS NULL OR auth.uid() = "userId");
CREATE POLICY "Users can insert custom foods" ON "Food"
  FOR INSERT WITH CHECK (auth.uid() = "userId" AND "isCustom" = true);
CREATE POLICY "Users can update own custom foods" ON "Food"
  FOR UPDATE USING (auth.uid() = "userId" AND "isCustom" = true);
CREATE POLICY "Users can delete own custom foods" ON "Food"
  FOR DELETE USING (auth.uid() = "userId" AND "isCustom" = true);

-- DailyGoal ポリシー
DROP POLICY IF EXISTS "Users can view own goals" ON "DailyGoal";
DROP POLICY IF EXISTS "Users can insert own goals" ON "DailyGoal";
DROP POLICY IF EXISTS "Users can update own goals" ON "DailyGoal";

CREATE POLICY "Users can view own goals" ON "DailyGoal"
  FOR SELECT USING (auth.uid() = "userId" OR "userId" IS NULL);
CREATE POLICY "Users can insert own goals" ON "DailyGoal"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own goals" ON "DailyGoal"
  FOR UPDATE USING (auth.uid() = "userId");

-- Meal ポリシー
DROP POLICY IF EXISTS "Users can view own meals" ON "Meal";
DROP POLICY IF EXISTS "Users can insert own meals" ON "Meal";
DROP POLICY IF EXISTS "Users can update own meals" ON "Meal";
DROP POLICY IF EXISTS "Users can delete own meals" ON "Meal";

CREATE POLICY "Users can view own meals" ON "Meal"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own meals" ON "Meal"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own meals" ON "Meal"
  FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own meals" ON "Meal"
  FOR DELETE USING (auth.uid() = "userId");

-- MealFood ポリシー
DROP POLICY IF EXISTS "Users can manage own meal foods" ON "MealFood";

CREATE POLICY "Users can manage meal foods" ON "MealFood"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Meal" WHERE "Meal".id = "MealFood"."mealId" AND "Meal"."userId" = auth.uid()
    )
  );

-- UserProfile ポリシー
DROP POLICY IF EXISTS "Users can view own profile" ON "UserProfile";
DROP POLICY IF EXISTS "Users can insert own profile" ON "UserProfile";
DROP POLICY IF EXISTS "Users can update own profile" ON "UserProfile";

CREATE POLICY "Users can view own profile" ON "UserProfile"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own profile" ON "UserProfile"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own profile" ON "UserProfile"
  FOR UPDATE USING (auth.uid() = "userId");

-- WeightLog ポリシー
DROP POLICY IF EXISTS "Users can view own weight logs" ON "WeightLog";
DROP POLICY IF EXISTS "Users can insert own weight logs" ON "WeightLog";
DROP POLICY IF EXISTS "Users can update own weight logs" ON "WeightLog";
DROP POLICY IF EXISTS "Users can delete own weight logs" ON "WeightLog";

CREATE POLICY "Users can view own weight logs" ON "WeightLog"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own weight logs" ON "WeightLog"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own weight logs" ON "WeightLog"
  FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own weight logs" ON "WeightLog"
  FOR DELETE USING (auth.uid() = "userId");

-- ============================================
-- 4. インデックス作成
-- ============================================

CREATE INDEX IF NOT EXISTS idx_food_user ON "Food"("userId");
CREATE INDEX IF NOT EXISTS idx_food_name ON "Food"(name);
CREATE INDEX IF NOT EXISTS idx_food_custom ON "Food"("isCustom");
CREATE INDEX IF NOT EXISTS idx_meal_user_date ON "Meal"("userId", date DESC);
CREATE INDEX IF NOT EXISTS idx_mealfood_meal ON "MealFood"("mealId");
CREATE INDEX IF NOT EXISTS idx_dailygoal_user ON "DailyGoal"("userId", "isActive");
CREATE INDEX IF NOT EXISTS idx_weightlog_user_date ON "WeightLog"("userId", date DESC);
CREATE INDEX IF NOT EXISTS idx_userprofile_user ON "UserProfile"("userId");
