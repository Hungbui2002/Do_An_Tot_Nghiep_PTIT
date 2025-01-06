const poolPromise = require('../database/db.js'); // Đường dẫn tới file cấu hình kết nối
 const sql = require('mssql/msnodesqlv8');

// Hàm lấy tất cả món ăn


// const getOneDish = async (req, res) => {
//     const { DishId } = req.params;
//     try {
//         const pool = await poolPromise; // Kết nối đến pool
//         const result = await pool.request()
//             .input('DishId', sql.VarChar, DishId)
//             .query('SELECT * FROM MonAn Where MaMon = @DishId'); // Thực hiện truy vấn SQL
//         const dishes = result.recordset; // Lấy danh sách món ăn
//         res.status(200).json(dishes); 
//          CacBuocLam = JSON.parse(dishes[0].CacBuocLam);
//         console.log(dishes);
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi lấy danh sách món ăn:', error); // Log chi tiết lỗi
//         res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn.' }); // Trả về lỗi nếu có
//     }
// };

const getOneDishSteps = async (req, res) => {
    const { DishId } = req.params;
    try {
        const pool = await poolPromise; // Kết nối đến pool
        const result = await pool.request()
            .input('DishId', sql.VarChar, DishId)
            .query(`
                SELECT Buoc, MoTaBuoc, AnhBuoc
                FROM MonAn
                CROSS APPLY OPENJSON(CacBuocLam)
                WITH (
                    Buoc INT '$.Buoc',
                    MoTaBuoc NVARCHAR(500) '$.MoTaBuoc',
                    AnhBuoc NVARCHAR(MAX) '$.AnhBuoc'
                ) AS Buoc
                WHERE MaMon = @DishId
            `); // Thực hiện truy vấn SQL để lấy các bước làm
        
        const steps = result.recordset; // Lấy danh sách các bước làm
        res.status(200).json(steps); // Trả về JSON với dữ liệu các bước làm
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy các bước làm món ăn:', error); // Log chi tiết lỗi
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy các bước làm món ăn.' }); // Trả về lỗi nếu có
    }
};
// const addDish = async (req, res) => {
//     const { 
//         MaMon,               // DishCode -> MaMon
//         TenMon,              // DishName -> TenMon
//         Calo,                // CalorieAmount -> Calo
//               // No changes
//        DoPhoBien,             // Rating -> 
//         Gia,                 // Price -> Gia
//         MoTa,                // Description -> MoTa
//         Anh,                 // ImageUrl -> Anh
//         CacBuocLam,          // RecipeInstructions -> CacBuocLam
//         ThoiGianNau,         // PreparationTime -> ThoiGianNau
//         DoKho,               // RecipeDifficulty -> DoKho
//         MaLoaiMon            // CategoryCode -> MaLoaiMon
//     } = req.body; 

//     try {
//         const pool = await poolPromise; 
//         await pool.request()
//             .input('MaMon', sql.NVarChar, MaMon) 
//             .input('TenMon', sql.NVarChar, TenMon) 
//             .input('Calo', sql.Decimal(5, 2), Calo) 
            
//             .input('DoPhoBien', sql.Int, DoPhoBien) 
//             .input('Gia', sql.Decimal(10, 2), Gia) 
//             .input('MoTa', sql.NVarChar, MoTa) 
//             .input('Anh', sql.NVarChar, Anh) 
//             .input('CacBuocLam', sql.NVarChar(sql.MAX), JSON.stringify(CacBuocLam)) 
//             .input('ThoiGianNau', sql.Int, ThoiGianNau) 
//             .input('DoKho', sql.NVarChar, DoKho) 
//             .input('MaLoaiMon', sql.NVarChar, MaLoaiMon) 
//             .query(`INSERT INTO MonAn (
//                 MaMon, TenMon, Calo , DoPhoBien, Gia, MoTa, Anh, 
//                 CacBuocLam, ThoiGianNau, DoKho, MaLoaiMon, ThoiGianCapNhat
//             ) VALUES (
//                 @MaMon, @TenMon, @Calo, @DoPhoBien, @Gia, @MoTa, @Anh, 
//                 @CacBuocLam, @ThoiGianNau, @DoKho, @MaLoaiMon, GETDATE()
//             )`); 

