import * as admin from 'firebase-admin';

import { Repository, Organization, Sender } from './webhookPayload';
import { BranchInfo } from './branchInfo';
import { CheckSuiteConclusion } from './checkSuite';

export interface CreateEventPayload {
  ref: string; // name of thing that got created
  ref_type: 'branch' | 'tag'; // type of thing that got created
  master_branch: string;
  description: any;
  pusher_type: 'user';
  repository: Repository;
  organization: Organization;
  sender: Sender;
}

export async function handleCreateEvent(
  payload: CreateEventPayload
): Promise<any> {
  const { ref: branchName, repository, organization, sender } = payload;

  const { login: createdBy } = sender;
  const { name: repositoryName } = repository;
  const { login: organizationName } = organization;

  const branchRef = admin
    .firestore()
    .collection('branches')
    .doc(`${repositoryName}-${branchName}`);

  const branchInfo: BranchInfo = {
    repositoryName,
    organizationName,
    branchName,
    defaultBranch: false,
    created_at: new Date().toISOString(),
    checkSuiteRuns: 0,
    checkSuiteFailures: 0,
    checkSuiteStatus: CheckSuiteConclusion.Neutral,
    createdBy
  };

  try {
    await branchRef.create(branchInfo);
  } catch (e) {
    console.error(e);
  }
}