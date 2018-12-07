import axios from 'axios';

var network = {};
const url = '/api/v1';

var instance = axios.create();

instance.defaults.headers.common['Authorization'] = localStorage.getItem('token');

/**
 * Post
 */
function post(location, resource, callback) {
  instance
    .post(url + location, resource)
    .then(function(response) {
      callback(response);
    })
    .catch(function(error) {
      callback(error.response);
    });
}
network.post = post;

/**
 * Put/update
 */
function put(location, resource, callback) {
  // categories updates an array.
  var putUrl = resource._id ? `${url}${location}/${resource._id}` : `${url}${location}`;
  instance
    .put(putUrl, resource)
    .then(function(response) {
      callback(response);
    })
    .catch(function(error) {
      callback(error.response);
    });
}
network.put = put;

/**
 * Get
 */
function get(location, callback, id) {
  const getUrl = id ? `${url}${location}/${id}` : url + location;
  instance
    .get(getUrl)
    .then(function(response) {
      callback(response);
    })
    .catch(function(error) {
      callback(error.response);
    });
}
network.get = get;

/**
 * Delete
 */
function deleteResource(location, callback, id) {
  instance
    .delete(`${url}${location}/${id}`)
    .then(function(response) {
      callback(response);
    })
    .catch(function(error) {
      callback(error.response);
    });
}
network.delete = deleteResource;

export default network;
