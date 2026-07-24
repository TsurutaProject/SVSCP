export type ExerciseMeta = {
  /** content/ のMDXファイルのslugと完全一致させる (例: "ch1-02-arrow-function") */
  id: string;
  title: string;
  order: number;
};

export type ChapterMeta = {
  id: string;
  title: string;
  exercises: ExerciseMeta[];
};
