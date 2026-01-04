-- Roopy Diet Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- User Profile Table (体重・身長などの身体情報)
-- ============================================
CREATE TABLE IF NOT EXISTS "UserProfile" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  height FLOAT, -- cm
  "targetWeight" FLOAT, -- kg
  "activityLevel" TEXT DEFAULT 'moderate', -- sedentary, light, moderate, active, very_active
  gender TEXT, -- male, female, other
  "birthDate" DATE,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("userId")
);

-- ============================================
-- Weight Log Table (毎日の体重記録)
-- ============================================
CREATE TABLE IF NOT EXISTS "WeightLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight FLOAT NOT NULL, -- kg
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("userId", date)
);

-- ============================================
-- Update Food Table (ユーザーカスタム食品対応)
-- ============================================
-- Add userId column if not exists (null = system food, not null = user's custom food)
ALTER TABLE "Food" ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE;
-- Add isCustom flag for clarity
ALTER TABLE "Food" ADD COLUMN IF NOT EXISTS "isCustom" BOOLEAN DEFAULT false;

-- ============================================
-- Update Meal Table (ユーザー紐付け)
-- ============================================
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================
-- Update DailyGoal Table (ユーザー紐付け)
-- ============================================
ALTER TABLE "DailyGoal" ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeightLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Food" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Meal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MealFood" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyGoal" ENABLE ROW LEVEL SECURITY;

-- UserProfile policies
CREATE POLICY "Users can view own profile" ON "UserProfile"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own profile" ON "UserProfile"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own profile" ON "UserProfile"
  FOR UPDATE USING (auth.uid() = "userId");

-- WeightLog policies
CREATE POLICY "Users can view own weight logs" ON "WeightLog"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own weight logs" ON "WeightLog"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own weight logs" ON "WeightLog"
  FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own weight logs" ON "WeightLog"
  FOR DELETE USING (auth.uid() = "userId");

-- Food policies (system foods readable by all, custom foods only by owner)
CREATE POLICY "Anyone can view system foods" ON "Food"
  FOR SELECT USING ("userId" IS NULL OR auth.uid() = "userId");
CREATE POLICY "Users can insert custom foods" ON "Food"
  FOR INSERT WITH CHECK (auth.uid() = "userId" AND "isCustom" = true);
CREATE POLICY "Users can update own custom foods" ON "Food"
  FOR UPDATE USING (auth.uid() = "userId" AND "isCustom" = true);
CREATE POLICY "Users can delete own custom foods" ON "Food"
  FOR DELETE USING (auth.uid() = "userId" AND "isCustom" = true);

-- Meal policies
CREATE POLICY "Users can view own meals" ON "Meal"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own meals" ON "Meal"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own meals" ON "Meal"
  FOR UPDATE USING (auth.uid() = "userId");
CREATE POLICY "Users can delete own meals" ON "Meal"
  FOR DELETE USING (auth.uid() = "userId");

-- MealFood policies (through meal ownership)
CREATE POLICY "Users can manage own meal foods" ON "MealFood"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Meal" WHERE "Meal".id = "MealFood"."mealId" AND "Meal"."userId" = auth.uid()
    )
  );

-- DailyGoal policies
CREATE POLICY "Users can view own goals" ON "DailyGoal"
  FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert own goals" ON "DailyGoal"
  FOR INSERT WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Users can update own goals" ON "DailyGoal"
  FOR UPDATE USING (auth.uid() = "userId");

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_weightlog_user_date ON "WeightLog"("userId", date DESC);
CREATE INDEX IF NOT EXISTS idx_meal_user_date ON "Meal"("userId", date DESC);
CREATE INDEX IF NOT EXISTS idx_food_user ON "Food"("userId");
CREATE INDEX IF NOT EXISTS idx_food_name ON "Food"(name);