//         res.status(201).json({ message: 'Món ăn đã được thêm thành công.' }); 
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi thêm món ăn:', error); 
//         res.status(500).json({ error: 'Có lỗi xảy ra khi thêm món ăn.' }); 
//     } 
// };




// const updateDish = async (req, res) => {
//     const { 
//         TenMon, 
//         Calo, 
       
//         DoPhoBien, 
//         Gia, 
//         MoTa, 
//         Anh, 
//         CacBuocLam, 
//         ThoiGianNau, 
//         DoKho, 
//         MaLoaiMon 
//     } = req.body;
//     const { MaMon } = req.params;

//     try {
//         const pool = await poolPromise;

//         // Check if the dish exists
//         const checkDish = await pool.request()
//             .input('MaMon', sql.NVarChar, MaMon)
//             .query(`SELECT COUNT(*) AS count FROM MonAn WHERE MaMon = @MaMon`);

//         if (checkDish.recordset[0].count === 0) {
//             return res.status(404).json({ message: 'Món ăn không tồn tại.' });
//         }

//         // Proceed to update if the dish exists
//         await pool.request()
//             .input('MaMon', sql.NVarChar, MaMon)
//             .input('TenMon', sql.NVarChar, TenMon)
//             .input('Calo', sql.Decimal(5, 2), Calo)
//             .input('DoPhoBien', sql.Int, DoPhoBien)
//             .input('Gia', sql.Decimal(10, 2), Gia)
//             .input('MoTa', sql.NVarChar, MoTa)
//             .input('Anh', sql.NVarChar, Anh)
//             .input('CacBuocLam', sql.NVarChar(sql.MAX), JSON.stringify(CacBuocLam)) 
//             .input('ThoiGianNau', sql.Int, ThoiGianNau)
//             .input('DoKho', sql.NVarChar, DoKho)
//             .input('MaLoaiMon', sql.NVarChar, MaLoaiMon)
//             .query(`
//                 UPDATE MonAn
//                 SET 
//                     TenMon = @TenMon,
//                     Calo = @Calo,

//                     DoPhoBien = @DoPhoBien,
//                     Gia = @Gia,
//                     MoTa = @MoTa,
//                     Anh = @Anh,
//                     CacBuocLam = @CacBuocLam,
//                     ThoiGianNau = @ThoiGianNau,
//                     DoKho = @DoKho,
//                     MaLoaiMon = @MaLoaiMon,
//                     ThoiGianCapNhat = GETDATE()
//                 WHERE MaMon = @MaMon
//             `);

//         res.status(200).json({ message: 'Món ăn đã được cập nhật thành công.' });
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi cập nhật món ăn:', error);
//         res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật món ăn.' });
//     }
// };




const deleteDish = async (req, res) => {
    const { MaMon } = req.params; 

    try {
        const pool = await poolPromise; 
        const result = await pool.request()
            .input('MaMon', sql.NVarChar, MaMon) 
            .query('DELETE FROM MonAn WHERE MaMon = @MaMon'); 

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Món ăn đã được xóa thành công.' }); 
        } else {
            res.status(404).json({ error: 'Món ăn không tồn tại.' }); 
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi xóa món ăn:', error); 
        res.status(500).json({ error: 'Có lỗi xảy ra khi xóa món ăn.' }); 
    }
};

// const getAllDishes = async (req, res) => {
//     console.log(1);
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request().query('SELECT * FROM MonAn');
//         const dishes = result.recordset;

//         if (!dishes) {
//             return res.status(404).json({ error: 'Không tìm thấy món ăn nào.' });
//         }

