let form = document.querySelector('form');
let field = document.querySelector('.field');
let addAuth = document.querySelector('.add-auth');
let email = document.querySelector('.auth-email');
let api_token = document.querySelector('.auth-api_token');
let endpoint = document.querySelector('.endpoint');
let submit = document.querySelector('form input[type=submit]');
let deleteSpan = document.querySelector('form span');
let response = document.querySelector('#response');

let data = {
  email: 'email',
  api_token: 'api_token',
  endpoint: 'test'
};

function getPrevElement(node) {
  return node.previousElementSibling;
}

function addValue(target, value) {
  let newVal = target.textContent.split(':');

  if (newVal.length > 2) {
    newVal.pop(2);
  }

  newVal[0] += ':';
  newVal[1] = ' ' + value;
  target.textContent = newVal.join('');
}

function getAuth(encode = true) {
  let fullAuth = data.email + ':' + data.api_token;
  if (encode) {
    return btoa(fullAuth);
  }
  return fullAuth;
}

function getBody() {
  let allFields = document.querySelectorAll('form .field input');
  let data = [];
  allFields.forEach(function(field) {
    data.push(field.name + '=' + field.value);
  });

  return data.join('&');
}

function addEndpoint() {
  let input = getPrevElement(endpoint);
  addValue(getPrevElement(input), input.value);
  data.endpoint = input.value;
}

function addField() {
  let newField = getPrevElement(field);
  let span = document.createElement('span');
  span.addEventListener('click', deleteField);
  span.classList.add('deleteField');
  span.innerHTML = '&#10008;';

  let label = document.createElement('label');
  label.textContent = newField.value + ':';

  let input = document.createElement('input');
  input.setAttribute('placeholder', newField.value);
  input.setAttribute('name', newField.value);

  let div = document.createElement('div');
  div.classList.add('field');
  div.appendChild(span);
  div.appendChild(label);
  div.appendChild(input);

  form.insertBefore(div, submit);
}

function deleteField() {
  form.removeChild(this.parentElement);
}

function addAuthorization() {
  data.email = email.value;
  data.api_token = api_token.value;
  addValue(getPrevElement(email), getAuth(false));
}

function handleForm(event) {
  let url = location.href + data.endpoint;
  let authorization = 'Basic ' + getAuth();
  let requestHeaders = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  // in authorization is empty it would be
  // encoding `:` so would return `Basic Og==`
  // and so only add Authorization if provided
  if (authorization !== 'Basic Og==') {
    requestHeaders.append('Authorization', authorization);
  }

  let request = new Request(url, {
    method: 'POST',
    redirect: 'follow',
    body: getBody(),
    headers: requestHeaders
  });

  fetch(request)
    .then(function(response) {
      return response.text();
    })
    .then(function(rawHTML) {
      response.innerHTML = rawHTML;
    })
    .catch(function(err) {
      response.innerHTML = 'We got an error';
      response.innerHTML += err;
      response.innerHTM += '* See devtools for more info';
    });

  event.preventDefault();
}

deleteSpan.addEventListener('click', deleteField);
field.addEventListener('click', addField);
form.addEventListener('submit', handleForm);
endpoint.addEventListener('click', addEndpoint);
addAuth.addEventListener('click', addAuthorization);
