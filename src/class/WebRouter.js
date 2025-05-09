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
          throw new Error('[Error] There should be a slash line there.');
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
    const [url1, pathKeys] = parsePathKeys(url);
    this.router.add(url1, content, pathKeys);
  }

  delete(url) {
    this.router.delete(url);
  }

  deleteAll(urls) {
    this.router.deleteAll(urls);
  }

  update(url, multiple) {
    this.router.update(url, multiple);
  }

  swap(url1, url2) {
    this.router.swap(url1, url2);
  }

  fix(url, content) {
    this.router.fix(url, content);
  }

  setPathKeys(pathsString, pathKeysString) {
    const thing = this.router.match(pathsString, true);
    const [_, pathKeys] = parsePathKeys(pathKeysString);
    thing.setPathKeys(pathKeys);
  }

  match(url, needThing) {
    const [url1, queryParams] = parseQueryParams(url);
    const [url2, pathValues] = parsePathValues(url1);
    const thing = this.router.match(url2, true);
    const pathKeys = thing.getPathKeys();
    if (pathKeys.length === pathValues.length) {
      const pathVariables = {};
      for (let i = 0; i < pathKeys.length; i += 1) {
        const key = pathKeys[i];
        const value = pathValues[i];
        pathVariables[key] = value;
      }
      if (needThing === true) {
        return {
          thing,
          queryParams,
          pathVariables,
        };
      } else {
        const content = thing.getContent();
        return {
          content,
          queryParams,
          pathVariables,
        };
      }
    } else {
      throw new Error('[Error] Format of the URL is incorrect.');
    }
  }
}

export default WebRouter;
