/**
 * Formats the URL so as to provide values for the its dynamic sections or
 * query strings. <br>
 * **Example**: `formatUrl("http://www.mydomain.com/{id}/{name}", {"query":"query_value"}, {id:1234, name:"name_value"})`
 * will return `http://www.mydomain.com/1234/name_value?query=query_value`
 * @param {String} endpoint The endpoint url
 * @param {Object} queryStrings Object containing the query string parameters
 * @param {Object} dynamicContent Object containing the values for the dynamic parts of the url
 */
export function formatUrl(endpoint, queryStrings, dynamicContent) {
  let qs = "";
  queryStrings = queryStrings ? queryStrings : {};
  dynamicContent = dynamicContent ? dynamicContent : {};

  Object.keys(queryStrings).forEach(key => {
    if (queryStrings.hasOwnProperty(key)) {
      qs = qs + `${qs.length > 0 ? "&" : ""}` + key + "=" + queryStrings[key];
    }
  });

  Object.keys(dynamicContent).forEach(key => {
    if (dynamicContent.hasOwnProperty(key)) {
      const re = RegExp(`{${key}}`);
      endpoint = endpoint.replace(re, dynamicContent[key]);
    }
  });

  if (qs.length > 0) {
    endpoint = endpoint + "?" + qs;
  }

  return endpoint;
}

/**
 * Combines all the reducers into one. This helper method helps
 * write efficient reducers which do not need long switch statements.
 * The keys of the objects are the actions to be dispatched to the mapped
 * reducer.
 * @param {object} initialState The initial state of the store
 * @param {object} reducerMap An object of reducers
 */
export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer ? reducer(state, action.payload) : state;
  };
}


/**
 * Switches the position of an element in an array
 * @param {Array} arr
 * @param {number} old_index
 * @param {number} new_index
 */
export function arrayMove(arr, old_index, new_index, mutate = false) {
  if (!mutate) {
      arr = JSON.parse(JSON.stringify(arr));
  }
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}