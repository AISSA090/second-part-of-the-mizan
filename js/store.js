let catalogItems = [];
let currentPrices = { gold: 0, silver: 0, currency: "MAD" };

export function setItems(newItems) {
  catalogItems = newItems;
}

export function getItems() {
  return catalogItems;
}

export function setMetalPrices(goldPrice, silverPrice, currency) {
  currentPrices = { gold: goldPrice, silver: silverPrice, currency: currency };
}

export function getMetalPrices() {
  return currentPrices;
}