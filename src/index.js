export { default as Router, } from '~/class/Router';
export { default as DistribRouter, } from '~/class/DistribRouter';
export { default as FileRouter, } from '~/class/FileRouter';
export { default as WebRouter, } from '~/class/WebRouter';
export { default as WebDistribRouter, } from '~/class/WebDistribRouter';
export { default as Ipv4Router, } from '~/class/Ipv4Router';
export { default as Ipv6Router, } from '~/class/Ipv6Router';

import WebRouter from '~/class/WebRouter';

const webRouter = new WebRouter({
  debug: true,
  threshold: 0.5,
  number: 4,
  bond: 5,
  dutyCycle: 5,
  logLevel: 7,
  logInterval: 5,
  interception: undefined,
  debug: true,
});
webRouter.attach('/world/male//{belongings}', ['john', 'robert', 'david'], true);
webRouter.gain('/world/male//hat');
webRouter.replace('/world/male//{belongings}', ['jason', 'kevin', 'eric']);
webRouter.gain('/world/male1//hat');
//webRouter.replace('/world/female', ['amani', 'tiffany', 'carolyn']);
