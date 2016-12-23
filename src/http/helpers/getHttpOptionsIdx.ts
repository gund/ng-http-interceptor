/**
 * @description  
 * Gets index of {@link RequestOptions} in http data array for specified `method`.
 * @param method - Http method
 */
export function getHttpOptionsIdx(method: string): number {
  switch (method) {
    case 'post':
    case 'put':
    case 'patch':
      return 2;
    default:
      return 1;
  }
}