//         res.status(200).json(dishes);
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi lấy danh sách món ăn:', error);
//         if (!res.headersSent) {
//             res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn.' });
//         }
//     }
// };
const getPageDishesByCustomer = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Lấy MaKhachHang từ params
        const maKhachHang = req.params.MaKhachHang;
        if (!maKhachHang) {
            maKhachHang = null;
        }

        // Lấy page từ query params, với giá trị mặc định là 1
        const page = parseInt(req.query.page) || 1;
        const pageSize = 8; // Cố định pageSize

        // Tính `offset` dựa trên `page` và `pageSize`
        const offset = (page - 1) * pageSize;

        // Truy vấn tổng số bản ghi (bao gồm cả đã mua và chưa mua)
        const countResult = await pool
            .request()
            .input('MaKhachHang', maKhachHang)
            .query(`
                SELECT COUNT(*) AS totalCount
                FROM MonAn ma
            `);
        

        const totalCount = countResult.recordset[0].totalCount;
        console.log(totalCount);
        // Tính tổng số trang
        const totalPages = Math.ceil(totalCount / pageSize);

        // Truy vấn các món ăn đã mua và chưa mua với phân trang
        const result = await pool
            .request()
            .input('MaKhachHang', maKhachHang)
            .query(`
                SELECT ma.*, 
                       CASE 
                           WHEN hd.MaHoaDon IS NOT NULL THEN 'Đã Mua'
                           ELSE 'Chưa Mua'
                       END AS TrangThai,
                       ISNULL((
                            SELECT COUNT(DISTINCT hd_sub.MaKhachHang)
                            FROM HoaDon hd_sub
                            WHERE hd_sub.MaMon = ma.MaMon
                        ), 0) AS SoLuongNguoiMua
                FROM MonAn ma
                LEFT JOIN HoaDon hd ON ma.MaMon = hd.MaMon AND hd.MaKhachHang = @MaKhachHang
                ORDER BY ma.MaMon DESC
                    
                    
                OFFSET ${offset} ROWS
                FETCH NEXT ${pageSize} ROWS ONLY
            `);

        const dishes = result.recordset;

        if (!dishes || dishes.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn nào.' });
        }

        // Parse trường CacBuocLam nếu có
        dishes.forEach(dish => {
            if (dish.CacBuocLam) {
                try {
                    dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
                } catch (error) {
                    console.error('có lỗi xáy ra khi parse:', dish, error);
                }
            }
        });

        // Gửi kết quả
        res.status(200).json({
            page,
            totalPages,
            data: dishes,
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách món ăn:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn.' });
        }
    }
};


const getAllDishesByCustomerBought = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Lấy MaKhachHang từ params
        const maKhachHang = req.params.MaKhachHang;
        if (!maKhachHang) {
            maKhachHang = null;
        }
        // Tính tổng số trang
      

        // Truy vấn các món ăn đã mua và chưa mua với phân trang
        const result = await pool
            .request()
            .input('MaKhachHang', maKhachHang)
            .query(`
                    SELECT ma.*, hd.MaHoaDon,
                        CASE 
                            WHEN hd.MaHoaDon IS NOT NULL THEN 'Đã Mua'
                            ELSE 'Chưa Mua'
                        END AS TrangThai,
                        ISNULL((
                            SELECT COUNT(DISTINCT hd_sub.MaKhachHang)
                            FROM HoaDon hd_sub
                            WHERE hd_sub.MaMon = ma.MaMon
                        ), 0) AS SoLuongNguoiMua
                    FROM MonAn ma
                    LEFT JOIN HoaDon hd 
                        ON ma.MaMon = hd.MaMon AND hd.MaKhachHang = @MaKhachHang
                    ORDER BY ma.MaMon DESC;

                    
                    
              
            `);

        const dishes = result.recordset;

        if (!dishes || dishes.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn nào.' });
        }

        // Parse trường CacBuocLam nếu có
        dishes.forEach(dish => {
            if (dish.CacBuocLam) {
                try {
                    dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
                } catch (error) {
                    console.error('Có lỗi xảy ra parse:', dish, error);
                }
            }
        });

        // Gửi kết quả
        res.status(200).json(
             dishes,
        );
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách món ăn đã mua:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn đã mua.' });
        }
    }
};
const getAllDishes = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Lấy MaKhachHang từ params
       
      

        // Truy vấn các món ăn đã mua và chưa mua với phân trang
        const result = await pool
            .request()
          
            .query(`
                    SELECT ma.*, 
                        
                        ISNULL((
                            SELECT COUNT(DISTINCT hd_sub.MaKhachHang)
                            FROM HoaDon hd_sub
                            WHERE hd_sub.MaMon = ma.MaMon
                        ), 0) AS SoLuongNguoiMua
                    FROM MonAn ma
                    
                    ORDER BY ma.MaMon DESC;

                    
                    
              
            `);

        const dishes = result.recordset;

        if (!dishes || dishes.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn nào.' });
        }

        // Parse trường CacBuocLam nếu có
        dishes.forEach(dish => {
            if (dish.CacBuocLam) {
                try {
                    dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
                    
                } catch (error) {
                    console.error('Đã có lỗi xáy ra khi parse:', dish, error);
                }
            }
        });

        // Gửi kết quả
        res.status(200).json(
             dishes,
        );
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách món ăn đã mua:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn đã mua.' });
        }
    }
};

