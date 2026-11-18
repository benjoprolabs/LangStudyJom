import { L } from '@/db/seed/types';
import type { ContentPackage } from '@/db/content/types';
import { GLOSSARY } from './glossary';
import { LUA101_GLOSSARY } from './glossary-lua101';
import { LUA102_GLOSSARY } from './glossary-lua102';
import { LUA101_M1 } from './lectures/lua101/m1';
import { LUA101_M2 } from './lectures/lua101/m2';
import { LUA101_M3 } from './lectures/lua101/m3';
import { LUA101_M4 } from './lectures/lua101/m4';
import { LUA102_M1 } from './lectures/lua102/m1';
import { LUA102_M2 } from './lectures/lua102/m2';
import { LUA102_M3 } from './lectures/lua102/m3';
import { LUA102_M4 } from './lectures/lua102/m4';
import { LUA102_1_1 } from './lectures/lua102-1-1';
import { LUAU203_1_1 } from './lectures/luau203-1-1';

/**
 * Course materials for the Lua and Luau academies (Professional Programming Education Standard).
 * 1.0.x: the Click-to-Learn glossary and the two reference lectures (LUA102 1.1, LUAU203 1.1).
 * 1.1.0: all 12 lectures of LUA101 and their glossary terms; the reference lectures gain an
 *        explanation for every example and verified debug variants. Further lectures follow in
 *        later releases (see docs/CURRICULUM.md → content status).
 * 1.2.0: the remaining 11 lectures of LUA102 (LUA102 is complete) and their glossary terms.
 */
export const LUA_LUAU_CONTENT: ContentPackage = {
  id: 'qhaze-f01-lua-luau-content',
  version: '1.2.0',
  title: L('Bahan Kursus Lua & Luau — Keluaran 3', 'Lua & Luau Course Materials — Release 3'),
  glossary: [...GLOSSARY, ...LUA101_GLOSSARY, ...LUA102_GLOSSARY],
  lectures: [LUA102_1_1, LUAU203_1_1, ...LUA101_M1, ...LUA101_M2, ...LUA101_M3, ...LUA101_M4, ...LUA102_M1, ...LUA102_M2, ...LUA102_M3, ...LUA102_M4],
};

export const CONTENT_PACKAGES: ContentPackage[] = [LUA_LUAU_CONTENT];
