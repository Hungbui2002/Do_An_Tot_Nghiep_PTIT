const poolPromise = require('../database/db.js'); // Đường dẫn tới file cấu hình kết nối
const sql = require('mssql/msnodesqlv8');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getInvoicesByCustomer = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Lấy MaKhachHang từ params
        const maKhachHang = req.params.MaKhachHang;
        if (!maKhachHang) {
            return res.status(400).json({ error: 'Vui lòng cung cấp mã khách hàng (MaKhachHang).' });
        }

        // Truy vấn danh sách hóa đơn theo mã khách hàng
        const result = await pool
            .request()
            .input('MaKhachHang', maKhachHang)
            .query(`
                SELECT 
                    hd.MaHoaDon,
                    hd.NgayMua,
                    hd.PhuongThucThanhToan,
                    ma.TenMon,
                    ma.Gia
                    
                FROM HoaDon hd
                INNER JOIN MonAn ma ON hd.MaMon = ma.MaMon
                WHERE hd.MaKhachHang = @MaKhachHang
                ORDER BY hd.NgayMua DESC
            `);

        const invoices = result.recordset;

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy hóa đơn nào cho khách hàng này.' });
        }

        // Gửi danh sách hóa đơn về phía client
        res.status(200).json({
            MaKhachHang: maKhachHang,
            invoices,
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách hóa đơn:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách hóa đơn.' });
        }
    }
};

const getAllInvoicesByCustomer = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Lấy MaKhachHang từ params
        

        // Truy vấn danh sách hóa đơn theo mã khách hàng
        const result = await pool
            .request()
            
            .query(`
                SELECT 
                    hd.MaHoaDon,
                    hd.NgayMua,
                    hd.MaKhachHang,
                    kh.HoTen, -- Lấy thêm tên khách hàng
                    hd.PhuongThucThanhToan,
                    ma.TenMon,
                    ma.Gia
                FROM HoaDon hd
                INNER JOIN MonAn ma ON hd.MaMon = ma.MaMon
                INNER JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang -- JOIN với bảng KhachHang
                ORDER BY hd.NgayMua DESC;
            `);

        const invoices = result.recordset;

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy hóa đơn nào.' });
        }

        // Gửi danh sách hóa đơn về phía client
        res.status(200).json(
            
            invoices
        );
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách hóa đơn:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách hóa đơn.' });
        }
    }
};

module.exports = {
    getAllInvoicesByCustomer,
    
    getInvoicesByCustomer
};