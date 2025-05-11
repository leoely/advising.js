import WebRouter from '~/class/WebRouter';

const webRouter = new WebRouter({
  threshold: 0.5,
  number: 1,
  bond: 5,
  dutyCycle: 5,
  logLevel: 7,
  logInterval: 5,
  debug: true,
  interception: undefined,
});
