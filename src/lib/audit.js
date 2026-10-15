import AuditLog from '@/models/AuditLog';
import dbConnect from '@/lib/mongodb';

/**
 * Log an audit event
 * @param {Object} params - Audit log parameters
 * @param {string} params.userId - User ID performing the action
 * @param {string} params.userEmail - User email
 * @param {string} params.userRole - User role
 * @param {string} params.action - Action performed (from enum)
 * @param {string} params.resourceType - Resource type (User, Product, Order, etc.)
 * @param {string} [params.resourceId] - Resource ID
 * @param {Object} [params.details] - Additional details
 * @param {string} [params.ipAddress] - Client IP address
 * @param {string} [params.userAgent] - Client user agent
 * @param {boolean} [params.success=true] - Whether action succeeded
 * @param {string} [params.errorMessage] - Error message if failed
 */
export async function logAuditEvent(params) {
  try {
    await dbConnect();
    
    const auditLog = new AuditLog({
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      success: params.success !== false,
      errorMessage: params.errorMessage,
    });
    
    await auditLog.save();
    return auditLog;
  } catch (error) {
    // Don't throw - audit logging should never break the main flow
    console.error('Audit log failed:', error);
    return null;
  }
}

/**
 * Extract client info from request headers
 */
export function getClientInfo(request) {
  const headers = request.headers;
  const ipAddress = headers.get('x-forwarded-for') || 
                    headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = headers.get('user-agent') || 'unknown';
  return { ipAddress, userAgent };
}

export default { logAuditEvent, getClientInfo };