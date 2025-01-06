const poolPromise = require('../database/db.js'); // Đường dẫn tới file cấu hình kết nối
const sql = require('mssql/msnodesqlv8');
 
const createIngredient = async (req, res) => {
    const { MaMon, MaGiaNguyenLieu, KhoiLuong } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('MaMon', sql.NVarChar, MaMon)
            .input('MaGiaNguyenLieu', sql.NVarChar, MaGiaNguyenLieu)
            .input('KhoiLuong', sql.Decimal(10, 2), KhoiLuong)
            .query(`
                INSERT INTO NguyenLieu (MaMon, MaGiaNguyenLieu, KhoiLuong)
                VALUES (@MaMon, @MaGiaNguyenLieu, @KhoiLuong)
            `);

        res.status(201).json({ message: 'Thành phần đã được tạo thành công.' });
    } catch (error) {
        console.error('Lỗi khi tạo thành phần:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo thành phần.' });
    }
};

const updateIngredient = async (req, res) => {
    const { MaMon, MaGiaNguyenLieu } = req.params;
    const { KhoiLuong } = req.body; // Chỉ cập nhật khối lượng

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaMon', sql.NVarChar, MaMon)
            .input('MaGiaNguyenLieu', sql.NVarChar, MaGiaNguyenLieu)
            .input('KhoiLuong', sql.Decimal(10, 2), KhoiLuong)
            .query(`
                UPDATE NguyenLieu
                SET 
                    KhoiLuong = @KhoiLuong
                WHERE MaMon = @MaMon AND MaGiaNguyenLieu = @MaGiaNguyenLieu
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành phần để cập nhật.' });
        }

        res.status(200).json({ message: 'Thành phần đã được cập nhật thành công.' });
    } catch (error) {
        console.error('Lỗi khi cập nhật thành phần:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thành phần.' });
    }
};
const getAllIngredients = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT * FROM NguyenLieu
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm thành phần:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thanh phan.' });
    }
};
const getIngredientById = async (req, res) => {
    const { MaMon, MaNguyenLieu } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaMon', sql.NVarChar, MaMon)
            .input('MaNguyenLieu', sql.NVarChar, MaNguyenLieu)
            .query(`
                SELECT * FROM ThanhPhan WHERE MaMon = @MaMon AND MaNguyenLieu = @MaNguyenLieu
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành phần.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Lỗi khi tải thành phần:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tải nguyên liệu.' });
    }
};
const deleteIngredient = async (req, res) => {
    const { MaMon, MaGiaNguyenLieu } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaMon', sql.NVarChar, MaMon)
            .input('MaGiaNguyenLieu', sql.NVarChar, MaGiaNguyenLieu)
            .query(`
                DELETE FROM NguyenLieu WHERE MaMon = @MaMon AND MaGiaNguyenLieu = @MaGiaNguyenLieu
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành phần để xóa.' });
        }

        res.status(200).json({ message: 'Đã xóa thành phần thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa thành phần:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thành phần.' });
    }
};


module.exports = {
    getAllIngredients,
    deleteIngredient,
    getIngredientById,
    updateIngredient,
    createIngredient
 }