const getPageDishes = async (req, res) => {
    try {
        const pool = await poolPromise;

        // Lấy `page` từ query params, với giá trị mặc định là 1
        const page = parseInt(req.query.page) || 1;
        const pageSize = 8; // Cố định pageSize là 2

        // Tính `offset` dựa trên `page` và `pageSize`
        const offset = (page - 1) * pageSize;

        // Truy vấn cơ sở dữ liệu để lấy tổng số bản ghi
        const countResult = await pool
            .request()
            .query('SELECT COUNT(*) AS totalCount  FROM MonAn ');
            

        const totalCount = countResult.recordset[0].totalCount;

        // Tính tổng số trang (totalPages)
        const totalPages = Math.ceil(totalCount / pageSize);

        // Truy vấn cơ sở dữ liệu với phân trang mà không cần sắp xếp
        const result = await pool
            .request()
            .query(`
                SELECT ma.*, 
                        
                        ISNULL((
                            SELECT COUNT(DISTINCT hd_sub.MaKhachHang)
                            FROM HoaDon hd_sub
                            WHERE hd_sub.MaMon = ma.MaMon
                        ), 0) AS SoLuongNguoiMua
                    FROM MonAn ma
                    
                    ORDER BY ma.MaMon DESC
                    OFFSET ${offset} ROWS
                    FETCH NEXT ${pageSize} ROWS ONLY;
            `);

        const dishes = result.recordset;

        if (!dishes || dishes.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy món ăn nào.' });
        }
        console.log(typeof dishes);
        // Parse trường CacBuocLam nếu có
        dishes.forEach(dish => {
            if (dish.CacBuocLam) {
                try {
                   
                    dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
                    console.log(typeof  dish.CacBuocLam);
                } catch (error) {
                    console.error('có lỗi xáy ra là:', error);
                }
            }
        });

        // Gửi kết quả phân trang với tổng số trang
        res.status(200).json({
            page,
            totalPages,
            data: dishes,
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách món ăn:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn.' });
        }
    }
};


// const getTopPopular = async (req, res) => {
//     try {
//         console.log(5);
//         const pool = await poolPromise;
//         const result = await pool.request().query(`
//             SELECT TOP 6 * 
//             FROM MonAn 
//             WHERE DoPhoBien BETWEEN 1 AND 5 
//             ORDER BY DoPhoBien DESC
//         `);
//         const dishes = result.recordset;

//         if (!dishes || dishes.length === 0) {
//             return res.status(404).json({ error: 'Không tìm thấy món ăn nào với 5 sao.' });
//         }

//         res.status(200).json(dishes);
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi lấy danh sách món ăn:', error);
//         if (!res.headersSent) {
//             res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn.' });
//         }
//     }
// };


// const searchDishes = async (req, res) => {
//     console.log(2);
//     console.log(req.query);
//     const { DishName } = req.query;
//     console.log(DishName);
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('Dish', sql.NVarChar, `%${DishName}%`)
//             .query('SELECT * FROM MonAn WHERE TenMon LIKE @Dish');

//         const dishes = result.recordset;
//         console.log(dishes);
//         if (dishes.length > 0) {
//             res.status(200).json(dishes);
//         } else {
//             res.status(404).json({ message: 'Không tìm thấy món ăn nào.' });
//         }
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi tìm kiếm món ăn:', error);
//         res.status(500).json({ error: 'Có lỗi xảy ra khi tìm kiếm món ăn.' });
//     }
// };

const searchDishes = async (req, res) => {
    console.log("request query: ", req.query);
    const { TenMon, MaLoaiMon } = req.query;
    try {
        const pool = await poolPromise;
        const request = pool.request();
        let query = 'SELECT * FROM MonAn';
        let condition = [];
        if (TenMon) {
            condition.push('TenMon LIKE @TenMon');
            request.input('TenMon', sql.NVarChar, `%${TenMon}%`);
        }
        if (MaLoaiMon) {
            condition.push('MaLoaiMon = @MaLoaiMon');
            request.input('MaLoaiMon', sql.NVarChar, MaLoaiMon);
            
        }
        if (condition.length > 0) {
            query += ' Where ' + condition.join(' AND ');
        }
        console.log("query:", query);
        const result = await request.query(query);
        const dishes = result.recordset;
       
        if (dishes.length > 0) {
            res.status(200).json(dishes);
        } else {
            res.status(404).json({ message: 'khong co mon an nao' });
        }
    } catch (error) {
        console.error('Co loi xay ra khi tim kiem', error);
        res.status(500).json({error:'co loi xay ra khi tim kiem mon an'})
    }
}


const getIngredientsByDish = async (req, res) => {
    const { MaMon } = req.params; // Get the dish ID from the request parameters

    try {
        const pool = await poolPromise; // Get the connection pool
        const result = await pool.request()
            .input('MaMon', sql.NVarChar, MaMon) // Pass MaMon as a parameter
            .query(`
                SELECT 
                    NL.MaMon, 
                    GNL.MaNguyenLieu, 
                    GNL.TenNguyenLieu, 
                    NL.KhoiLuong, 
                    GNL.GiaDonVi AS GiaDonViNguyenLieu,
                    NL.Gia AS GiaNguyenLieu,
                    GNL.DonVi, 
                    GNL.MoTa AS MoTaNguyenLieu,
                    GNL.DieuKienBaoQuan, 
                    GNL.ThoiGianCapNhat AS ThoiGianCapNhatNguyenLieu
                FROM 
                    ThanhPhan NL
                JOIN 
                    NguyenLieu GNL ON NL.MaNguyenLieu = GNL.MaNguyenLieu
                WHERE 
                    NL.MaMon = @MaMon
            `);

        // Check if any ingredients are found
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nguyên liệu thành phần cho món ăn này.' });
        }

        // Return the list of ingredients
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Có lỗi xảy ra khi truy xuất thành phần nguyên liệu:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi truy xuất thành phần nguyên liệu.' });
    }
};





