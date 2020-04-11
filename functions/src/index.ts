import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CheckSuitePayload } from './checkSuite';
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const webhook = functions.https.onRequest(async (request, response) => {
  const {
    check_suite,
    repository,
    organization
  } = request.body as CheckSuitePayload;

  const { name: repositoryName, default_branch } = repository;
  const { login: organizationName } = organization;

  const {
    head_branch,
    head_commit,
    head_sha,
    updated_at,
    conclusion
  } = check_suite;

  const currentStatus = {
    repositoryName,
    organizationName,
    head_branch,
    head_commit,
    head_sha,
    updated_at,
    conclusion,
    defaultBranch: default_branch === head_branch
  };

  try {
    await admin
      .firestore()
      .collection(`branches`)
      .doc(head_branch)
      .set(currentStatus);
    return response.status(200).send('Thanks');
  } catch (e) {
    console.error(e);
    return response.status(200).send('Error');
  }
});
