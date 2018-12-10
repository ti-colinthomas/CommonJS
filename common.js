/// Operating Modes - v, v2, dev, qa, test
/// v      - Verbose
/// v2     - Verbose level 2
/// dev    - Dev environment credentials, interchangeable with QA or PROD
/// qa     - QA environment credentials, interchangeable with QA or PROD
/// prod   - PROD environment credentials, interchangeable with QA or DEV
/// test   - Uses request parameters defined in requestData.testData. Use with 'dev' mode
const opMode = ["dev", "test", "v"];

/// Define the API endpoints for different environments
var host = () => {
  if (_.findIndex(opMode, (i) => {
      return i === "qa"
    }) > -1) {
    return {
      auth_url: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:8082/gta/" + method;
      },
      leave: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:8082/GTA/lms/v1/" + method;
      },
      omnia: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/API/OMNIA/" + method;
      },
      arcgis: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/api/ArcGIS/" + method;
      },
      oasis: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/API/OasisFM/" + method;
      },
      control: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/control/" + method;
      }
    }
  } else if (_.findIndex(opMode, (i) => {
      return i === "dev"
    }) > -1) {
    return {
      auth_url: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:8082/gta/" + method;
      },
      leave: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:8082/GTA/lms/v1/" + method;
      },
      omnia: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/API/OMNIA/" + method;
      },
      arcgis: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/api/ArcGIS/" + method;
      },
      oasis: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/API/OasisFM/" + method;
      },
      control: (method) => {
        if (method !== undefined)
          return "http://202.151.95.34:3000/control/" + method;
      }
    }
  }
};

/// Structure defining request payload
var requestData = {
  url: "",
  params: {},
  testData: {}
}

/// Save http codes here
var httpCode = 0;


/// Send an email
/// - Parameters
///   - body : The email body to be sent. This can accept html tags for formatting
const emailLog = (body = ``) => {
  Email.send({
    to: ["colin@avaamo.com"],
    from_name: "GTAFS Bot - Avaamo - Logs",
    subject: "GTAFS Logs",
    body: body
  });
};

/// Handle any errors that occur in the service call
/// - Parameters
///   - response : Response received from the service call
const handleErrors = (response) => {
  // Check if request was successful
  if (response.ok) {
    if (_.findIndex(opMode, (i) => {
        return i === "v2"
      }) > -1) {
      console.log(response);
      console.log("\n")
    }
    // Check for HTTP codes
    httpCode = response.status;
    switch (httpCode) {
      case 204:
        return response.text();
        break;
    }
    return response.json();
  } else {
    // Request failed
    console.log("\nResponse not OK");
    if (_.findIndex(opMode, (i) => {
        return i === "v2"
      }) > -1) {
      console.log(response);
      console.log("\n")
    }
  }
}

/// Log response
/// - Parameters
///     - request       : The request parameters
///     - body          : Response body received from the service
///     - type          : The type of HTTP request. i.e. GET,POST,PUT
///     - additionalUri : Any additional query string apart from what is specified in request
const logApiResponse = (request, body, type, additionalUri = "") => {
  if (type === "GET") {
    // Check if bot is in testing mode
    if (_.findIndex(opMode, (i) => {
        return i === "test"
      }) > -1) {
      console.log("\nAPI => " + JSON.stringify({
        "url": request.url + request.testData.queryString(),
        "method": type,
        "response": body
      }));
    } else {
      console.log("\nAPI => " + JSON.stringify({
        "url": request.url + request.params.queryString(),
        "method": type,
        "response": body
      }));
    }
  } else if (type === "PUT" || type === "POST") {
    // Check if bot is in testing mode
    if (_.findIndex(opMode, (i) => {
        return i === "test"
      }) > -1) {
      console.log("\nAPI => " + JSON.stringify({
        "url": request.url + request.testData.uri.queryString() + additionalUri,
        "method": type,
        "args": request.testData.body,
        "response": body
      }));
    } else {
      console.log("\nAPI => " + JSON.stringify({
        "url": request.url + request.params.uri.queryString() + additionalUri,
        "method": type,
        "args": request.params.body,
        "response": body
      }));
    }
  }
}


/// Prototype to construct query string from an object
Object.prototype.queryString = function () {
  let self = this;
  if (Object.keys(this).length) {
    return "?" + Object.keys(this).map(function (key) {
      return key + '=' + self[key]
    }).join('&');
  } else {
    return "";
  }
}

/// Web service request wrapper
///
/// - Methods
///   - get
///   - post
///   - put
const request = {
  /// Post method
  /// - Parameters
  ///   - request : Contains parameter body and query string
  /// - Format
  ///   request {
  ///     url: "",
  ///     params: {
  ///       uri: {},
  ///       body: {}
  ///     },
  ///     testData: {
  ///       uri: {},
  ///       body: {}
  ///     }
  ///   }
  post: (request = {}) => {
    var args = {};
    // Decide to use test data - Use only in testing mode
    if (_.findIndex(opMode, (i) => {
        return i === "test"
      }) > -1) {
      args = request.testData;
    } else {
      args = request.params;
    }
    return fetch(request.url + args.uri.queryString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args.body)
    }).then(handleErrors).then(function (body) {
      if (_.findIndex(opMode, (i) => {
          return i === "v"
        }) > -1) {
        logApiResponse(requestData, body, "POST");
      }
      return body;
    }).catch(function (error) {
      emailLog(error)
      throw error;
    });
  },
  /// Post method
  /// - Parameters
  ///   - request : Contains query string
  /// - Format
  ///   request {
  ///     url: "",
  ///     params: {},
  ///     testData: {}
  ///   }
  get: (request = {}) => {
    var args = {};
    // Decide to use test data - Use only in testing mode
    if (_.findIndex(opMode, (i) => {
        return i === "test"
      }) > -1) {
      args = request.testData;
    } else {
      args = request.params;
    }
    return fetch(request.url + args.queryString(), {
      method: "GET"
    }).then(handleErrors).then(function (body) {
      if (_.findIndex(opMode, (i) => {
          return i === "v"
        }) > -1) {
        logApiResponse(requestData, body, "GET");
      }
      return body;
    }).catch(function (error) {
      emailLog(error)
      throw error;
    });
  },
  /// Post method
  /// - Parameters
  ///   - request : Contains parameter body and query string
  ///   - uri     : Contains query string to be appended to existing query string generated from request
  /// - Format
  ///   request {
  ///     url: "",
  ///     params: {
  ///       uri: {},
  ///       body: {}
  ///     },
  ///     testData: {
  ///       uri: {},
  ///       body: {}
  ///     }
  ///   }
  put: (request = {}, uri = "") => {
    var args = {};
    // Decide to use test data - Use only in testing mode
    if (_.findIndex(opMode, (i) => {
        return i === "test"
      }) > -1) {
      args = request.testData;
    } else {
      args = request.params;
    }
    return fetch(request.url + args.uri.queryString() + uri, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args.body)
    }).then(handleErrors).then(function (body) {
      if (_.findIndex(opMode, (i) => {
          return i === "v"
        }) > -1) {
        logApiResponse(requestData, body, "PUT", uri);
      }
      return body;
    }).catch(function (error) {
      emailLog(error)
      throw error;
    });
  }
}