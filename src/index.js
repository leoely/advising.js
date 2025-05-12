import WebRouter from '~/class/WebRouter';

const webRouter = new WebRouter({
  threshold: 0.5,
  number: 1,
  bond: 5,
  dutyCycle: 5,
  logLevel: 0,
  logInterval: 5,
  debug: true,
  interception: undefined,
});
webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc'], true);
webRouter.match('/movie/action//1/1?k1=v1&k2=v2', false, true, true);
webRouter.setPathKeys('/movie/action//{start}/{end}');
webRouter.delete('/movie/action');
