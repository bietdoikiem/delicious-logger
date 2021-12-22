import { statSync } from 'fs';
import FileUtils from '../utils/file';
import RollUp from './RollUp';

export default class SizeRollUp extends RollUp {
  protected rollSize: number;

  constructor(originalFile: string, rollSize: number) {
    super(originalFile);
    this.rollSize = rollSize;
  }

  /**
   * Init a new roll
   *
   * @returns New roll index
   */
  roll() {
    return ++this.currentRollIndex;
  }

  /**
   * Get current roll filename
   *
   * @returns Roll's filename
   */
  getCurrentRoll(): string {
    return this.currentRollIndex === 0
      ? this.originalFile
      : `${this.originalFile}.${this.currentRollIndex}`;
  }

  /**
   * Check if current roll is (full) ready to be rolled up
   *
   * @param index Index of roll
   * @returns True if ready || False if not
   */
  shouldRoll() {
    // Check original file existence
    if (!FileUtils.exists(this.originalFile)) return false;
    const file = this.getCurrentRoll();
    const { size: currentSize } = statSync(file);
    return currentSize >= this.rollSize;
  }
}
