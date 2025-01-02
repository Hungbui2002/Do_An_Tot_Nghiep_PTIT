export interface Step {
  Buoc: string;
  MoTaBuoc: string;
  AnhBuoc: string[];
}

export interface Dish {
  MaMon: string;
  TenMon: string;
  Calo: number;
  DoPhoBien: number;
  Gia: number;
  MoTa: string;
  Anh: string;
  ThoiGianNau: number;
  DoKho: string;
  MaLoaiMon: string;
  ThoiGianCapNhat: string;
  CacBuocLam: Step[];
  TrangThai?: string;
  SoLuongNguoiMua?: number;
}
