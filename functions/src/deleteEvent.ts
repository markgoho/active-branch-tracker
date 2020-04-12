import * as admin from 'firebase-admin';
import { Repository, Sender, Organization } from './webhookPayload';

export interface DeleteEventPayload {
  ref: string; // branch name
  ref_type: 'branch' | 'tag'; // type of thing that got deleted
  pusher_type: string;
  repository: Repository;
  organization: Organization;
  sender: Sender;
}

export async function handleDeleteEvent(
  payload: DeleteEventPayload
): Promise<any> {
  const { ref, repository } = payload;

  const { name: repositoryName } = repository;

  const branchRef = admin
    .firestore()
    .collection('branches')
    .doc(`${repositoryName}-${ref}`);

  try {
    await branchRef.delete();
  } catch (e) {
    console.error(e);
  }
}
