const mongoose = require('mongoose');

const { Schema } = mongoose;

//order schema
const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});

//create order model using orderschema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
