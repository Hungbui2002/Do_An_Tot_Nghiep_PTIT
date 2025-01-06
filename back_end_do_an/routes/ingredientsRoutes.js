// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const dishController = require('../controllers/ingredientsController.js')



// Định nghĩa route để lấy danh sách món ăn
router.get('/getall', dishController.getAllIngredients); 

router.post('/add', dishController.createIngredient);
router.delete('/delete/:MaMon/:MaGiaNguyenLieu', dishController.deleteIngredient); // DELETE /dishes/:DishId để xóa món ăn theo Id
router.put('/update/:MaMon/:MaGiaNguyenLieu', dishController.updateIngredient);
router.get('/:MaMon/:MaNguyenLieu', dishController.getIngredientById);


module.exports = router;