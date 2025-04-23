export class ThongKeModel {
  constructor(data = {}) {
    this.doanhthu = data.doanhthu || 0;
    this.sodonhang = data.sodonhang || 0;
    this.xephang = data.xephang || "Silver";
    this.start = data.start || null;
    this.end = data.end || null;
    this.lastOrderDate = data.lastOrderDate || null;
    this.inactiveDays = data.inactiveDays || 0;
    this.firstOrderDate = data.firstOrderDate || null;
    this.rewardPoints = data.rewardPoints || 0;
    this.kh = data.kh || null;
  }
}
