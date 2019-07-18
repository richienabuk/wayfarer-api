export const success = data => ({ status: 'success', data });

export const error = msg => ({ status: 'error', error: msg });
