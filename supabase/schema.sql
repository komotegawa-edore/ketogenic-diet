-- ============================================
-- Roopy Diet - Complete Database Schema
-- ============================================
-- Supabase SQL Editorでこのファイルを実行してください

-- ============================================
-- 1. 既存テーブルとポリシーを削除（クリーンスタート）
-- ============================================
DROP TABLE IF EXISTS "MealFood" CASCADE;
DROP TABLE IF EXISTS "Meal" CASCADE;
DROP TABLE IF EXISTS "Food" CASCADE;
DROP TABLE IF EXISTS "DailyGoal" CASCADE;
DROP TABLE IF EXISTS "UserProfile" CASCADE;
DROP TABLE IF EXISTS "WeightLog" CASCADE;

-- ============================================
-- 2. テーブル作成
-- ============================================

-- Food テーブル（食品マスタ）
CREATE TABLE "Food" (
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
CREATE TABLE "DailyGoal" (
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
CREATE TABLE "Meal" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- MealFood テーブル（食事に含まれる食品）
CREATE TABLE "MealFood" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "mealId" TEXT NOT NULL REFERENCES "Meal"(id) ON DELETE CASCADE,
  "foodId" TEXT NOT NULL REFERENCES "Food"(id) ON DELETE CASCADE,
  amount FLOAT NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- UserProfile テーブル（ユーザープロフィール）
CREATE TABLE "UserProfile" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  height FLOAT,
  "targetWeight" FLOAT,
  "activityLevel" TEXT DEFAULT 'moderate',
  gender TEXT,
  "birthDate" DATE,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("userId")
);

-- WeightLog テーブル（体重記録）
CREATE TABLE "WeightLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight FLOAT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("userId", date)
);

-- ============================================
-- 3. Row Level Security (RLS) 有効化
-- ============================================

ALTER TABLE "Food" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Meal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MealFood" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeightLog" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS ポリシー作成
-- ============================================

-- Food ポリシー
CREATE POLICY "food_select" ON "Food"
  FOR SELECT USING ("userId" IS NULL OR auth.uid() = "userId");
CREATE POLICY "food_insert" ON "Food"
  FOR INSERT WITH CHECK (auth.uid() = "userId" AND "isCustom" = true);
CREATE POLICY "food_update" ON "Food"
  FOR UPDATE USING (auth.uid() = "userId" AND "isCustom" = true);
CREATE POLICY "food_delete" ON "Food"
  FOR DELETE USING (auth.uid() = "userId" AND "isCustom" = true);

-- DailyGoal ポリシー
CREATE POLICY "goal_select" ON "DailyGoal"
  FOR SELECT USING (auth.uid() = "userId" OR "userId" IS NULL);
CREATE POLICY "goal_insert" ON "DailyGoal"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "goal_update" ON "DailyGoal"
  FOR UPDATE USING (auth.uid() = "userId");

-- Meal ポリシー
CREATE POLICY "meal_select" ON "Meal"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "meal_insert" ON "Meal"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "meal_update" ON "Meal"
  FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "meal_delete" ON "Meal"
  FOR DELETE USING (auth.uid() = "userId");

-- MealFood ポリシー
CREATE POLICY "mealfood_all" ON "MealFood"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Meal" WHERE "Meal".id = "MealFood"."mealId" AND "Meal"."userId" = auth.uid()
    )
  );

-- UserProfile ポリシー
CREATE POLICY "profile_select" ON "UserProfile"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "profile_insert" ON "UserProfile"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "profile_update" ON "UserProfile"
  FOR UPDATE USING (auth.uid() = "userId");

-- WeightLog ポリシー
CREATE POLICY "weight_select" ON "WeightLog"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "weight_insert" ON "WeightLog"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "weight_update" ON "WeightLog"
  FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "weight_delete" ON "WeightLog"
  FOR DELETE USING (auth.uid() = "userId");

-- ============================================
-- 5. インデックス作成
-- ============================================

CREATE INDEX idx_food_user ON "Food"("userId");
CREATE INDEX idx_food_name ON "Food"(name);
CREATE INDEX idx_food_custom ON "Food"("isCustom");
CREATE INDEX idx_meal_user_date ON "Meal"("userId", date DESC);
CREATE INDEX idx_mealfood_meal ON "MealFood"("mealId");
CREATE INDEX idx_dailygoal_user ON "DailyGoal"("userId", "isActive");
CREATE INDEX idx_weightlog_user_date ON "WeightLog"("userId", date DESC);
CREATE INDEX idx_userprofile_user ON "UserProfile"("userId");
