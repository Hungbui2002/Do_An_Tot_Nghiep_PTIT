const poolPromise = require('../database/db.js'); // Đường dẫn tới file cấu hình kết nối
const sql = require('mssql/msnodesqlv8');
 const getAllIngredientsPrices = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT * FROM NguyenLieu
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Lỗi khi tìm nguyên liệu:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy nguyên liệu.' });
    }
};
const getOneIngredientPrice = async (req, res) => {
    const { MaNguyenLieu } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaNguyenLieu', sql.NVarChar, MaNguyenLieu)
            .query(`
                SELECT * FROM NguyenLieu WHERE MaNguyenLieu = @MaNguyenLieu
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nguyên liệu.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Lỗi khi lấy nguyên liệu:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy nguyên liệu.' });
    }
};
const addIngredientPrice = async (req, res) => {
    const { TenNguyenLieu, GiaDonVi, DonVi, MoTa, DieuKienBaoQuan } = req.body;

    try {
        const pool = await poolPromise;

        // Lấy mã giá nguyên liệu cuối cùng trong bảng GiaNguyenLieu
        const lastIngredientPrice = await pool.request()
            .query(`SELECT TOP 1 MaNguyenLieu FROM NguyenLieu ORDER BY MaNguyenLieu DESC`);

        let newMaNguyenLieu = "NguyenLieu001"; // Giá trị mặc định nếu bảng trống

        if (lastIngredientPrice.recordset.length > 0) {
            const lastMaNguyenLieu = lastIngredientPrice.recordset[0].MaNguyenLieu;
            const lastNumber = parseInt(lastMaNguyenLieu.replace(/\D/g, ""), 10); // Lấy phần số từ mã
            const nextNumber = lastNumber + 1;
            newMaNguyenLieu = `NguyenLieu${String(nextNumber).padStart(3, '0')}`; // Đảm bảo 3 chữ số
        }

        // Thêm giá nguyên liệu mới
        await pool.request()
            .input('MaNguyenLieu', sql.NVarChar, newMaNguyenLieu)
            .input('TenNguyenLieu', sql.NVarChar, TenNguyenLieu)
            .input('GiaDonVi', sql.Decimal(10, 2), GiaDonVi)
            .input('DonVi', sql.NVarChar, DonVi)
            .input('MoTa', sql.NVarChar, MoTa)
            .input('DieuKienBaoQuan', sql.NVarChar, DieuKienBaoQuan)
            .query(`
                INSERT INTO NguyenLieu (MaNguyenLieu, TenNguyenLieu, GiaDonVi, DonVi, MoTa, DieuKienBaoQuan)
                VALUES (@MaNguyenLieu, @TenNguyenLieu, @GiaDonVi, @DonVi, @MoTa, @DieuKienBaoQuan)
            `);

        res.status(201).json({ message: 'Đã tạo giá nguyên liệu thành công.', MaNguyenLieu: newMaNguyenLieu });
    } catch (error) {
        console.error('Lỗi khi tạo nguyên liệu', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo nguyên liệu.' });
    }
};

const updateIngredientPrice = async (req, res) => {
    const { MaNguyenLieu } = req.params;
    const { TenNguyenLieu, GiaDonVi, DonVi, MoTa, DieuKienBaoQuan } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaNguyenLieu', sql.NVarChar, MaNguyenLieu)
            .input('TenNguyenLieu', sql.NVarChar, TenNguyenLieu)
            .input('GiaDonVi', sql.Decimal(10, 2), GiaDonVi)
            .input('DonVi', sql.NVarChar, DonVi)
            .input('MoTa', sql.NVarChar, MoTa)
            .input('DieuKienBaoQuan', sql.NVarChar, DieuKienBaoQuan)
            .query(`
                UPDATE NguyenLieu
                SET 
                     
                    TenNguyenLieu = @TenNguyenLieu,
                    GiaDonVi = @GiaDonVi,
                    DonVi = @DonVi,
                    MoTa = @MoTa,
                    DieuKienBaoQuan = @DieuKienBaoQuan,
                    ThoiGianCapNhat = GETDATE()
                WHERE MaNguyenLieu = @MaNguyenLieu
            `);

       

        res.status(200).json({ message: 'Nguyên liệu đã được cập nhật thành công.' });
    } catch (error) {
        console.error('Lỗi khi cập nhật nguyên liệu:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật nguyên liệu.' });
    }
};
const deleteIngredientPrice = async (req, res) => {
    const { MaNguyenLieu } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaNguyenLieu', sql.NVarChar, MaNguyenLieu)
            .query(`
                DELETE FROM NguyenLieu WHERE MaNguyenLieu = @MaNguyenLieu
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nguyên liệu để xóa.' });
        }

        res.status(200).json({ message: 'xóa nguyên liệu thành công' });
    } catch (error) {
        console.error('lỗi khi xóa nguyên liệu', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa nguyên liệu.' });
    }
};
module.exports = {
    deleteIngredientPrice,
    updateIngredientPrice,
    addIngredientPrice,
    getOneIngredientPrice,
    getAllIngredientsPrices,
};