import ccxt, {Exchange} from 'ccxt';

async function loadMarkets() {
  return ccxt.loadMarkets();
}

async function getSymbolInfo(exchange: any, symbol: any) {
  try {
    const symbolInfo = exchange.markets[symbol];
    console.log(`Symbol Info for ${symbol}:`, symbolInfo);
  } catch (error) {
    console.error('Error fetching symbol info:', error);
  }
}

async function getAccountBalance(exchange: any) {
  try {
    const balance = await exchange.fetchBalance();
    console.log('Account Balance:', balance);
  } catch (error) {
    console.error('Error fetching account balance:', error);
  }
}

async function placeOrder(
  exchange: any,
  symbol: any,
  type: any,
  price: any,
  amount: any,
) {
  try {
    const order = await exchange.createOrder(
      symbol,
      type,
      'limit',
      amount,
      price,
    );
    console.log('Order placed successfully:', order);
  } catch (error) {
    console.error(
      'Error placing order:',
      error,
    ); /* eslint-disable @typescript-eslint/no-unused-vars */
    const ccxt = require('ccxt');
  }
}

async function cancelOrder(exchange: any, orderId: any) {
  try {
    const result = await exchange.cancelOrder(orderId);
    console.log('Order cancelled successfully:', result);
  } catch (error) {
    console.error('Error cancelling order:', error);
  }
}

async function getOrderStatus(exchange: any, orderId: any) {
  try {
    const order = await exchange.fetchOrder(orderId);
    console.log('Order Status:', order.status);
  } catch (error) {
    console.error('Error fetching order status:', error);
  }
}

// Function to create a notifier bot
const createNotifierBot = async (exchangeId: any, symbol: any) => {
  try {
    // Create an instance of the exchange
    const exchange = new ccxt[exchangeId]();

    // Load markets
    await exchange.loadMarkets();

    // Get previous price
    let previousPrice = await getCurrentPrice(exchange, symbol);

    // Continuously monitor the price
    setInterval(async () => {
      const currentPrice = await getCurrentPrice(exchange, symbol);
      if (currentPrice !== previousPrice) {
        notifyStockChange(symbol, previousPrice, currentPrice);
      }
      previousPrice = currentPrice;
    }, 60000); // Check every minute
  } catch (error) {
    console.error('Error:', error);
  }
};

// Function to get the current price of a symbol
async function getCurrentPrice(exchange: any, symbol: any) {
  try {
    const ticker = await exchange.fetchTicker(symbol);
    return ticker.last;
  } catch (error) {
    console.error('Error fetching ticker:', error);
    return null;
  }
}

// Function to check if stock market has gone up or down
function checkStockStatus(previousPrice: any, currentPrice: any) {
  if (currentPrice > previousPrice) {
    return 'up';
  } else if (currentPrice < previousPrice) {
    return 'down';
  } else {
    return 'unchanged';
  }
}

// Function to notify when stock market changes
function notifyStockChange(symbol: any, previousPrice: any, currentPrice: any) {
  const status = checkStockStatus(previousPrice, currentPrice);
  console.log(
    `Stock ${symbol} has gone ${status} (${previousPrice} -> ${currentPrice})`,
  );
  // Implement your notification logic here, such as sending an email or a message
}

// Usage
const exchangeId = 'binance'; // Change this to your desired exchange (check ccxt documentation for available exchanges)
const symbol = 'BTC/USDT'; // Change this to the symbol you want to monitor
// createNotifierBot(exchangeId, symbol);

const createExchange = async () => {
  try {
    // Create an instance of the exchange
    const exchange = new ccxt[exchangeId]();
  } catch (error) {
    console.error('Error:', error);
  }
};

export {createNotifierBot, loadMarkets};
