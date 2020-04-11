import { WebhookPayload } from './webhookPayload';
import { ActionType } from './actionType';

export enum CheckSuiteStatus {
  Requested = 'requested',
  InProgress = 'in_progress',
  Completed = 'completed'
}

export enum CheckSuiteConclusion {
  Success = 'success',
  Failure = 'failure',
  Neutral = 'neutral',
  Cancelled = 'cancelled',
  TimedOut = 'timed_out',
  ActionRequired = 'action_required',
  Stale = 'stale'
}

export interface CheckSuitePayload extends WebhookPayload {
  action: ActionType;
  check_suite: {
    id: number;
    node_id: string;
    head_branch: string;
    head_sha: string;
    status: CheckSuiteStatus;
    conclusion: CheckSuiteConclusion;
    url: string;
    before: string;
    after: string;
    pull_requests: any[];
    app: {
      id: number;
      slug: string;
      node_id: string;
      owner: any;
      name: string;
      description: string;
      external_url: string;
      html_url: string;
      created_at: string;
      updated_at: string;
      permissions: any;
      events: string[];
    };
    created_at: string;
    updated_at: string;
    latest_check_runs_count: number;
    check_runs_url: string;
    head_commit: {
      id: string;
      tree_id: string;
      message: string;
      timestamp: string;
      author: {
        name: string;
        email: string;
      };
      committer: {
        name: string;
        email: string;
      };
    };
  };
}
