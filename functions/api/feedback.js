import { handleSubmission } from '../../src/server/submissions.js';
export const onRequest = context => handleSubmission(context, 'feedback');
