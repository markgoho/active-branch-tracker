import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { CheckSuitePayload, handleCheckSuiteEvent } from './checkSuite';
import { CreateEventPayload, handleCreateEvent } from './createEvent';
import { DeleteEventPayload, handleDeleteEvent } from './deleteEvent';
import { handleCheckRunEvent, CheckRunPayload } from './checkRun';

admin.initializeApp();

export const webhook = functions.https.onRequest(async (request, response) => {
  const eventType = request.header('X-Github-Event');

  console.log({ eventType });

  switch (eventType) {
    case 'create':
      await handleCreateEvent(request.body as CreateEventPayload);
      break;

    case 'delete':
      await handleDeleteEvent(request.body as DeleteEventPayload);
      break;

    case 'check_suite':
      await handleCheckSuiteEvent(request.body as CheckSuitePayload);
      break;

    case 'check_run':
      await handleCheckRunEvent(request.body as CheckRunPayload);
      break;
  }

  return response.status(200).send('Thanks');
});
