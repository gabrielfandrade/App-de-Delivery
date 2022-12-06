const { Sale } = require('../../database/models');

const createOrder = async (sale) => {
  const { 
    userId, 
    sellerId,
    totalPrice, 
    deliveryAddress,
    deliveryNumber } = sale;
    
    const newSale = await Sale.create({
      userId,
      sellerId,
      totalPrice,
      deliveryAddress,
      deliveryNumber,
      saleDate: new Date(),
      status: 'Pendente',
    });

    return newSale.id;
};

const getAllOrders = async () => {
  const sales = await Sale.findAll();

  if (!sales) throw new Error('Sales not found');

  return sales;
};

const getOrdersById = async (userId) => {
  const orders = await Sale.findAll({ where: { userId }, raw: true });

  const orderResult = orders.map(({ id, saleDate, totalPrice, status }) => (
  {
    id,
    saleDate: saleDate.toLocaleDateString('pt-BR'),
    totalPrice,
    status,
  }));

  if (orderResult.length === 0) throw new Error('Orders not found');
  
  return orderResult;
};

module.exports = { createOrder, getAllOrders, getOrdersById };