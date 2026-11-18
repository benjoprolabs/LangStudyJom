import { L } from '@/db/seed/types';
import type { ContentPackage } from '@/db/content/types';
import { GLOSSARY } from './glossary';
import { LUA102_1_1 } from './lectures/lua102-1-1';
import { LUAU203_1_1 } from './lectures/luau203-1-1';

/**
 * Course materials for the Lua and Luau academies (Professional Programming Education Standard).
 * v1.0.0 delivers the Click-to-Learn glossary and the first fully authored pilot lectures; further
 * lectures are added in later content releases (see docs/CURRICULUM.md → content status).
 */
export const LUA_LUAU_CONTENT: ContentPackage = {
  id: 'qhaze-f01-lua-luau-content',
  version: '1.0.1',
  title: L('Bahan Kursus Lua & Luau — Keluaran 1', 'Lua & Luau Course Materials — Release 1'),
  glossary: GLOSSARY,
  lectures: [LUA102_1_1, LUAU203_1_1],
};

export const CONTENT_PACKAGES: ContentPackage[] = [LUA_LUAU_CONTENT];
