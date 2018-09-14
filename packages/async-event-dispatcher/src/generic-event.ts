
/**
 * GenericEvent is the base class for classes containing event data.
 */
export class GenericEvent {

  /**
   * Whether no further event listeners should be triggered.
   *
   * @type {boolean}
   */
  private propagationStopped = false;

  /**
   * Returns whether further event listeners should be triggered.
   *
   * @returns {boolean}
   */
  public isPropagationStopped(): boolean {
    return this.propagationStopped;
  }

  /**
   * Stops the propagation of the event to further event listeners.
   *
   * If multiple event listeners are connected to the same event, no
   * further event listener will be triggered once any trigger calls
   * stopPropagation().
   */
  public stopPropagation(): void {
    this.propagationStopped = true;
  }
}