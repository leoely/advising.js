import Router from '~/class/Router';

function getPathsFromIntegerString(integerString) {
  const paths = [];
  paths.push(integerString);
  return paths;
}

class IntegerRouter extends Router {
  constructor(options = {}) {
    super(options);
    this.separator = '';
  }

  getPathsFromLocation(location) {
    const integerString = location;
    return getPathsFromIntegerString(integerString);
  }
}

export default IntegerRouter;
