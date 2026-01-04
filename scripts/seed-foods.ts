// 日本食品標準成分表2020年版（八訂）ベースの食品シードデータ
// https://fooddb.mext.go.jp/
// 値は100gあたり

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const foods = [
  // ========== 穀類 ==========
  { name: '白米（炊飯）', protein: 2.5, fat: 0.3, carbs: 37.1, calories: 168 },
  { name: '玄米（炊飯）', protein: 2.8, fat: 1.0, carbs: 35.6, calories: 165 },
  { name: '食パン', protein: 9.0, fat: 4.2, carbs: 46.4, calories: 260 },
  { name: 'フランスパン', protein: 9.4, fat: 1.3, carbs: 57.5, calories: 279 },
  { name: 'ロールパン', protein: 10.1, fat: 9.0, carbs: 48.6, calories: 316 },
  { name: 'うどん（ゆで）', protein: 2.6, fat: 0.4, carbs: 21.6, calories: 105 },
  { name: 'そば（ゆで）', protein: 4.8, fat: 1.0, carbs: 26.0, calories: 132 },
  { name: 'そうめん（ゆで）', protein: 3.5, fat: 0.4, carbs: 25.8, calories: 127 },
  { name: 'ラーメン（中華麺・ゆで）', protein: 4.9, fat: 0.6, carbs: 29.2, calories: 149 },
  { name: 'スパゲッティ（ゆで）', protein: 5.2, fat: 0.9, carbs: 28.4, calories: 149 },
  { name: 'もち', protein: 4.0, fat: 0.6, carbs: 50.8, calories: 235 },
  { name: 'オートミール', protein: 13.7, fat: 5.7, carbs: 69.1, calories: 380 },
  { name: 'コーンフレーク', protein: 7.8, fat: 1.7, carbs: 83.6, calories: 381 },

  // ========== 肉類 ==========
  { name: '鶏むね肉（皮なし）', protein: 23.3, fat: 1.9, carbs: 0, calories: 116 },
  { name: '鶏もも肉（皮つき）', protein: 17.3, fat: 14.2, carbs: 0, calories: 204 },
  { name: '鶏もも肉（皮なし）', protein: 19.0, fat: 5.0, carbs: 0, calories: 127 },
  { name: '鶏ささみ', protein: 24.6, fat: 1.1, carbs: 0, calories: 114 },
  { name: '鶏手羽先', protein: 17.4, fat: 16.2, carbs: 0, calories: 226 },
  { name: '鶏手羽元', protein: 18.2, fat: 12.8, carbs: 0, calories: 197 },
  { name: '鶏ひき肉', protein: 17.5, fat: 12.0, carbs: 0, calories: 186 },
  { name: '豚ロース', protein: 19.3, fat: 19.2, carbs: 0.2, calories: 263 },
  { name: '豚ヒレ', protein: 22.2, fat: 3.7, carbs: 0.3, calories: 130 },
  { name: '豚ばら肉', protein: 14.4, fat: 35.4, carbs: 0.1, calories: 395 },
  { name: '豚もも肉', protein: 20.5, fat: 10.2, carbs: 0.2, calories: 183 },
  { name: '豚肩ロース', protein: 17.1, fat: 19.2, carbs: 0.1, calories: 253 },
  { name: '豚ひき肉', protein: 17.7, fat: 17.2, carbs: 0.1, calories: 236 },
  { name: '牛肩ロース', protein: 16.5, fat: 26.4, carbs: 0.1, calories: 318 },
  { name: '牛サーロイン', protein: 17.1, fat: 23.7, carbs: 0.3, calories: 298 },
  { name: '牛ばら肉', protein: 14.4, fat: 32.9, carbs: 0.2, calories: 371 },
  { name: '牛もも肉', protein: 19.5, fat: 10.7, carbs: 0.4, calories: 182 },
  { name: '牛ひき肉', protein: 17.1, fat: 21.1, carbs: 0.3, calories: 272 },
  { name: '牛タン', protein: 15.2, fat: 21.7, carbs: 0.1, calories: 269 },
  { name: 'ラム肉（もも）', protein: 18.0, fat: 16.0, carbs: 0.1, calories: 227 },
  { name: 'ベーコン', protein: 12.9, fat: 39.1, carbs: 0.3, calories: 405 },
  { name: 'ウインナー', protein: 11.5, fat: 28.5, carbs: 3.0, calories: 321 },
  { name: 'フランクフルト', protein: 12.7, fat: 24.7, carbs: 6.2, calories: 298 },
  { name: 'ハム（ロース）', protein: 18.6, fat: 5.0, carbs: 1.8, calories: 118 },
  { name: 'ハム（ボンレス）', protein: 18.7, fat: 4.0, carbs: 2.0, calories: 118 },
  { name: '鶏レバー', protein: 18.9, fat: 3.1, carbs: 0.6, calories: 111 },
  { name: '豚レバー', protein: 20.4, fat: 3.4, carbs: 2.5, calories: 128 },
  { name: '牛レバー', protein: 19.6, fat: 3.7, carbs: 3.7, calories: 132 },

  // ========== 魚介類 ==========
  { name: 'サーモン（生）', protein: 20.1, fat: 12.1, carbs: 0.1, calories: 188 },
  { name: 'マグロ（赤身）', protein: 26.4, fat: 1.4, carbs: 0.1, calories: 125 },
  { name: 'マグロ（中トロ）', protein: 20.1, fat: 16.5, carbs: 0.1, calories: 232 },
  { name: 'サバ', protein: 20.6, fat: 16.8, carbs: 0.3, calories: 247 },
  { name: 'アジ', protein: 19.7, fat: 4.5, carbs: 0.1, calories: 126 },
  { name: 'ブリ', protein: 21.4, fat: 17.6, carbs: 0.3, calories: 257 },
  { name: 'イワシ', protein: 19.2, fat: 9.2, carbs: 0.2, calories: 169 },
  { name: 'サンマ', protein: 18.1, fat: 25.6, carbs: 0.1, calories: 318 },
  { name: 'カツオ', protein: 25.8, fat: 0.5, carbs: 0.1, calories: 114 },
  { name: 'タイ', protein: 20.6, fat: 5.8, carbs: 0.1, calories: 142 },
  { name: 'ヒラメ', protein: 20.0, fat: 2.0, carbs: 0, calories: 103 },
  { name: 'カレイ', protein: 19.6, fat: 1.3, carbs: 0.1, calories: 95 },
  { name: 'タラ', protein: 17.6, fat: 0.2, carbs: 0.1, calories: 77 },
  { name: 'ホッケ', protein: 17.3, fat: 4.4, carbs: 0.1, calories: 115 },
  { name: '銀鮭', protein: 19.6, fat: 12.8, carbs: 0.3, calories: 204 },
  { name: 'エビ（車エビ）', protein: 21.6, fat: 0.6, carbs: 0.1, calories: 97 },
  { name: 'エビ（ブラックタイガー）', protein: 18.4, fat: 0.3, carbs: 0.3, calories: 82 },
  { name: 'イカ', protein: 17.9, fat: 0.8, carbs: 0.1, calories: 83 },
  { name: 'タコ', protein: 16.4, fat: 0.7, carbs: 0.1, calories: 76 },
  { name: 'ホタテ（貝柱）', protein: 13.5, fat: 0.3, carbs: 3.5, calories: 72 },
  { name: 'あさり', protein: 6.0, fat: 0.3, carbs: 0.4, calories: 30 },
  { name: 'しじみ', protein: 7.5, fat: 1.4, carbs: 4.5, calories: 64 },
  { name: 'カキ', protein: 6.9, fat: 2.2, carbs: 4.9, calories: 70 },
  { name: 'しらす干し', protein: 23.1, fat: 3.5, carbs: 0.5, calories: 124 },
  { name: 'ツナ缶（水煮）', protein: 16.0, fat: 0.7, carbs: 0.1, calories: 71 },
  { name: 'ツナ缶（油漬）', protein: 17.7, fat: 21.7, carbs: 0.1, calories: 267 },
  { name: 'サバ缶（水煮）', protein: 20.9, fat: 10.7, carbs: 0.2, calories: 190 },
  { name: '明太子', protein: 21.0, fat: 3.3, carbs: 3.0, calories: 126 },
  { name: 'たらこ', protein: 24.0, fat: 4.7, carbs: 0.4, calories: 140 },
  { name: 'いくら', protein: 32.6, fat: 15.6, carbs: 0.2, calories: 272 },
  { name: 'うなぎ（蒲焼）', protein: 23.0, fat: 21.0, carbs: 3.1, calories: 293 },

  // ========== 卵・乳製品 ==========
  { name: '卵（全卵）', protein: 12.2, fat: 10.2, carbs: 0.4, calories: 142 },
  { name: '卵黄', protein: 16.5, fat: 34.3, carbs: 0.1, calories: 336 },
  { name: '卵白', protein: 10.1, fat: 0, carbs: 0.5, calories: 44 },
  { name: 'うずら卵', protein: 12.6, fat: 13.1, carbs: 0.3, calories: 179 },
  { name: '牛乳', protein: 3.3, fat: 3.8, carbs: 4.8, calories: 67 },
  { name: '低脂肪乳', protein: 3.8, fat: 1.0, carbs: 5.5, calories: 46 },
  { name: '豆乳', protein: 3.6, fat: 2.0, carbs: 2.9, calories: 46 },
  { name: 'ヨーグルト（無糖）', protein: 3.6, fat: 3.0, carbs: 4.9, calories: 62 },
  { name: 'ヨーグルト（加糖）', protein: 4.3, fat: 0.2, carbs: 11.9, calories: 67 },
  { name: 'チーズ（プロセス）', protein: 22.7, fat: 26.0, carbs: 1.3, calories: 339 },
  { name: 'チーズ（チェダー）', protein: 25.7, fat: 33.8, carbs: 1.4, calories: 423 },
  { name: 'チーズ（モッツァレラ）', protein: 18.4, fat: 19.9, carbs: 4.2, calories: 269 },
  { name: 'チーズ（クリーム）', protein: 8.2, fat: 33.0, carbs: 2.3, calories: 346 },
  { name: 'チーズ（パルメザン）', protein: 44.0, fat: 30.8, carbs: 1.9, calories: 445 },
  { name: 'チーズ（カマンベール）', protein: 19.1, fat: 24.7, carbs: 0.9, calories: 310 },
  { name: 'バター', protein: 0.5, fat: 83.0, carbs: 0.2, calories: 745 },
  { name: '生クリーム', protein: 2.0, fat: 45.0, carbs: 3.1, calories: 433 },
  { name: 'サワークリーム', protein: 2.0, fat: 45.0, carbs: 2.9, calories: 409 },

  // ========== 野菜類 ==========
  { name: 'にんじん', protein: 0.7, fat: 0.2, carbs: 9.3, calories: 39 },
  { name: 'たまねぎ', protein: 1.0, fat: 0.1, carbs: 8.4, calories: 37 },
  { name: 'じゃがいも', protein: 1.8, fat: 0.1, carbs: 17.3, calories: 76 },
  { name: 'さつまいも', protein: 1.2, fat: 0.2, carbs: 31.9, calories: 132 },
  { name: '長いも', protein: 2.2, fat: 0.3, carbs: 13.9, calories: 65 },
  { name: 'かぼちゃ', protein: 1.6, fat: 0.3, carbs: 10.9, calories: 49 },
  { name: 'トマト', protein: 0.7, fat: 0.1, carbs: 4.7, calories: 19 },
  { name: 'ミニトマト', protein: 1.1, fat: 0.1, carbs: 7.2, calories: 29 },
  { name: 'ほうれん草', protein: 2.2, fat: 0.4, carbs: 3.1, calories: 20 },
  { name: '小松菜', protein: 1.5, fat: 0.2, carbs: 2.4, calories: 14 },
  { name: 'ブロッコリー', protein: 4.3, fat: 0.5, carbs: 5.2, calories: 33 },
  { name: 'カリフラワー', protein: 3.0, fat: 0.1, carbs: 5.2, calories: 27 },
  { name: 'アスパラガス', protein: 2.6, fat: 0.2, carbs: 3.9, calories: 22 },
  { name: 'アボカド', protein: 2.1, fat: 17.5, carbs: 6.2, calories: 178 },
  { name: 'レタス', protein: 0.6, fat: 0.1, carbs: 2.8, calories: 12 },
  { name: 'キャベツ', protein: 1.3, fat: 0.2, carbs: 5.2, calories: 23 },
  { name: '白菜', protein: 0.8, fat: 0.1, carbs: 3.2, calories: 14 },
  { name: 'きゅうり', protein: 1.0, fat: 0.1, carbs: 3.0, calories: 14 },
  { name: 'なす', protein: 1.1, fat: 0.1, carbs: 5.1, calories: 22 },
  { name: 'ピーマン', protein: 0.9, fat: 0.2, carbs: 5.1, calories: 22 },
  { name: 'パプリカ（赤）', protein: 1.0, fat: 0.2, carbs: 7.2, calories: 30 },
  { name: 'もやし', protein: 1.7, fat: 0.1, carbs: 2.6, calories: 14 },
  { name: 'ズッキーニ', protein: 1.3, fat: 0.1, carbs: 2.8, calories: 14 },
  { name: '大根', protein: 0.5, fat: 0.1, carbs: 4.1, calories: 18 },
  { name: 'ごぼう', protein: 1.8, fat: 0.1, carbs: 15.4, calories: 65 },
  { name: 'れんこん', protein: 1.9, fat: 0.1, carbs: 15.5, calories: 66 },
  { name: 'セロリ', protein: 0.4, fat: 0.1, carbs: 2.1, calories: 12 },
  { name: 'にんにく', protein: 6.0, fat: 0.9, carbs: 26.3, calories: 136 },
  { name: '生姜', protein: 0.9, fat: 0.3, carbs: 6.6, calories: 30 },
  { name: 'ねぎ', protein: 1.4, fat: 0.1, carbs: 7.2, calories: 28 },
  { name: 'にら', protein: 1.7, fat: 0.3, carbs: 4.0, calories: 21 },
  { name: 'しいたけ', protein: 3.0, fat: 0.4, carbs: 5.7, calories: 19 },
  { name: 'えのき', protein: 2.7, fat: 0.2, carbs: 7.6, calories: 22 },
  { name: 'しめじ', protein: 2.7, fat: 0.6, carbs: 4.8, calories: 18 },
  { name: 'まいたけ', protein: 2.0, fat: 0.5, carbs: 4.4, calories: 15 },
  { name: 'エリンギ', protein: 2.8, fat: 0.4, carbs: 6.0, calories: 19 },
  { name: 'なめこ', protein: 1.7, fat: 0.2, carbs: 5.2, calories: 15 },

  // ========== 果物類 ==========
  { name: 'りんご', protein: 0.2, fat: 0.3, carbs: 15.5, calories: 56 },
  { name: 'バナナ', protein: 1.1, fat: 0.2, carbs: 22.5, calories: 93 },
  { name: 'みかん', protein: 0.7, fat: 0.1, carbs: 12.0, calories: 49 },
  { name: 'オレンジ', protein: 1.0, fat: 0.1, carbs: 11.8, calories: 48 },
  { name: 'グレープフルーツ', protein: 0.9, fat: 0.1, carbs: 9.6, calories: 40 },
  { name: 'ぶどう', protein: 0.4, fat: 0.1, carbs: 15.7, calories: 59 },
  { name: 'いちご', protein: 0.9, fat: 0.1, carbs: 8.5, calories: 34 },
  { name: 'ブルーベリー', protein: 0.5, fat: 0.1, carbs: 12.9, calories: 49 },
  { name: 'キウイ', protein: 1.0, fat: 0.2, carbs: 13.4, calories: 51 },
  { name: 'もも', protein: 0.6, fat: 0.1, carbs: 10.2, calories: 40 },
  { name: 'なし', protein: 0.3, fat: 0.1, carbs: 11.3, calories: 43 },
  { name: '柿', protein: 0.4, fat: 0.2, carbs: 15.9, calories: 60 },
  { name: 'メロン', protein: 1.0, fat: 0.1, carbs: 10.3, calories: 42 },
  { name: 'スイカ', protein: 0.6, fat: 0.1, carbs: 9.5, calories: 37 },
  { name: 'マンゴー', protein: 0.6, fat: 0.1, carbs: 16.9, calories: 64 },
  { name: 'パイナップル', protein: 0.6, fat: 0.1, carbs: 13.7, calories: 53 },
  { name: 'さくらんぼ', protein: 1.0, fat: 0.2, carbs: 15.2, calories: 60 },
  { name: 'レモン', protein: 0.4, fat: 0.7, carbs: 7.6, calories: 26 },

  // ========== 大豆製品 ==========
  { name: '木綿豆腐', protein: 7.0, fat: 4.9, carbs: 1.5, calories: 80 },
  { name: '絹ごし豆腐', protein: 5.3, fat: 3.5, carbs: 2.0, calories: 62 },
  { name: '厚揚げ', protein: 10.7, fat: 11.3, carbs: 0.9, calories: 150 },
  { name: '油揚げ', protein: 23.4, fat: 34.4, carbs: 0.4, calories: 410 },
  { name: '納豆', protein: 16.5, fat: 10.0, carbs: 12.1, calories: 200 },
  { name: '枝豆', protein: 11.7, fat: 6.2, carbs: 8.8, calories: 135 },
  { name: 'おから', protein: 6.1, fat: 3.6, carbs: 13.8, calories: 111 },
  { name: '豆乳', protein: 3.6, fat: 2.0, carbs: 2.9, calories: 46 },
  { name: '高野豆腐', protein: 50.5, fat: 34.1, carbs: 3.9, calories: 536 },

  // ========== ナッツ・種実類 ==========
  { name: 'アーモンド', protein: 20.3, fat: 51.8, carbs: 10.8, calories: 608 },
  { name: 'くるみ', protein: 14.6, fat: 68.8, carbs: 4.2, calories: 713 },
  { name: 'マカダミアナッツ', protein: 8.3, fat: 76.7, carbs: 6.0, calories: 751 },
  { name: 'ピーナッツ', protein: 26.5, fat: 47.5, carbs: 12.4, calories: 585 },
  { name: 'カシューナッツ', protein: 19.8, fat: 47.6, carbs: 20.0, calories: 591 },
  { name: 'ピスタチオ', protein: 17.4, fat: 56.1, carbs: 11.7, calories: 617 },
  { name: 'ヘーゼルナッツ', protein: 13.6, fat: 69.3, carbs: 6.5, calories: 701 },
  { name: 'ごま（いり）', protein: 20.3, fat: 54.2, carbs: 5.9, calories: 599 },
  { name: 'チアシード', protein: 20.0, fat: 32.8, carbs: 7.7, calories: 446 },

  // ========== 調味料・油 ==========
  { name: 'オリーブオイル', protein: 0, fat: 100, carbs: 0, calories: 900 },
  { name: 'ごま油', protein: 0, fat: 100, carbs: 0, calories: 900 },
  { name: 'サラダ油', protein: 0, fat: 100, carbs: 0, calories: 900 },
  { name: 'MCTオイル', protein: 0, fat: 100, carbs: 0, calories: 900 },
  { name: 'ココナッツオイル', protein: 0, fat: 100, carbs: 0, calories: 900 },
  { name: 'マヨネーズ', protein: 1.5, fat: 76.0, carbs: 3.6, calories: 703 },
  { name: 'ケチャップ', protein: 1.6, fat: 0, carbs: 27.6, calories: 119 },
  { name: '醤油', protein: 7.7, fat: 0, carbs: 7.9, calories: 71 },
  { name: '味噌（合わせ）', protein: 12.5, fat: 6.0, carbs: 17.0, calories: 192 },
  { name: 'みりん', protein: 0.3, fat: 0, carbs: 43.2, calories: 241 },
  { name: '料理酒', protein: 0.4, fat: 0, carbs: 4.5, calories: 109 },
  { name: '砂糖（上白糖）', protein: 0, fat: 0, carbs: 99.3, calories: 391 },
  { name: 'はちみつ', protein: 0.3, fat: 0, carbs: 81.9, calories: 329 },
  { name: 'めんつゆ（2倍）', protein: 2.8, fat: 0, carbs: 12.6, calories: 63 },
  { name: 'ポン酢', protein: 3.4, fat: 0, carbs: 8.0, calories: 50 },
  { name: '塩', protein: 0, fat: 0, carbs: 0, calories: 0 },
  { name: 'こしょう', protein: 11.0, fat: 6.0, carbs: 66.6, calories: 371 },

  // ========== 飲料 ==========
  { name: 'コーヒー（ブラック）', protein: 0.2, fat: 0, carbs: 0.7, calories: 4 },
  { name: '緑茶', protein: 0.2, fat: 0, carbs: 0, calories: 2 },
  { name: 'ウーロン茶', protein: 0, fat: 0, carbs: 0.1, calories: 0 },
  { name: 'コーラ', protein: 0, fat: 0, carbs: 11.4, calories: 46 },
  { name: 'オレンジジュース', protein: 0.4, fat: 0.1, carbs: 10.7, calories: 42 },
  { name: 'スポーツドリンク', protein: 0, fat: 0, carbs: 6.2, calories: 25 },

  // ========== お菓子・デザート ==========
  { name: 'チョコレート（ミルク）', protein: 6.9, fat: 34.1, carbs: 55.8, calories: 558 },
  { name: 'チョコレート（ダーク）', protein: 8.0, fat: 39.5, carbs: 42.6, calories: 560 },
  { name: 'ポテトチップス', protein: 4.7, fat: 35.2, carbs: 54.7, calories: 554 },
  { name: 'アイスクリーム', protein: 3.5, fat: 8.0, carbs: 23.2, calories: 180 },
  { name: 'プリン', protein: 5.5, fat: 5.0, carbs: 14.7, calories: 126 },
  { name: 'ショートケーキ', protein: 7.1, fat: 14.7, carbs: 43.9, calories: 327 },
  { name: 'ドーナツ', protein: 7.2, fat: 20.2, carbs: 49.0, calories: 375 },
  { name: 'せんべい', protein: 7.8, fat: 1.0, carbs: 83.4, calories: 373 },
  { name: '大福', protein: 4.8, fat: 0.4, carbs: 52.8, calories: 235 },
]

async function seedFoods() {
  console.log('Seeding foods...')

  // Delete existing foods first
  const { error: deleteError } = await supabase
    .from('Food')
    .delete()
    .neq('id', '')

  if (deleteError) {
    console.error('Error deleting existing foods:', deleteError)
  }

  const { data, error } = await supabase
    .from('Food')
    .insert(foods)
    .select()

  if (error) {
    console.error('Error seeding foods:', error)
    return
  }

  console.log(`Successfully seeded ${data.length} foods`)
}

seedFoods()
