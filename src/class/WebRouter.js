import Router from '~/class/Router';

function parsePathKeys(url) {
  let status = 0;
  let chars = [];
  let url1 = url;
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
          url1 = url.substring(0, i);
          break outer;
        } else if (char === '}') {
          status = 1;
        }
        break;
      }
    }
  }
  return [url1, pathKeys];
}

function parsePathValues(url) {
  let status = 0;
  let chars = [];
  let url1 = url;
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
          url1 = url.substring(0 , i);
          break outer;
        } else {
          chars.unshift(char);
          status = 0;
        }
        break;
      }
    }
  }
  return [url1, pathValues];
}

function parseQueryParams(url) {
  let status = 0;
  let chars = [];
  let value;
  let url1 = url;
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
          url1 = url.substring(0, i);
          break outer;
        } else {
          chars.unshift(char);
        }
        break;
      }
    }
  }
  return [url1, queryParams];
}

class WebRouter extends Router {
  constructor(options = {}) {
    super(options);
  }

  add(url, content) {
    const [url1, pathKeys] = parsePathKeys(url);
    super.add(url1, content, pathKeys);
  }

  setPathKeys(url) {
    const [url1, pathKeys] = parsePathKeys(url);
    const thing = super.match(url1, true);
    thing.setPathKeys(pathKeys);
    this.appendToLog(
      ' || ████ Location:' + url1 + ' ████ & ████ OPERATE:setPathKeys ████ ||\n',
    );
  }

  match(url, needThing) {
    const [url1, queryParams] = parseQueryParams(url);
    const [url2, pathValues] = parsePathValues(url1);
    const thing = super.match(url2, true);
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
