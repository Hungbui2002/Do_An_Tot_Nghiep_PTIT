const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const dotenv = require("dotenv");

const express = require("express");
const morgan = require("morgan");
var bodyParser = require("body-parser")
const cors = require("cors")
const app = express();

const dishRoutes = require('./routes/dishRoutes');
const ingredientsRouter = require('./routes/ingredientsRoutes.js');
const categoryRouter = require('./routes/categoryRoutes.js');
const ingredientsPriceRoutes = require('./routes/ingredientsPriceRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const invoiceRoutes = require('./routes/invoiceRoutes.js');

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("dev"));

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
app.get("/", (req, res) => {
    res.status(200).json("Hello");
})
// app.post("/payment", async  (req, res) => {
//     const embed_data = {redirecturl:"https://translate.google.com/?hl=vi&sl=en&tl=vi&text=%7B%0A%20%20%0A%20%20%22TenDangNhap%22%3A%20%22adminUser%22%2C%0A%20%20%22MatKhau%22%3A%22123%22%2C%0A%20%20%22HoTen%22%3A%20%22Nguy%E1%BB%85n%20V%C4%83n%20A%22%2C%0A%20%20%22Email%22%3A%20%22admin%40example.com%22%2C%0A%20%20%22SoDienThoai%22%3A%20%220901234567%22%2C%0A%20%20%22DiaChi%22%3A%20%22H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam%22%2C%0A%20%20%22VaiTro%22%3A%20%22Admin%22%0A%0A%7D&op=translate"};
// console.log(req.body);
//   const items = [
//     {
//       dish: req.body,
//     },
//   ];
//     const transID = Math.floor(Math.random() * 1000000);
//     const order = {
//         app_id: config.app_id,
//         app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
//         app_user: "user123",
//         app_time: Date.now(), // miliseconds
//         item: JSON.stringify(items),
//         embed_data: JSON.stringify(embed_data),
//         amount: req.body.Gia,
//         description: `Thanh toan cho Mon: #${req.body.TenMon}`,
//         bank_code: "",
//         callback_url:"https://2696-118-71-135-220.ngrok-free.app/callback"
//     };
//     console.log("Order Object:", order);


//     // appid|app_trans_id|appuser|amount|apptime|embeddata|item
//     const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
//     order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
//     console.log("Generated MAC:", order.mac);

//     try {
//     const response = await axios.post(config.endpoint, null, { params: order });
//         console.log(response.data);
//         console.log("Request Params to ZaloPay:", {
//     endpoint: config.endpoint,
//     params: order,
// });

//                 res.json({ success: true, message: "Chuyển đến trang thanh toán thành công", data: response.data });

// } catch (err) {
//     console.error("Error Message:", err.message);
//     console.error("Error Response:", err.response?.data);
//     res.status(500).json({ success: false, message: "Lỗi khi tạo thanh toán", error: err.message });
// }
        
// });

// app.post('/callback', (req, res) => {
//     let result = {};

//     try {
//         let dataStr = req.body.data;
//         console.log(dataStr)
//         let reqMac = req.body.mac;

//         let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
//         console.log("mac =", mac);

       
//         // kiểm tra callback hợp lệ (đến từ ZaloPay server)
//         if (reqMac !== mac) {
//             // callback không hợp lệ
//             result.return_code = -1;
//             result.return_message = "mac not equal";
//         }
//         else {
//             // thanh toán thành công
//             // merchant cập nhật trạng thái cho đơn hàng
//             let dataJson = JSON.parse(dataStr, config.key2);
//             console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

//             result.return_code = 1;
//             result.return_message = "success";
//         }
//     } catch (ex) {
//         result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
//         result.return_message = ex.message;
//     }

//     // thông báo kết quả cho ZaloPay server
//     res.json(result);
// });
//
app.use('/api/invoice', invoiceRoutes);
app.use('/api/zalo', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/ingredientsPrice', ingredientsPriceRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/category', categoryRouter);
app.use(express.json());


app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});