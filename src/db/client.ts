import { QhazeDatabase } from './database';

/**
 * The application-wide database instance.
 *
 * `autoOpen: false` is a safety requirement: ONLY `bootstrapDatabase()` may open it, because
 * opening runs schema migrations and bootstrap must first take a pre-migration recovery
 * point. Any query issued before bootstrap finishes fails loudly instead of silently
 * upgrading the database.
 */
export const db = new QhazeDatabase(undefined, { autoOpen: false });
