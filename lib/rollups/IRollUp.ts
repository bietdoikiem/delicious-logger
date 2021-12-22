export default interface IRollUp {
  roll: () => number;
  getCurrentRoll: () => string;
  shouldRoll: () => boolean;
}