// API thêm món ăn
const addDish = async (req, res) => {
    const { 
        TenMon, 
        Calo, 
        DoPhoBien, 
        Gia, 
        MoTa, 
        Anh, 
        CacBuocLam, 
        ThoiGianNau, 
        DoKho, 
        MaLoaiMon, 
        NguyenLieus 
    } = req.body;

    try {
        const pool = await poolPromise;

        // Lấy mã món cuối cùng trong bảng MonAn
        const lastDish = await pool.request()
            .query(`SELECT TOP 1 MaMon FROM MonAn ORDER BY MaMon DESC`);
        
        let newMaMon = "MonAn001"; // Giá trị mặc định nếu bảng trống

        if (lastDish.recordset.length > 0) {
            const lastMaMon = lastDish.recordset[0].MaMon;
            const lastNumber = parseInt(lastMaMon.replace(/\D/g, ""), 10); // Lấy phần số từ mã
            const nextNumber = lastNumber + 1;
            newMaMon = `MonAn${String(nextNumber).padStart(3, '0')}`; // Đảm bảo 3 chữ số
        }

        // Thêm món ăn
        await pool.request()
            .input('MaMon', sql.NVarChar, newMaMon) // Sử dụng mã món mới tạo
            .input('TenMon', sql.NVarChar, TenMon)
            .input('Calo', sql.Decimal(5, 2), Calo)
            .input('DoPhoBien', sql.Int, DoPhoBien)
            .input('Gia', sql.Decimal(10, 2), Gia)
            .input('MoTa', sql.NVarChar, MoTa)
            .input('Anh', sql.NVarChar, Anh)
            .input('CacBuocLam', sql.NVarChar(sql.MAX), JSON.stringify(CacBuocLam))
            .input('ThoiGianNau', sql.Int, ThoiGianNau)
            .input('DoKho', sql.NVarChar, DoKho)
            .input('MaLoaiMon', sql.NVarChar, MaLoaiMon)
            .query(`
                INSERT INTO MonAn (MaMon, TenMon, Calo, DoPhoBien, Gia, MoTa, Anh, CacBuocLam, ThoiGianNau, DoKho, MaLoaiMon)
                VALUES (@MaMon, @TenMon, @Calo, @DoPhoBien, @Gia, @MoTa, @Anh, @CacBuocLam, @ThoiGianNau, @DoKho, @MaLoaiMon)
            `);

        // Thêm nguyên liệu
        for (const nguyenLieu of NguyenLieus) {
            await pool.request()
                .input('MaMon', sql.NVarChar, newMaMon) // Sử dụng mã món mới tạo
                .input('MaNguyenLieu', sql.NVarChar, nguyenLieu.MaNguyenLieu)
                .input('KhoiLuong', sql.Decimal(10, 2), nguyenLieu.KhoiLuong)
                .input('Gia', sql.Decimal(10, 2), 0) // Giá có thể được cập nhật tự động qua trigger
                .query(`
                    INSERT INTO ThanhPhan (MaMon, MaNguyenLieu, KhoiLuong, Gia)
                    VALUES (@MaMon, @MaNguyenLieu, @KhoiLuong, @Gia)
                `);
        }

        res.status(201).json({ message: 'Món ăn và nguyên liệu đã được thêm thành công.', MaMon: newMaMon });
    } catch (error) {
        console.error('Có lỗi xảy ra khi thêm món ăn:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm món ăn.' });
    }
};

