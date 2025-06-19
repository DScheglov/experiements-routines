import { authorize } from '../custom-middlewares/auth';
import { json } from '../routines/responses';

export const authorizeIf = authorize(
  () => json(403, { success: false, error: 'Forbidden' }),
  () => json(401, { success: false, error: 'Unauthorized' }),
);
