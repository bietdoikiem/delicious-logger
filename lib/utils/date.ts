namespace DateUtils {
  /**
   * Get current time in ISO Format
   *
   * @returns Current time in ISO Format
   */
  export const nowISO = () => new Date().toISOString();
}

export default DateUtils;
