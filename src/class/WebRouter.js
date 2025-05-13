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
  let pathValues = [];
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
  if (url1 === url) {
    pathValues = [];
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
          chars = [];
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

  add(url, content, needPathKeys) {
    if (needPathKeys === true) {
      const [url1, pathKeys] = parsePathKeys(url);
      super.add(url1, content, pathKeys);
    } else {
      super.add(url, content);
    }
    this.debugInfo('successfully added');
  }

  setPathKeys(url) {
    const {
      options: {
        debug,
        logLevel,
      },
    } = this;
    const [url1, pathKeys] = parsePathKeys(url);
    const thing = super.match(url1, true);
    thing.setPathKeys(pathKeys);
    if (logLevel !== 0) {
      this.appendToLog(
        ' || ████ Location:' + url1 + ' ████ & ████ OPERATE:setPathKeys ████ ||\n',
      );
    }
    this.outputOperate('setPathKeys', url);
  }

  match(url, needThing, web) {
    const [url1, queryParams] = parseQueryParams(url);
    const [url2, pathValues] = parsePathValues(url1);
    let pathVariables = {};
    let thing;
    let content;
    if (url2 !== url) {
      thing = super.match(url2, true);
      const { total, } = this;
      content = thing.getContent(total, url2);
      const pathKeys = thing.getPathKeys();
      if (pathValues.length === 0) {
        pathVariables = {};
      } else {
        if (pathKeys.length === pathValues.length) {
          pathVariables = {};
          for (let i = 0; i < pathKeys.length; i += 1) {
            const key = pathKeys[i];
            const value = pathValues[i];
            pathVariables[key] = value;
          }
        } else {
          throw new Error('[Error] Format of the URL is incorrect.');
        }
      }
    } else {
      const multiple = super.match(url, needThing);
      if (needThing === true) {
        thing = multiple;
      } else {
        content = multiple;
      }
    }
    if (needThing === true) {
      if (web === true) {
        return {
          thing,
          queryParams,
          pathVariables,
        };
      } else {
        return thing;
      }
    } else {
      if (web === true) {
        return {
          content,
          queryParams,
          pathVariables,
        };
      } else {
        return content;
      }
    }
    this.debugInfo('successfully matched');
  }
}

export default WebRouter;
