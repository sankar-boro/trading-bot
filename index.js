const ccxt = require('ccxt');

// Function to create a notifier bot
async function createNotifierBot(exchangeId, symbol) {
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
}

// Function to get the current price of a symbol
async function getCurrentPrice(exchange, symbol) {
  try {
    const ticker = await exchange.fetchTicker(symbol);
    return ticker.last;
  } catch (error) {
    console.error('Error fetching ticker:', error);
    return null;
  }
}

// Function to check if stock market has gone up or down
function checkStockStatus(previousPrice, currentPrice) {
  if (currentPrice > previousPrice) {
    return 'up';
  } else if (currentPrice < previousPrice) {
    return 'down';
  } else {
    return 'unchanged';
  }
}

// Function to notify when stock market changes
function notifyStockChange(symbol, previousPrice, currentPrice) {
  const status = checkStockStatus(previousPrice, currentPrice);
  console.log(`Stock ${symbol} has gone ${status} (${previousPrice} -> ${currentPrice})`);
  // Implement your notification logic here, such as sending an email or a message
}

// Usage
const exchangeId = 'binance'; // Change this to your desired exchange (check ccxt documentation for available exchanges)
const symbol = 'BTC/USDT'; // Change this to the symbol you want to monitor
createNotifierBot(exchangeId, symbol);
