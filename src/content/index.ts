import { L } from '@/db/seed/types';
import type { ContentPackage } from '@/db/content/types';
import { GLOSSARY } from './glossary';
import { LUA101_GLOSSARY } from './glossary-lua101';
import { LUA102_GLOSSARY } from './glossary-lua102';
import { LUA103_GLOSSARY } from './glossary-lua103';
import { LUA104_GLOSSARY } from './glossary-lua104';
import { LUAU101_GLOSSARY } from './glossary-luau101';
import { LUA101_M1 } from './lectures/lua101/m1';
import { LUA101_M2 } from './lectures/lua101/m2';
import { LUA101_M3 } from './lectures/lua101/m3';
import { LUA101_M4 } from './lectures/lua101/m4';
import { LUA102_M1 } from './lectures/lua102/m1';
import { LUA102_M2 } from './lectures/lua102/m2';
import { LUA102_M3 } from './lectures/lua102/m3';
import { LUA102_M4 } from './lectures/lua102/m4';
import { LUA103_M1 } from './lectures/lua103/m1';
import { LUA103_M2 } from './lectures/lua103/m2';
import { LUA103_M3 } from './lectures/lua103/m3';
import { LUA103_M4 } from './lectures/lua103/m4';
import { LUA104_M1 } from './lectures/lua104/m1';
import { LUA104_M2 } from './lectures/lua104/m2';
import { LUA104_M3 } from './lectures/lua104/m3';
import { LUA104_M4 } from './lectures/lua104/m4';
import { LUA102_1_1 } from './lectures/lua102-1-1';
import { LUAU203_1_1 } from './lectures/luau203-1-1';
import { LUAU101_M1 } from './lectures/luau101/m1';
import { LUAU101_M2 } from './lectures/luau101/m2';
import { LUAU101_M3 } from './lectures/luau101/m3';
import { LUAU101_M4 } from './lectures/luau101/m4';

/**
 * Course materials for the Lua and Luau academies (Professional Programming Education Standard).
 * 1.0.x: the Click-to-Learn glossary and the two reference lectures (LUA102 1.1, LUAU203 1.1).
 * 1.1.0: all 12 lectures of LUA101 and their glossary terms; the reference lectures gain an
 *        explanation for every example and verified debug variants. Further lectures follow in
 *        later releases (see docs/CURRICULUM.md → content status).
 * 1.2.0: the remaining 11 lectures of LUA102 (LUA102 is complete) and their glossary terms.
 * 1.3.0: all 12 lectures of LUA103 (control flow and Project 2) and their glossary terms.
 * 1.4.0: all 12 lectures of LUA104 (functions and scope) — Lua Semester 1 (LUA101–LUA104) complete.
 * 1.5.0: all 12 lectures of LUAU101 (introduction to Luau and the development environment).
 */
export const LUA_LUAU_CONTENT: ContentPackage = {
  id: 'qhaze-f01-lua-luau-content',
  version: '1.5.0',
  title: L('Bahan Kursus Lua & Luau — Keluaran 6', 'Lua & Luau Course Materials — Release 6'),
  glossary: [...GLOSSARY, ...LUA101_GLOSSARY, ...LUA102_GLOSSARY, ...LUA103_GLOSSARY, ...LUA104_GLOSSARY, ...LUAU101_GLOSSARY],
  lectures: [LUA102_1_1, LUAU203_1_1, ...LUA101_M1, ...LUA101_M2, ...LUA101_M3, ...LUA101_M4, ...LUA102_M1, ...LUA102_M2, ...LUA102_M3, ...LUA102_M4, ...LUA103_M1, ...LUA103_M2, ...LUA103_M3, ...LUA103_M4, ...LUA104_M1, ...LUA104_M2, ...LUA104_M3, ...LUA104_M4, ...LUAU101_M1, ...LUAU101_M2, ...LUAU101_M3, ...LUAU101_M4],
};

export const CONTENT_PACKAGES: ContentPackage[] = [LUA_LUAU_CONTENT];