//update
const updateDish = async (req, res) => {
    const { 
        TenMon, 
        Calo, 
        DoPhoBien, 
        Gia, 
        MoTa, 
        Anh, 
        CacBuocLam, 
        ThoiGianNau, 
        DoKho, 
        MaLoaiMon, 
        NguyenLieus 
    } = req.body;
    const { MaMon } = req.params; // Lấy MaMon từ params

    try {
        const pool = await poolPromise;

        // Kiểm tra món ăn có tồn tại không
        const existingDish = await pool.request()
            .input('MaMon', sql.NVarChar, MaMon)
            .query(`SELECT MaMon FROM MonAn WHERE MaMon = @MaMon`);

        if (existingDish.recordset.length === 0) {
            return res.status(404).json({ error: 'Món ăn không tồn tại.' });
        }

        // Cập nhật thông tin món ăn
        await pool.request()
            .input('MaMon', sql.NVarChar, MaMon)
            .input('TenMon', sql.NVarChar, TenMon)
            .input('Calo', sql.Decimal(5, 2), Calo)
            .input('DoPhoBien', sql.Int, DoPhoBien)
            .input('Gia', sql.Decimal(10, 2), Gia)
            .input('MoTa', sql.NVarChar, MoTa)
            .input('Anh', sql.NVarChar, Anh)
            .input('CacBuocLam', sql.NVarChar(sql.MAX), JSON.stringify(CacBuocLam))
            .input('ThoiGianNau', sql.Int, ThoiGianNau)
            .input('DoKho', sql.NVarChar, DoKho)
            .input('MaLoaiMon', sql.NVarChar, MaLoaiMon)
            .query(`
                UPDATE MonAn
                SET 
                    
                    TenMon = @TenMon,
                    Calo = @Calo,
                    DoPhoBien = @DoPhoBien,
                    Gia = @Gia,
                    MoTa = @MoTa,
                    Anh = @Anh,
                    CacBuocLam = @CacBuocLam,
                    ThoiGianNau = @ThoiGianNau,
                    DoKho = @DoKho,
                    MaLoaiMon = @MaLoaiMon
                WHERE MaMon = @MaMon
            `);

        // Xóa các nguyên liệu cũ liên quan đến món ăn
        await pool.request()
            .input('MaMon', sql.NVarChar, MaMon)
            .query(`DELETE FROM ThanhPhan WHERE MaMon = @MaMon`);

        // Thêm nguyên liệu mới
        if (Array.isArray(NguyenLieus)) {
            for (const nguyenLieu of NguyenLieus) {
                await pool.request()
                    .input('MaMon', sql.NVarChar, MaMon)
                    .input('MaNguyenLieu', sql.NVarChar, nguyenLieu.MaNguyenLieu)
                    .input('KhoiLuong', sql.Decimal(10, 2), nguyenLieu.KhoiLuong)
                    .input('Gia', sql.Decimal(10, 2), 0) // Giá có thể được cập nhật tự động qua trigger
                    .query(`
                        INSERT INTO ThanhPhan (MaMon, MaNguyenLieu, KhoiLuong, Gia)
                        VALUES (@MaMon, @MaNguyenLieu, @KhoiLuong, @Gia)
                    `);
            }
        }
        

        res.status(200).json({ message: 'Món ăn và nguyên liệu đã được cập nhật thành công.', MaMon });
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật món ăn:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật món ăn.' });
    }
};



