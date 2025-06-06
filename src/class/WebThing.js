import Thing from '~/class/Thing';

class WebThing extends Thing {
  constructor(options, content, pathKeys) {
    super(options, content);
    this.setPathKeys(pathKeys);
    this.checkMemory();
    this.debugInfo('was created successfully');
  }

  setPathKeys(pathKeys) {
    if (pathKeys !== undefined) {
      if (!Array.isArray(pathKeys)) {
        delete this.pathKeys;
      } else {
        this.pathKeys = pathKeys;
        this.debugInfo('set path keys successfully');
      }
    }
  }

  getPathKeys() {
    const { pathKeys, } = this;
    if (pathKeys !== undefined) {
      return pathKeys;
    } else {
      throw new Error('[Error] Unable to get path keys because it is not set.');
    }
  }
}

export default WebThing;
