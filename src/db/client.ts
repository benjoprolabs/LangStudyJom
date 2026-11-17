import { QhazeDatabase } from './database';

/**
 * The application-wide database instance.
 * It is opened explicitly by `bootstrapDatabase()` before the UI renders.
 */
export const db = new QhazeDatabase();
