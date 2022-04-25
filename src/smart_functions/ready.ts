import { Client } from '../Client';
import { completeAuth } from './completeAuth';

/**
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */

export async function ready(onSuccess?: (client: Client) => any, onError?: (error: Error) => any): Promise<Client> {
  let task = completeAuth();
  if (onSuccess) {
    task = task.then(onSuccess);
  }
  if (onError) {
    task = task.catch(onError);
  }
  return task;
}
