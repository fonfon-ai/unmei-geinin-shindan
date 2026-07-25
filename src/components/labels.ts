import type { ActiveStatus, Era } from '../types';

export const ERA_LABEL: Record<Era, string> = {
  showa: '昭和',
  heisei_early: '平成前期',
  heisei_late: '平成後期',
  reiwa: '令和',
  timeless: '時代を超えて',
};

export const STATUS_LABEL: Record<ActiveStatus, string> = {
  active: '現役',
  hiatus: '活動休止中',
  disbanded: '解散',
  deceased: '故人',
};

export const CATEGORY_LABEL: Record<string, string> = {
  comedian_duo: 'コンビ',
  comedian_group: 'グループ',
  comedian_solo: 'ピン・単独',
  rakugo: '落語家',
};
