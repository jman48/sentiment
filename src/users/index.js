import makeDebug from "debug";
import { map } from 'ramda';
import db from "../db";
import { processSources } from "../sources";

const debug = makeDebug("sentiment:users/index.js");

export async function processUsers() {
  try {
    const allUsers = await db("users").where({ enabled: true });

    debug(`Processing ${allUsers.length} users`);

    const processUsersPromise = map(({ id }) => processSources(id), allUsers);
    await Promise.all(processUsersPromise);
  } catch (error) {
    debug('An error has occurred trying to process users: ', error)
  }
}
