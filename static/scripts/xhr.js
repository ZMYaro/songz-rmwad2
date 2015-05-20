'use strict';

/**
 * Perform an asynchronous web request.
 * @param {String} method - The HTTP method (e.g., GET)
 * @param {String} url - The URL to which to send the request
 * @param {String} postData - The data to include with a POST request
 * @param {Function} [successCallback] - The function to which to pass the response JSON
 * @param {Function} [failureCallback] - The function to call should an error occur
 */
function request(method, url, postData, successCallback, failureCallback) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// Parse and pass on the response data.
				if (successCallback) {
					successCallback(JSON.parse(xhr.responseText));
				}
			} else {
				if (failureCallback) {
					try {
						failureCallback(JSON.parse(xhr.responseText));
					} catch (e) {
						failureCallback({code: xhr.status});
					}
				}
			}
		}
	};
	if (method === 'POST' && postData) {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(postData);
	} else {
		xhr.send();
	}
}
