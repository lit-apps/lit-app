/**
 * Util function to use fetch with timeout. 
 * default timeout is 30000 on chrome, which is a problem
 * from : https://dmitripavlutin.com/timeout-fetch-request/
 */

type options = RequestInit & {
  timeout?: number,
  attempt?: number
}

const fetch_timeout = async (resource: RequestInfo, options: options = {}): Promise<Response> => {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

const fetch_retry = (url: RequestInfo, options: options, n: number): Promise<Response> =>
  fetch_timeout(url, options).catch(function (error) {
    if (n === 0) throw error;
    // console.info('ATTEMPT', n, Date.now());
    return fetch_retry(url, options, n - 1);
  });

/**
 * Fetches a resource with a timeout.
 * If the fetch takes longer than the timeout, the fetch will be aborted 
 * and will reject with an error (error.name === 'AbortError').
 * 
 * @param resource - The resource to fetch.
 * @param options - The fetch options.
 * @param options.timeout - The timeout in milliseconds. Default is 8000.
 * @param options.attempt - The number of attempts to make. Default is 2.
 * @returns A Promise that resolves to the Response object.
 */
async function fetchWithTimeout(resource: RequestInfo, options: options = {}): Promise<Response> {
  const { attempt = 2 } = options;
  return fetch_retry(resource, options, attempt)
}
export default fetchWithTimeout
