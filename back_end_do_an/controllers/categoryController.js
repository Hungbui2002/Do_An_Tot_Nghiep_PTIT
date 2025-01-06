const poolPromise = require('../database/db.js'); // Đường dẫn tới file cấu hình kết nối
 const sql = require('mssql/msnodesqlv8');

 const addCategory = async (req, res) => {
    const { LoaiMon, MoTa , Anh} = req.body; // Không nhận MaLoaiMon từ body, sẽ tự tạo

    try {
        const pool = await poolPromise;

        // Lấy mã loại món cuối cùng trong bảng LoaiMon
        const lastCategory = await pool.request()
            .query(`SELECT TOP 1 MaLoaiMon FROM LoaiMon ORDER BY MaLoaiMon DESC`);

        let newMaLoaiMon = "LoaiMon001"; // Giá trị mặc định nếu bảng trống

        if (lastCategory.recordset.length > 0) {
            const lastMaLoaiMon = lastCategory.recordset[0].MaLoaiMon;
            const lastNumber = parseInt(lastMaLoaiMon.replace(/\D/g, ""), 10); // Lấy phần số từ mã
            const nextNumber = lastNumber + 1;
            newMaLoaiMon = `LoaiMon${String(nextNumber).padStart(3, '0')}`; // Đảm bảo 3 chữ số
        }

        // Thêm danh mục mới
        await pool.request()
            .input('MaLoaiMon', sql.NVarChar, newMaLoaiMon)
            .input('LoaiMon', sql.NVarChar, LoaiMon)
            .input('MoTa', sql.NVarChar, MoTa)
            .input('Anh', sql.NVarChar, Anh)
            .query(`
                INSERT INTO LoaiMon (MaLoaiMon, LoaiMon, MoTa,Anh, ThoiGianCapNhat) 
                VALUES (@MaLoaiMon, @LoaiMon, @MoTa,@Anh, GETDATE())
            `);

        res.status(201).json({ message: 'Danh mục đã được thêm thành công.', MaLoaiMon: newMaLoaiMon });
    } catch (error) {
        console.error('Có lỗi xảy ra khi thêm danh mục:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm danh mục.' });
    }
};


const getCategories = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT * FROM LoaiMon`);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách danh mục:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách danh mục.' });
    }
};

const updateCategory = async (req, res) => {
    const { LoaiMon, MoTa,Anh } = req.body;
const { MaLoaiMon } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaLoaiMon', sql.NVarChar, MaLoaiMon)
            .input('LoaiMon', sql.NVarChar, LoaiMon)
            .input('MoTa', sql.NVarChar, MoTa)
            .input('Anh', sql.NVarChar, Anh)
            .query(`
                UPDATE LoaiMon
                SET 
                    
                    LoaiMon = @LoaiMon, 
                    MoTa = @MoTa, 
                    Anh = @Anh,
                    ThoiGianCapNhat = GETDATE()
                WHERE MaLoaiMon = @MaLoaiMon
            `);
       


        res.status(200).json({ message: 'Danh mục đã được cập nhật thành công.' });
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật danh mục:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật danh mục.' });
    }
};

const deleteCategory = async (req, res) => {
    const { MaLoaiMon } = req.params;

    try {
        const pool = await poolPromise;
        const result= await pool.request()
            .input('MaLoaiMon', sql.NVarChar, MaLoaiMon)
            .query(`DELETE FROM LoaiMon WHERE MaLoaiMon = @MaLoaiMon`);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Không tìm thấy danh mục cần xóa.' });
        };
        res.status(200).json({ message: 'Danh mục đã được xóa thành công.' });
    } catch (error) {
        console.error('Có lỗi xảy ra khi xóa danh mục:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi xóa danh mục.' });
    }
};

const getOneCategory = async (req, res) => {
    const { MaLoaiMon } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaLoaiMon', sql.NVarChar, MaLoaiMon)
            .query(`SELECT * FROM LoaiMon WHERE MaLoaiMon = @MaLoaiMon`);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Danh mục không tồn tại.' });
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy thông tin danh mục:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy thông tin danh mục.' });
    }
};

module.exports = {
    addCategory,getOneCategory,deleteCategory,updateCategory,getCategories
 
    
};

