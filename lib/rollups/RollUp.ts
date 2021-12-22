import IRollUp from './IRollUp';

export default abstract class RollUp implements IRollUp {
  protected originalFile: string;
  protected currentRollIndex: number;

  constructor(originalFile: string) {
    this.originalFile = originalFile;
    this.currentRollIndex = 0;
  }

  /**
   * Rollup current file's content and init new index of file
   */
  abstract roll(): number;

  /**
   * Check if file is ready to be rolled (reach maximum capacity)
   */
  abstract shouldRoll(): boolean;

  /**
   * Get the current roll name (filename)
   */
  abstract getCurrentRoll(): string;
}
