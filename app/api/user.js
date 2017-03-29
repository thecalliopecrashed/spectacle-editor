const parseText = (response) => response.text().then(text => ({ response, text }));

const parseJSON = ({ response, text }) => {
  try {
    return { response, json: JSON.parse(text) };
  } catch (e) {
    // No content is a valid API response
    return { response, json: {} };
  }
};

function postCreds(domain, username, password, csrfToken) {
  return fetch(`${domain}/v2/users/login`, {
    method: "post",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Plotly-Client-Platform": "Python 0.2",
      "X-CSRFToken": csrfToken
    },
    body: JSON.stringify({
      username,
      password
    })
  });
}

export const login = (domain, username, password) => fetch(`${domain}/v2/users/current`, {
  method: "get",
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Plotly-Client-Platform": "Python 0.2"
  }
})
.then(res => res.json())
.then(userInfo => postCreds(domain, username, password, userInfo.csrf_token))
.then(parseText)
.then(parseJSON)
.then(({ response, json }) => {
  if (!response.ok) {
    const errorMessage = Array.isArray(json.errors) ?
      json.errors[0].message :
      "There was a problem logging in, please try again";

    return Promise.reject(errorMessage);
  }

  return json;
});

export const getCurrentUser = (domain) => fetch(`${domain}/v2/users/current`, {
  method: "get",
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Plotly-Client-Platform": "Python 0.2"
  }
})
.then((res) => res.json());
