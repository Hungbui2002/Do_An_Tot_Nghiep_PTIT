const sql = require('mssql/msnodesqlv8');

// Cấu hình kết nối SQL Server với Windows Authentication
const config = {
  server: 'DESKTOP-IS6CCAK\\CSDLPTEST', // Tên server của bạn
  database: 'Mon_an_DA', // Tên database
  driver: 'msnodesqlv8', // Dùng driver msnodesqlv8 để hỗ trợ Windows Authentication
  options: {
    trustedConnection: true, // Sử dụng Windows Authentication
    encrypt: false, // Không mã hóa nếu dùng máy local
    
  }
};

// Tạo kết nối
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Kết nối thành công đến SQL Server');
    return pool;
  })
  .catch(err => {
    console.log('Kết nối đến SQL Server thất bại', err);
    process.exit(1); // Kết thúc quá trình nếu không thể kết nối
  });

// Xuất poolPromise để sử dụng ở nơi khác
module.exports = poolPromise;

// enableArithAbort: true