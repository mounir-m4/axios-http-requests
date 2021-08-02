// AXIOS GLOBALS
axios.defaults.headers.common['X-Authorization-Token'] =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// GET REQUEST
function getTodos() {
  // both methods are working
  //   axios({
  //     method: 'get',
  //     url: 'https://jsonplaceholder.typicode.com/todos',
  //     params: {
  //       _limit: 5,
  //     },
  //   })
  //     .then((res) => console.log(res))
  //     .error((err) => console.log(err));

  // Shorter way
  axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5', {
      timeout: 500,
    })
    .then(res => showOutput(res))
    .catch(err => showOutput(err));
}

// POST REQUEST
function addTodo() {
  axios
    .post('https://jsonplaceholder.typicode.com/todos', {
      title: 'new todo',
      completed: false,
    })
    .then(res => showOutput(res))
    .catch(err => console.log(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
  axios
    .patch('https://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated todo',
      completed: false,
    })
    .then(res => showOutput(res))
    .catch(err => console.log(err));
}
//  PUT & PATCH
//     PUT: replace the whole data on id based an include the inserted ones
//     Patch: upddate cetain data based on it's id

// DELETE REQUEST
function removeTodo() {
  axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.log(err));
}

// SIMULTANEOUS DATA
// handle multi request insted of doing in in classial way (.then().then()..etc)
function getData() {
  axios
    .all([
      axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
      axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5'),
    ])
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch(err => console.log(err));
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'sometokenidk ',
    },
  };
  axios
    .post(
      'https://jsonplaceholder.typicode.com/todos',
      {
        title: 'new todo',
        completed: false,
      },
      config
    )
    .then(res => showOutput(res))
    .catch(err => console.log(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'hello world',
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };
  axios(options).then(res => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get('https://jsonplaceholder.typicode.com/todoss', {
      //   validateStatus: function (status) {
      //     return status > 500; // reject if the status is greater or equal to 500
      //   },
    })
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // Server responded with a status othen than 200 range (error)
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        // alert('Error: Page not found');
      } else if (err.request) {
        // Request was made but no response
        console.log(err.request);
      } else {
        console.log(err.message);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();
  axios
    .get('https://jsonplaceholder.typicode.com/todos', {
      cancelToken: source.token,
    })
    .then(res => showOutput(res))
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      }
    });
  // for some reason if u wanna cancel the request use the code below
  //   if (true) {
  //     source.cancel('request Canceled !');
  //   }
}

// AXIOS INSTANCE
const axiosInstance = axios.create({
  // other custon settings
  baseURL: 'https://jsonplaceholder.typicode.com',
});
// uncommenting the code bellow will call the comments as soon as the page loads !
//axiosInstance.get('/comments?_limit=5').then((res) => showOutput(res));

// INTERCEPTING REQUESTS & RESPONSES
let today = new Date().toISOString().slice(0, 10);
axios.interceptors.request.use(
  config => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${config.url} at ${today}`
    );
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
