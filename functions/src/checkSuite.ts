import * as admin from 'firebase-admin';

import { WebhookPayload } from './webhookPayload';
import { BranchInfo } from './branchInfo';

export enum CheckSuiteActionType {
  Completed = 'completed',
  Requested = 'requested',
  Rerequested = 'rerequested'
}

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
  action: CheckSuiteActionType;
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

export async function handleCheckSuiteEvent(
  payload: CheckSuitePayload
): Promise<any> {
  const { check_suite, repository, organization } = payload;

  const { name: repositoryName, default_branch } = repository;
  const { login: organizationName } = organization;

  const {
    head_branch: branchName,
    head_commit,
    head_sha,
    updated_at,
    conclusion: checkSuiteStatus
  } = check_suite;

  const branchRef = admin
    .firestore()
    .collection(`branches`)
    .doc(`${repositoryName}-${branchName}`);

  const existingStatus = await branchRef.get();

  let checkSuiteRuns = 0;
  let checkSuiteFailures = 0;

  if (existingStatus.exists) {
    const existingStatusDoc = existingStatus.data() as BranchInfo;
    checkSuiteRuns = existingStatusDoc.checkSuiteRuns;
    checkSuiteFailures = existingStatusDoc.checkSuiteFailures;
  }

  const failure = checkSuiteStatus === 'failure' ? 1 : 0;

  const currentStatus: BranchInfo = {
    repositoryName,
    organizationName,
    branchName,
    head_commit,
    head_sha,
    updated_at,
    checkSuiteRuns: checkSuiteRuns + 1,
    checkSuiteFailures: checkSuiteFailures + failure,
    checkSuiteStatus,
    defaultBranch: default_branch === branchName
  };

  try {
    await admin
      .firestore()
      .collection(`branches`)
      .doc(`${repositoryName}-${branchName}`)
      .set(currentStatus, { merge: true });
  } catch (e) {
    console.error(e);
  }
}
