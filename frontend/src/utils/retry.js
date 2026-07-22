export async function retryRequest(apiCall, retries = 3) {

  let lastError;

  for (let i = 0; i < retries; i++) {

    try {

      return await apiCall();

    } catch (err) {

      lastError = err;

    }

  }

  throw lastError;

}