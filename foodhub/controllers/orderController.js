const Order = require("../models/orderModel");
const Food = require("../models/foodModel");

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private/Customer
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    // Lấy userId từ middleware xác thực (ví dụ: req.user.userId)
    const userId = req.user.userId;

    // 1. Kiểm tra input cơ bản
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must have at least one item" });
    }
    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    let totalPrice = 0;
    const orderItems = [];

    // 2. Lặp qua các item trong giỏ hàng để kiểm tra và tính toán
    for (const item of items) {
      const food = await Food.findById(item.foodId);

      // Kiểm tra món ăn có tồn tại và còn bán không
      if (!food) {
        return res
          .status(404)
          .json({ message: `Food with ID ${item.foodId} not found` });
      }
      if (!food.isAvailable) {
        return res
          .status(400)
          .json({ message: `Sorry, ${food.name} is currently unavailable` });
      }

      // 3. Tính tổng tiền
      totalPrice += food.price * item.quantity;

      // Chuẩn bị item để lưu vào đơn hàng, bao gồm giá tại thời điểm đặt
      orderItems.push({
        foodId: food._id,
        quantity: item.quantity,
        price: food.price,
      });
    }

    // 4. Tạo và lưu đơn hàng mới vào database
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
      deliveryAddress,
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error while creating order" });
  }
};

/**
 * @desc    Get order history for the logged-in user
 * @route   GET /api/orders/my-history
 * @access  Private/Customer
 */
exports.getMyOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId })
      .populate("user", "email") // Lấy email của user
      .populate("items.foodId", "name price") // Lấy tên và giá của từng món ăn
      .sort({ createdAt: -1 }); // Sắp xếp đơn hàng mới nhất lên đầu

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get order history error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Get all orders (for Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "email") // Lấy email của user đặt hàng
      .populate("items.foodId", "name") // Lấy tên của món ăn trong đơn hàng
      .sort({ createdAt: -1 }); // Sắp xếp đơn hàng mới nhất lên đầu

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Update order status (for Admin)
 * @route   PATCH /api/orders/:orderId/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Lấy các trạng thái hợp lệ từ Schema để kiểm tra
    const validStatuses = Order.schema.path("status").enumValues;

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
