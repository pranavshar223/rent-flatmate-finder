const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('../../shared/services/EmailService');

class NotificationService {
  /**
   * Log notification to DB
   */
  async _logNotification(data) {
    return prisma.notificationLog.create({
      data: {
        recipientId: data.recipientId,
        eventType: data.eventType,
        channel: data.channel,
        status: data.status,
        subject: data.subject,
        recipientEmail: data.recipientEmail,
        metadata: data.metadata || {},
        sentAt: data.status === 'SENT' ? new Date() : null,
        failedAt: data.status === 'FAILED' ? new Date() : null,
        errorMessage: data.errorMessage || null,
      }
    });
  }

  async _updateLog(logId, updateData) {
    return prisma.notificationLog.update({
      where: { id: logId },
      data: updateData
    });
  }

  /**
   * Generic sender orchestrator
   */
  async _dispatch({ recipientId, recipientEmail, eventType, channel, subject, templateName, templateData }) {
    // 1. Create PENDING log
    const log = await this._logNotification({
      recipientId,
      eventType,
      channel,
      status: 'PENDING',
      subject,
      recipientEmail,
      metadata: templateData
    });

    try {
      if (channel === 'EMAIL') {
        await emailService.sendTemplate(recipientEmail, subject, templateName, templateData);
      } else {
        throw new Error(`Channel ${channel} not supported yet`);
      }

      // 2. Mark SENT
      await this._updateLog(log.id, {
        status: 'SENT',
        sentAt: new Date()
      });
    } catch (error) {
      // 3. Mark FAILED
      await this._updateLog(log.id, {
        status: 'FAILED',
        failedAt: new Date(),
        errorMessage: error.message
      });
      // We log but DO NOT throw error further up to prevent blocking business flow
      console.error(`[NotificationService] Failed to send ${eventType} via ${channel}: ${error.message}`);
    }
  }

  // ==========================================
  // Event Handlers
  // ==========================================

  async sendWelcomeEmail(user) {
    if (!user || !user.email) return;

    await this._dispatch({
      recipientId: user.id,
      recipientEmail: user.email,
      eventType: 'WELCOME_EMAIL',
      channel: 'EMAIL',
      subject: 'Welcome to Rent & Flatmate Finder!',
      templateName: 'welcome',
      templateData: { name: user.name }
    });
  }

  async sendHighMatchAlert(owner, tenant, room, score) {
    if (!owner || !owner.email) return;

    await this._dispatch({
      recipientId: owner.id,
      recipientEmail: owner.email,
      eventType: 'HIGH_MATCH_INTEREST',
      channel: 'EMAIL',
      subject: 'High Match Alert: New Interest in your room!',
      templateName: 'highMatch',
      templateData: {
        ownerName: owner.name,
        tenantName: tenant.name,
        roomTitle: room.title,
        roomId: room.id,
        compatibilityScore: score
      }
    });
  }

  async sendInterestAccepted(tenant, owner, room) {
    if (!tenant || !tenant.email) return;

    await this._dispatch({
      recipientId: tenant.id,
      recipientEmail: tenant.email,
      eventType: 'INTEREST_ACCEPTED',
      channel: 'EMAIL',
      subject: 'Your interest was accepted!',
      templateName: 'accepted',
      templateData: {
        tenantName: tenant.name,
        roomTitle: room.title,
        ownerName: owner.name
      }
    });
  }

  async sendInterestRejected(tenant, room) {
    if (!tenant || !tenant.email) return;

    await this._dispatch({
      recipientId: tenant.id,
      recipientEmail: tenant.email,
      eventType: 'INTEREST_REJECTED',
      channel: 'EMAIL',
      subject: 'Update on your room interest',
      templateName: 'rejected',
      templateData: {
        tenantName: tenant.name,
        roomTitle: room.title
      }
    });
  }
}

module.exports = new NotificationService();
