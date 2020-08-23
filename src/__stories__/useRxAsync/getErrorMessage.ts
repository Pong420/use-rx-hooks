export function getErrorMessage(error: any): string {
  if (error.response) {
    const { data } = error.response;
    if (typeof data === 'string') {
      return error.response.statusText;
    }
    const { message } = data;
    return Array.isArray(message) ? message[0] : message;
  }

  if (error instanceof Error || 'message' in error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown';
}
