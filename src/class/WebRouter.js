import Router from '~/class/Router';
import Webing from '~/class/Webing';

class WebRouter extends Router {
  constructor(options = {}) {
    super(options);
    const {
      getPathsFromLocation,
      getThingClass,
      attach,
      replace,
      exchange,
      revise,
      setPathKeys,
      gain,
      matchInner,
    } = Webing;
    this.getPathsFromLocation = getPathsFromLocation.bind(this);
    this.getThingClass = getThingClass.bind(this);
    this.attach = attach.bind(this);
    this.replace = replace.bind(this);
    this.exchange = exchange.bind(this);
    this.revise = revise.bind(this);
    this.gain = gain.bind(this);
    this.setPathKeys = setPathKeys.bind(this);
    this.matchInner = matchInner.bind(this);
  }
}

export default WebRouter;
