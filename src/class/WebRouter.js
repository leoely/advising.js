import Router from '~/class/Router';

function parsePathKeys(url) {
  let status = 0;
  let chars = [];
  let remainUrl = url;
  const pathKeys = [];
  outer: for (let i = url.length - 1; i >= 0; i -= 1) {
    const char = url.charAt(i);
    switch (status) {
      case 0: {
        if (char === '}') {
          status = 1;
        } else {
          break outer;
        }
        break;
      }
      case 1: {
        if (char === '{') {
          status = 2;
        } else {
          chars.unshift(char);
        }
        break;
      }
      case 2: {
        if (char === '/') {
          const pathKey = chars.join('')
          pathKeys.unshift(pathKey);
          chars = [];
          status = 3;
        } else {
          throw ;
        }
        break;
      }
      case 3: {
        if (char === '/') {
          remainUrl = url.substring(0, i);
          break outer;
        } else if (char === '}') {
          status = 1;
        }
        break;
      }
    }
  }
  return [remainUrl, pathKeys];
}

function parsePathValues(url) {
  let status = 0;
  let chars = [];
  let remainUrl = url;
  const pathValues = [];
  outer: for (let i = url.length - 1; i >= 0; i -= 1) {
    const char = url.charAt(i);
    switch (status) {
      case 0: {
        if (char === '/') {
          pathValues.unshift(chars.join(''));
          chars = [];
          status = 1;
        } else {
          chars.unshift(char);
        }
        break;
      }
      case 1: {
        if (char === '/') {
          remainUrl = url.substring(0 , i);
          break outer;
        } else {
          chars.unshift(char);
          status = 0;
        }
        break;
      }
    }
  }
  return [remainUrl, pathValues];
}

function parseQueryParams(url) {
  let status = 0;
  let chars = [];
  let value;
  let restUrl = url;
  const queryParams = {};
  outer: for (let i = url.length - 1; i >= 0; i -= 1) {
    const char = url.charAt(i);
    switch (status) {
      case 0: {
        if (char === '=') {
          value = chars.join('');
          chars = [];
          status = 1;
        } else if (char === '/') {
          break outer;
        } else {
          chars.unshift(char);
        }
        break;
      }
      case 1: {
        if (char === '&') {
          queryParams[chars.join('')] = value;
          status = 0;
        } else if (char === '?') {
          queryParams[chars.join('')] = value;
          restUrl = url.substring(0, i);
          break outer;
        } else {
          chars.unshift(char);
        }
        break;
      }
    }
  }
  return [restUrl, queryParams];
}

class WebRouter {
  constructor(options = {}) {
    this.router = new Router(options);
  }

  add(url, content) {
    const [remainUrl, pathKeys] = parsePathKeys(url);
    this.router.add(remainUrl, content, pathKeys);
  }

  match(url) {
    const [restUrl, queryParams] = parseQueryParams(url);
    const [remainUrl, pathValues] = parsePathValues(restUrl);
    const { router, } = this;
    const thing = router.match(remainUrl, true);
    const content = thing.getContent();
    const { pathKeys, } = thing;
    const pathVariables = {};
    if (pathKeys.length === pathValues.length) {
      for (let i = 0; i < pathKeys.length; i += 1) {
        const key = pathKeys[i];
        const value = pathValues[i];
        pathVariables[key] = value;
      }
    } else {
      throw new Error('[Error] Format of the URL is incorrect.');
    }
    return {
      content,
      queryParams,
      pathVariables,
    };
  }
}

export default WebRouter;
