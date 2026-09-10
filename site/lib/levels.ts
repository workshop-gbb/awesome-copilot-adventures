import type { DocumentInfo, Labels } from './catalog';

/*
 * The six curriculum levels, in order. The label comes from the UI dictionary so the path reads in
 * the visitor's language, and the membership comes from the published catalog so a new adventure
 * appears without editing this file.
 */
export const levelOrder = ['00-foundations', '01-basics', '02-intermediate', '03-advanced', '04-surfaces', '99-capstone'] as const;
export type LevelId = typeof levelOrder[number];
export const levelTones = ['blue', 'green', 'yellow', 'red', 'blue', 'green'] as const;

export function levelLabel(ui: Labels, level: string): string {
  const labels: Record<string, string> = {
    '00-foundations': ui.foundations, '01-basics': ui.levelBasics, '02-intermediate': ui.levelIntermediate,
    '03-advanced': ui.levelAdvanced, '04-surfaces': ui.surfaces, '99-capstone': ui.levelCapstone
  };
  return labels[level] || level;
}

export interface Level { level: string; index: number; tone: string; label: string; lessons: DocumentInfo[]; }

export function adventureLevels(catalog: DocumentInfo[], ui: Labels): Level[] {
  const adventures = catalog
    .filter(document => document.group === 'adventures' && document.source.endsWith('/README.md'))
    .sort((left, right) => (left.navigationOrder ?? 1000) - (right.navigationOrder ?? 1000));
  return levelOrder
    .map((level, index) => ({
      level,
      index,
      tone: levelTones[index],
      label: levelLabel(ui, level),
      lessons: adventures.filter(document => document.navigationSection === level)
    }))
    .filter(entry => entry.lessons.length > 0);
}
