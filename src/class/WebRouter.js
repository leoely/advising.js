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

function getPathsFromUrl(url) {
  if (typeof url !== 'string') {
    throw new Error('[Error] Path type must be a string.');
  } else {
    if (url === '/') {
      throw new Error('[Error] Unable to operate the root path.');
    }
  }
  if (url.charAt(0) !== '/') {
    throw new Error('[Error] Path should start with a slash.');;
  }
  const paths = url.split('/');
  return paths.slice(1, paths.length);
}

class WebRouter extends Router {
  constructor(options = {}) {
    super(options);
  }

  attach(url, content) {
    const [url1, pathKeys] = parsePathKeys(url);
    if (url1 === url) {
      const paths = getPathsFromUrl(url);
      super.add(url, paths, content);
    } else {
      const paths = getPathsFromUrl(url1);
      super.add(url, paths, content, pathKeys);
    }
  }

  ruin(url) {
    const paths = getPathsFromUrl(url);
    super.delete(url, paths);
  }

  ruinAll(urls) {
    const paramArray = urls.map((url) => {
      return [url, getPathsFromUrl(url)];
    });
    super.deleteAll(paramArray);
  }

  replace(url, multiple) {
    const [url1, pathKeys] = parsePathKeys(url);
    if (url1 === url) {
      const paths = getPathsFromUrl(url);
      super.update(url, paths, multiple);
    } else {
      const paths1 = getPathsFromUrl(url1);
      super.update(url1, paths1, multiple, pathKeys);
    }
  }

  switch(url1, url2) {
    const paths1 = getPathsFromUrl(url1);
    const paths2 = getPathsFromUrl(url2);
    super.swap(url1, url2, paths1, paths2);
  }

  revise(url, content) {
    const paths = getPathsFromUrl(url);
    super.fix(url, paths, content);
  }

  setPathKeys(url) {
    const {
      options: {
        debug,
        logLevel,
      },
    } = this;
    const [url1, pathKeys] = parsePathKeys(url);
    const paths1 = getPathsFromUrl(url1);
    const thing = super.match(url1, paths1, true);
    thing.setPathKeys(pathKeys);
    if (logLevel !== 0) {
      this.appendToLog(
        ' || ████ Location:' + url1 + ' ████ & ████ OPERATE:setPathKeys ████ ||\n',
      );
    }
    this.outputOperate('setPathKeys', url);
  }

  gain(url) {
    return this.matchInner(url, false, true);
  }

  matchInner(url, needThing, web) {
    const [url1, queryParams] = parseQueryParams(url);
    const [url2, pathValues] = parsePathValues(url1);
    let pathVariables = {};
    let thing;
    let content;
    if (url2 !== url) {
      const paths2 = getPathsFromUrl(url2);
      thing = super.match(url2, paths2, true, true);
      if (needThing !== true) {
        const { total, } = this;
        content = thing.getContent(total, url2);
      }
      if (pathValues.length === 0) {
        pathVariables = {};
      } else {
        const pathKeys = thing.getPathKeys();
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
      const paths = getPathsFromUrl(url);
      const multiple = super.match(url, paths, needThing);
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
  }
}

export default WebRouter;
