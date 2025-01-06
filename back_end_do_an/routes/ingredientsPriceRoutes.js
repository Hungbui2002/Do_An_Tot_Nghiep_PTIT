// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredientsPriceController.js');

// Định nghĩa route để lấy danh sách món ăn
router.get('/getall', ingredientsController.getAllIngredientsPrices); 

router.post('/add', ingredientsController.addIngredientPrice);
router.delete('/delete/:MaNguyenLieu', ingredientsController.deleteIngredientPrice); // DELETE /dishes/:DishId để xóa món ăn theo Id
router.put('/update/:MaNguyenLieu', ingredientsController.updateIngredientPrice);
router.get('/:MaNguyenLieu', ingredientsController.getOneIngredientPrice);


module.exports = router;