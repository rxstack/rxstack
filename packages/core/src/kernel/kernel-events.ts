/**
 * Kernel Events
 */
export enum KernelEvents {
  // Dispatched when request object is constructed.
  KERNEL_REQUEST = 'kernel.request',
  // Dispatched when response object is returned
  KERNEL_RESPONSE = 'kernel.response',
  // Dispatched when an exception is thrown
  KERNEL_EXCEPTION = 'kernel.exception',
}