const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const poolPromise = require('../database/db.js'); // Đường dẫn tới file cấu hình kết nối
const sql = require('mssql/msnodesqlv8');
const config1 = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
const payment = async (req, res) => {
    const embed_data = {
        redirecturl: "http://localhost:4200/",
    };

    console.log(req.body);

    const items = [
        {
            dish: req.body,
        },
    ];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
        app_user: "user123",
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: req.body.Gia,
        description: `Thanh toan cho Mon: #${req.body.TenMon}`,
        bank_code: "",
        callback_url: "https://7b25-1-55-14-251.ngrok-free.app/api/zalo/callback",
    };

    const data =
        config.app_id +
        "|" +
        order.app_trans_id +
        "|" +
        order.app_user +
        "|" +
        order.amount +
        "|" +
        order.app_time +
        "|" +
        order.embed_data +
        "|" +
        order.item;

    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const response = await axios.post(config.endpoint, null, { params: order });
        console.log(response.data);
        res.json({ success: true, message: "Chuyển đến trang thanh toán thành công", data: response.data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Lỗi khi tạo thanh toán", error: err.message });
    }
};

const callback = async (req, res) => {
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;
        console.log(dataStr);
        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log("mac =", mac);

        // Kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // Callback không hợp lệ
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // Thanh toán thành công
            // Merchant cập nhật trạng thái cho đơn hàng
            let dataJson = JSON.parse(dataStr, config.key2);
            let orderInfo = JSON.parse(JSON.parse(dataStr).item)[0].dish;
            const {MaMon,MaKhachHang,TenMon,Gia}= orderInfo
            const pool = await poolPromise;
            await pool.request()
                .input("MaHoaDon", sql.NVarChar, dataJson.app_trans_id)
                .input("MaKhachHang", sql.NVarChar, MaKhachHang)
                .input("MaMon", sql.NVarChar, MaMon)
                .input("PhuongThucThanhToan", sql.NVarChar, 'Zalopay')
            .query(`
                INSERT INTO HoaDon (MaHoaDon, MaKhachHang, MaMon, NgayMua, PhuongThucThanhToan)
                VALUES (@MaHoaDon, @MaKhachHang, @MaMon, GETDATE(), @PhuongThucThanhToan)
            `);
      console.log(MaMon);
            console.log("Update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
            
            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // Thông báo kết quả cho ZaloPay server
    res.json(result);
};
module.exports = {
    payment, callback
};