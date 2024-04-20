async function getSymbolInfo(exchange, symbol) {
  try {
    const symbolInfo = exchange.markets[symbol];
    console.log(`Symbol Info for ${symbol}:`, symbolInfo);
  } catch (error) {
    console.error('Error fetching symbol info:', error);
  }
}

async function getAccountBalance(exchange) {
  try {
    const balance = await exchange.fetchBalance();
    console.log('Account Balance:', balance);
  } catch (error) {
    console.error('Error fetching account balance:', error);
  }
}

async function placeOrder(exchange, symbol, type, price, amount) {
  try {
    const order = await exchange.createOrder(symbol, type, 'limit', amount, price);
    console.log('Order placed successfully:', order);
  } catch (error) {
    console.error('Error placing order:', error);
  }
}

async function cancelOrder(exchange, orderId) {
  try {
    const result = await exchange.cancelOrder(orderId);
    console.log('Order cancelled successfully:', result);
  } catch (error) {
    console.error('Error cancelling order:', error);
  }
}

async function getOrderStatus(exchange, orderId) {
  try {
    const order = await exchange.fetchOrder(orderId);
    console.log('Order Status:', order.status);
  } catch (error) {
    console.error('Error fetching order status:', error);
  }
}
