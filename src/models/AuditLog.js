import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'REGISTER',
      'PASSWORD_RESET_REQUEST',
      'PASSWORD_RESET_COMPLETE',
      'PROFILE_UPDATE',
      'PRODUCT_CREATE',
      'PRODUCT_UPDATE',
      'PRODUCT_DELETE',
      'PRODUCT_BULK_DELETE',
      'PRODUCT_BULK_HIDE',
      'ORDER_CREATE',
      'ORDER_UPDATE',
      'ORDER_CANCEL',
      'USER_CREATE',
      'USER_UPDATE',
      'USER_DELETE',
      'TENANT_REQUEST_APPROVE',
      'TENANT_REQUEST_REJECT',
      'TENANT_SUSPEND',
      'TENANT_UNSUSPEND',
      'UPLOAD_IMAGE',
      'SEND_MESSAGE',
      'ADMIN_ACCESS',
    ],
  },
  resourceType: {
    type: String,
    required: true,
    enum: ['User', 'Product', 'Order', 'Message', 'TenantRequest', 'Auth'],
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resourceType',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  success: {
    type: Boolean,
    default: true,
  },
  errorMessage: {
    type: String,
  },
}, { timestamps: true });

// Index for querying audit logs
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ createdAt: -1 });

// TTL index - auto delete after 1 year (optional, can be removed for compliance)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;