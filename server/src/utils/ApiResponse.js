/* Consistent success envelope: { success, message, data } */
export function sendSuccess(res, { statusCode = 200, message = 'Operation successful', data = null } = {}) {
  return res.status(statusCode).json({ success: true, message, data });
}
