const poolPromise = require('../database/db.js'); // Đường dẫn tới file cấu hình kết nối
const sql = require('mssql/msnodesqlv8');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng mới
const register = async (req, res) => {
    const {  MatKhau, HoTen, Email, SoDienThoai, DiaChi,  } = req.body;

    try {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(MatKhau, 10); // Mã hóa mật khẩu

        // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại chưa
        const checkUser = await pool.request()
            
            .input('Email', sql.NVarChar, Email)
            .query('SELECT * FROM KhachHang WHERE  Email = @Email');
        
        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại.' });
        }

        // Tạo MaKhachHang tự động
        const lastUser = await pool.request().query('SELECT TOP 1 MaKhachHang FROM KhachHang ORDER BY MaKhachHang DESC');
        const lastUserId = lastUser.recordset[0] ? lastUser.recordset[0].MaKhachHang : 'KH000';
        const newUserId = 'KH' + (parseInt(lastUserId.replace('KH', '')) + 1).toString().padStart(3, '0');

        // Thêm người dùng vào cơ sở dữ liệu
        await pool.request()
            .input('MaKhachHang', sql.NVarChar, newUserId)
           
            .input('MatKhau', sql.NVarChar, hashedPassword)
            .input('HoTen', sql.NVarChar, HoTen)
            .input('Email', sql.NVarChar, Email)
            .input('SoDienThoai', sql.NVarChar, SoDienThoai)
            .input('DiaChi', sql.NVarChar, DiaChi)
          
            .query(`
                INSERT INTO KhachHang (MaKhachHang, MatKhau, HoTen, Email, SoDienThoai, DiaChi,  ThoiGianCapNhat)
                VALUES (@MaKhachHang,  @MatKhau, @HoTen, @Email, @SoDienThoai, @DiaChi,  GETDATE())
            `);

        res.status(201).json({ message: 'Đăng ký thành công!' });

    } catch (error) {
        console.error('Đăng ký thất bại:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng ký.' });
    }
};
// Đăng nhập
const login = async (req, res) => {
    const { Email, MatKhau } = req.body;

    try {
        const pool = await poolPromise;

        // Kiểm tra người dùng có tồn tại không
        const user = await pool.request()
            .input('Email', sql.NVarChar, Email)
            .query('SELECT * FROM KhachHang WHERE Email = @Email');
        const data = user.recordset;
        if (user.recordset.length === 0) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }

        // Kiểm tra mật khẩu
        const validPassword = await bcrypt.compare(MatKhau, user.recordset[0].MatKhau);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mật khẩu không đúng.' });
        }

        // Tạo JWT
        const jwtSecretKey = 'your_jwt_secret_key';  // Sử dụng secret key trực tiếp trong mã nguồn
        const token = jwt.sign(
            { UserId: user.recordset[0].MaKhachHang, Role: user.recordset[0].VaiTro },
            jwtSecretKey,  // Dùng key trong mã nguồn thay vì biến môi trường
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: 'Đăng nhập thành công!', token, data});

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng nhập.' });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Truy vấn lấy tất cả người dùng
        const result = await pool.request()
            .query('SELECT MaKhachHang,  HoTen, Email, SoDienThoai, DiaChi, VaiTro, ThoiGianCapNhat FROM KhachHang');

        // Kiểm tra nếu không có người dùng nào
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không có người dùng nào trong hệ thống.' });
        }

        // Trả về danh sách người dùng
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy dữ liệu.' });
    }
};

const deleteUser = async (req,res) => {
    try {
        const { MaKhachHang } = req.params;
        const pool = await poolPromise;
        await pool.request()
            .input('MaKhachHang', sql.NVarChar, MaKhachHang)
            .query('Delete from KhachHang Where MaKhachHang=@MaKhachHang');
        res.status(200).json({message:'da xoa thanh cong'})
    } catch (error) {
        console.error("co loi", error);
        res.status(500).json({ message: 'da xoa that bai' });
    }
}

// Middleware kiểm tra quyền
const authorize = (roles) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header

        if (!token) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }

        const jwtSecretKey = 'your_jwt_secret_key';  // Sử dụng secret key trực tiếp trong mã nguồn

        jwt.verify(token, jwtSecretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token không hợp lệ.' });
            }

            // Kiểm tra vai trò
            if (roles && !roles.includes(decoded.Role)) {
                console.log(decoded);
                return res.status(403).json({ message: 'Không có quyền truy cập vào tài nguyên này.' });
            }

            req.user = decoded;
            console.log(req.user);
            next();
        });
    };
};


module.exports = {
    
    getAllUsers,
    register,
    login,
    authorize,
    deleteUser,
    
};