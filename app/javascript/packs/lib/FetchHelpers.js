import humps from 'humps';

function headers() {
  return {
    'Accept': '*/*',
    'content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
  };
}

export default {
  checkSuccess(response) {
    if (response.status >= 400) {
      return response.json().then((json) => {
        console.log(json.errors)
      });
    }

    return response;
  },

  toJSON(response) {
    if (response.status === 204) {
      return response;
    }

    return response.json();
  },

  post(url, params) {
    return fetch(url, {
      method: 'post',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify(humps.decamelizeKeys(params)),
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  get(url) {
    return fetch(url, {
      method: 'get',
      headers: headers(),
      credentials: 'same-origin',
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  put(url, params) {
    return fetch(url, {
      method: 'put',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify(humps.decamelizeKeys(params)),
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  patch(url, params) {
    return fetch(url, {
      method: 'PATCH',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify(humps.decamelizeKeys(params)),
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  delete(url) {
    return fetch(url, {
      method: 'delete',
      headers: headers(),
      credentials: 'same-origin',
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },
};
