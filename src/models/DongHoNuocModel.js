export class DongHoNuocModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.chisocu = data.chisocu || 0;
    this.chisomoi = data.chisomoi || 0;
    this.canho_id = data.canho_id || null;
  }

  getTieuThu() {
    return this.chisomoi - this.chisocu;
  }
}