const getDishesByCategory = async (req, res) => {
    const { MaLoaiMon } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaLoaiMon', sql.NVarChar, MaLoaiMon)
            .query(`
                SELECT * FROM MonAn WHERE MaLoaiMon = @MaLoaiMon
            `);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(404).json({ message: 'Không tìm thấy món ăn nào cho danh mục này.' });
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy danh sách món ăn:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn.' });
    }
};
// dishcustomer
const getDishesByCategoryByCus = async (req, res) => {
    const { MaLoaiMon, MaKhachHang } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaLoaiMon', sql.VarChar, MaLoaiMon)
            .input('MaKhachHang', sql.VarChar, MaKhachHang)
            .query(`
                SELECT 
                    ma.*, 
                    CASE 
                        WHEN hd.MaHoaDon IS NOT NULL THEN 'Đã Mua'
                        ELSE 'Chưa Mua'
                    END AS TrangThai,
                    ISNULL((
                        SELECT COUNT(DISTINCT hd_sub.MaKhachHang)
                        FROM HoaDon hd_sub
                        WHERE hd_sub.MaMon = ma.MaMon
                    ), 0) AS SoLuongNguoiMua
                FROM MonAn ma
                LEFT JOIN HoaDon hd 
                    ON ma.MaMon = hd.MaMon AND hd.MaKhachHang = @MaKhachHang
                WHERE ma.MaLoaiMon = @MaLoaiMon
                ORDER BY ma.MaMon DESC;
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('có lỗi xảy ra :', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách món ăn.' });
    }
};
const getDishWithStepsAdmin = async (req, res) => {
    const { DishId} = req.params; // Lấy DishId và MaKhachHang từ params
    try {
        const pool = await poolPromise; // Kết nối tới pool

        // Lấy thông tin món ăn để kiểm tra giá
        const dishResult = await pool.request()
            .input('DishId', sql.VarChar, DishId)
            .query(`
                SELECT 
                    MaMon, Gia, TenMon, Calo, DoPhoBien, MoTa, Anh, ThoiGianNau, DoKho, MaLoaiMon, ThoiGianCapNhat, CacBuocLam
                FROM MonAn
                WHERE MaMon = @DishId;
            `);

        if (dishResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Món ăn admin không tìm thấy.' });
        }

        const dish = dishResult.recordset[0];

        // Nếu món ăn có giá = 0, cho phép xem miễn phí
        
            // Parse `CacBuocLam` nếu có
            if (dish.CacBuocLam) {
                try {
                    dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
                } catch (error) {
                    console.error('có lỗi dã xảy ra:', error);
                    dish.CacBuocLam = [];
                }
            }
            return res.status(200).json(dish);
        

        

        
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy món an admin:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy món ăn admin.' });
    }
};



const getDishWithSteps = async (req, res) => {
    const { DishId} = req.params; // Lấy DishId và MaKhachHang từ params
    try {
        const pool = await poolPromise; // Kết nối tới pool

        // Lấy thông tin món ăn để kiểm tra giá
        const dishResult = await pool.request()
            .input('DishId', sql.VarChar, DishId)
            .query(`
                SELECT 
                    MaMon, Gia, TenMon, Calo, DoPhoBien, MoTa, Anh, ThoiGianNau, DoKho, MaLoaiMon, ThoiGianCapNhat, CacBuocLam
                FROM MonAn
                WHERE MaMon = @DishId;
            `);

        if (dishResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Món ăn không tìm thấy.' });
        }

        const dish = dishResult.recordset[0];

        // Nếu món ăn có giá = 0, cho phép xem miễn phí
        if (dish.Gia === 0) {
            // Parse `CacBuocLam` nếu có
            if (dish.CacBuocLam) {
                try {
                    dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
                } catch (error) {
                    console.error('có lỗi CacBuocLam:', error);
                    dish.CacBuocLam = [];
                }
            }
            return res.status(200).json(dish);
        } else {
            res.status(403).json({message:'Không có quyền truy cập món ăn'});
        }

        

        
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy món ăn:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy món ăn.' });
    }
};
const getDishWithStepsLogin = async (req, res) => {
    const { DishId, MaKhachHang } = req.params; // Lấy DishId và MaKhachHang từ params
    try {
        const pool = await poolPromise; // Kết nối tới pool

        // Lấy thông tin món ăn để kiểm tra giá
        const dishResult = await pool.request()
            .input('DishId', sql.VarChar, DishId)
            .query(`
                SELECT 
                    MaMon, Gia, TenMon, Calo, DoPhoBien, MoTa, Anh, ThoiGianNau, DoKho, MaLoaiMon, ThoiGianCapNhat, CacBuocLam
                FROM MonAn
                WHERE MaMon = @DishId;
            `);

        if (dishResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Món ăn không tìm thấy.' });
        }

        const dish = dishResult.recordset[0];

        // Nếu món ăn có giá = 0, cho phép xem miễn phí
        if (dish.Gia === 0) {
            // Parse `CacBuocLam` nếu có
            if (dish.CacBuocLam) {
                try {
                    dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
                } catch (error) {
                    console.error('xảy ra lỗi CacBuocLam:', error);
                    dish.CacBuocLam = [];
                }
            }
            return res.status(200).json(dish);
        }

        // Kiểm tra xem khách hàng đã mua món ăn này chưa
        const purchaseCheckResult = await pool.request()
            .input('DishId', sql.VarChar, DishId)
            .input('MaKhachHang', sql.VarChar, MaKhachHang)
            .query(`
                SELECT 1 
                FROM HoaDon
                WHERE MaMon = @DishId AND MaKhachHang = @MaKhachHang;
            `);

        if (purchaseCheckResult.recordset.length === 0) {
            return res.status(403).json({ 
                error: 'Bạn không có quyền truy cập. Vui lòng mua món ăn để xem chi tiết.' 
            });
        }

        // Nếu khách hàng đã mua, trả về thông tin món ăn
        if (dish.CacBuocLam) {
            try {
                dish.CacBuocLam = JSON.parse(dish.CacBuocLam);
            } catch (error) {
                console.error('đã có lỗi CacBuocLam:', error);
                dish.CacBuocLam = [];
            }
        }

        res.status(200).json(dish);
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy món ăn:', error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy món ăn.' });
    }
};
// (
//                         SELECT Buoc, MoTaBuoc, AnhBuoc
//                         FROM OPENJSON(MonAn.CacBuocLam)
//                         WITH (
//                             Buoc NVARCHAR(500) '$.Buoc',
//                             MoTaBuoc NVARCHAR(500) '$.MoTaBuoc',
//                             AnhBuoc NVARCHAR(MAX) '$.AnhBuoc' AS JSON
//                         )
//                         FOR JSON PATH
//                     ) AS CacBuocLam

module.exports = {getDishesByCategoryByCus,
    getAllDishesByCustomerBought,
    getDishWithStepsLogin,
    getPageDishesByCustomer,
    getPageDishes,
    addDish,
    updateDish,
    deleteDish,
    searchDishes,
 getIngredientsByDish,getDishesByCategory ,getOneDishSteps,getDishWithSteps,getAllDishes,getDishWithStepsAdmin
    
};
