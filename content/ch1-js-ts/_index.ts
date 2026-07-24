import type { ExerciseMeta } from '../../src/lib/curriculum/types'

export const ch1Exercises: ExerciseMeta[] = [
  // --- JS前提知識 ---
  {
    id: 'ch1-01-arrow-function',
    title: 'アロー関数',
    order: 1,
  },
  {
    id: 'ch1-02-destructuring-spread',
    title: '分割代入・スプレッド構文',
    order: 2,
  },
  {
    id: 'ch1-03-array-map-filter',
    title: '.map() / .filter()',
    order: 3,
  },
  {
    id: 'ch1-04-template-literals',
    title: 'テンプレートリテラル',
    order: 4,
  },
  {
    id: 'ch1-05-optional-chaining',
    title: 'オプショナルチェイニング(?.)',
    order: 5,
  },
  {
    id: 'ch1-06-modules',
    title: 'import / export(モジュール)',
    order: 6,
  },
  // --- TypeScript基礎 ---
  {
    id: 'ch1-07-basic-types',
    title: '基本の型注釈',
    order: 7,
  },
  {
    id: 'ch1-08-function-types',
    title: '関数の型',
    order: 8,
  },
  {
    id: 'ch1-09-interface',
    title: 'interface / オブジェクトの型',
    order: 9,
  },
  {
    id: 'ch1-10-union-types',
    title: 'union type / リテラル型',
    order: 10,
  },
  {
    id: 'ch1-11-optional-null',
    title: 'optional property / null許容',
    order: 11,
  },
  {
    id: 'ch1-12-nested-types',
    title: '配列・オブジェクトの型を組み合わせる',
    order: 12,
  },
  {
    id: 'ch1-13-generics-reading',
    title: 'ジェネリクスの読み方(useState<T>)',
    order: 13,
  },
  {
    id: 'ch1-14-utility-types',
    title: 'ユーティリティ型入門(Record, Partial, Exclude)',
    order: 14,
  },
  {
    id: 'ch1-15-capstone',
    title: '総合演習:電車の運行管理 & ケーキの注文管理',
    order: 15,
  },
]
