import { WebhookPayload } from './webhookPayload';

export interface CheckRun extends WebhookPayload {
  action: string;
}
