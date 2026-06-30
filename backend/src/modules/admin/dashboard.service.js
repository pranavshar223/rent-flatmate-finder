const AnalyticsRepository = require('../../repositories/analytics.repository');

class DashboardService {
  static async getMetrics(adminId) {
    const startTime = Date.now();
    const metrics = await AnalyticsRepository.getDashboardMetrics();
    
    // Log the view action
    await AnalyticsRepository.logAdminAction(adminId, 'VIEW_DASHBOARD', 'SYSTEM', 'METRICS', { duration: Date.now() - startTime });
    
    return metrics;
  }
}

module.exports = DashboardService;
