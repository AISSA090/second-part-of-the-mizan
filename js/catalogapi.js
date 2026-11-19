const BASE_URL = 'http://localhost:3000';

export async function request(path, options = {}) {
  if (!navigator.onLine) {
    throw { message: 'Pas de connexion internet.' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, 8000);

  const method = options.method || 'GET';
  const headers = {};

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions = {
    method: method,
    headers: headers,
    signal: controller.signal,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(BASE_URL + path, fetchOptions);

    if (!response.ok) {
      throw { message: 'Erreur serveur (' + response.status + ')' };
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw { message: 'La requête a pris trop de temps (8s).' };
    }

    if (error.message) {
      throw error;
    }

    throw { message: 'Impossible de contacter le serveur.' };
  } finally {
    clearTimeout(timer);
  }
}

export async function getCatalog() {
  return await request('/items');
}