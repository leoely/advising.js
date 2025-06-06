export default function checkCompound(compound) {
  const {
    constructor: {
      name,
    }
  } = compound;
  switch (name) {
    case 'WebThing':
    case 'Thing':
    case 'Cluster':
      break;
    default:
      throw new Error('[Error] The compound type dose not match the expected type.');
  }
}
