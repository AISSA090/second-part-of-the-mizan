import { getgoldprices, getgodhistory } from './api.js';
import { displayGold, displaySilver, displaytime, show, displayCatalog } from './ui.js';
import { calculateSilverPerGram, calculatePercentage, calculatepricepergrame } from './calculator.js';
import { savetolocal } from './storage.js';
import { getCatalog } from './catalogapi.js';
import { setItems, getItems, setMetalPrices } from './store.js';

const btnactualiser = document.getElementById("button-actualiser");
const savedData = localStorage.getItem("priceHistory");
const savingmetalprice = savedData ? JSON.parse(savedData) : [];
const choice = document.getElementById("currency");

const btnStore = document.getElementById("button-store");
const btnFront = document.getElementById("button-front");
const tab1 = document.getElementById("tab-1");
const tab2 = document.getElementById("tab-2");
const retryBtn = document.getElementById("retry-btn");

btnStore.addEventListener("click", function () {
  tab1.classList.add("hidden");
  tab2.classList.remove("hidden");
  btnStore.classList.add("hidden");
  btnFront.classList.remove("hidden");
});

btnFront.addEventListener("click", function () {
  tab2.classList.add("hidden");
  tab1.classList.remove("hidden");
  btnFront.classList.add("hidden");
  btnStore.classList.remove("hidden");
  btn7days.click();
});

async function loadCatalog() {
  try {
    show("loading");
    const items = await getCatalog();
    setItems(items);
    displayCatalog(getItems());
    show("success");
  } catch (error) {
    document.getElementById("error-text").textContent = error.message;
    show("error");
  }
}

retryBtn.addEventListener("click", function () {
  loadCatalog();
});

btnactualiser.addEventListener('click', async function () {
  const currency = document.getElementById("currency").value;
  try {
    show("loading");
    const data = await getgoldprices(currency);

    const silverprice = calculateSilverPerGram(data.silver_usd_oz, currency, data.fx_rates[currency]);
    const goldprice = data.xau.price;

    setMetalPrices(goldprice, silverprice, currency);
    displayCatalog(getItems());

    const silverPercentage = calculatePercentage(savingmetalprice, "silver", currency);
    const goldPercentage = calculatePercentage(savingmetalprice, "Gold", currency);

    savetolocal(savingmetalprice, currency, silverprice, "silver");
    savetolocal(savingmetalprice, currency, goldprice, "Gold");

    displayGold(currency, data, goldPercentage);
    displaySilver(currency, silverprice.toFixed(2), silverPercentage);
    displaytime(data);
    show("success");
  } catch (error) {
    show("error");
  }
});

async function loadinitialprice() {
  const savedCurrency = localStorage.getItem("selectedCurrency") || "MAD";
  document.getElementById("currency").value = savedCurrency;

  try {
    const data = await getgoldprices(savedCurrency);
    const silverprice = calculateSilverPerGram(data.silver_usd_oz, savedCurrency, data.fx_rates[savedCurrency]);
    const goldprice = data.xau.price;

    setMetalPrices(goldprice, silverprice, savedCurrency);
    displayCatalog(getItems());

    const silverPercentage = calculatePercentage(savingmetalprice, "silver", savedCurrency);
    const goldPercentage = calculatePercentage(savingmetalprice, "Gold", savedCurrency);

    savetolocal(savingmetalprice, savedCurrency, silverprice, "silver");
    savetolocal(savingmetalprice, savedCurrency, goldprice, "Gold");

    displayGold(savedCurrency, data, goldPercentage);
    displaySilver(savedCurrency, silverprice.toFixed(2), silverPercentage);
    displaytime(data);
  } catch (error) {
    show("error");
  }
}

choice.addEventListener('change', async function () {
  const currency = document.getElementById("currency").value;
  try {
    show("loading");
    const data = await getgoldprices(currency);
    const silverprice = calculateSilverPerGram(data.silver_usd_oz, currency, data.fx_rates[currency]);
    const goldprice = data.xau.price;

    setMetalPrices(goldprice, silverprice, currency);
    displayCatalog(getItems());

    const silverPercentage = calculatePercentage(savingmetalprice, "silver", currency);
    const goldPercentage = calculatePercentage(savingmetalprice, "Gold", currency);

    localStorage.setItem("selectedCurrency", currency);
    savetolocal(savingmetalprice, currency, silverprice, "silver");
    savetolocal(savingmetalprice, currency, goldprice, "Gold");

    displayGold(currency, data, goldPercentage);
    displaySilver(currency, silverprice.toFixed(2), silverPercentage);
    displaytime(data);
    show("success");
  } catch (error) {
    show("error");
  }
});

const btn7days = document.getElementById("btn-7days");
const btn30days = document.getElementById("btn-30days");
let goldchart = null;

function generatechart(date, prices, currency) {
  const ctx = document.getElementById('goldChart').getContext('2d');
  if (goldchart) {
    goldchart.destroy();
  }

  goldchart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: date,
      datasets: [{
        label: "Gold Price (" + currency + "/g)",
        data: prices,
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

btn30days.addEventListener('click', async function () {
  const currency = document.getElementById("currency").value;
  try {
    show("loading");
    const data = await getgodhistory();
    const goldData = await getgoldprices(currency);
    const changerate = goldData.fx_rates[currency];
    const last30Days = data.points.slice(-30);
    const prices = last30Days.map(point => (point.c / 31.1035) * changerate);
    const date = last30Days.map(n => n.d);
    generatechart(date, prices, currency);
    show("success");
  } catch (error) {
    show("error");
  }
});

btn7days.addEventListener('click', async function () {
  const currency = document.getElementById("currency").value;
  try {
    show("loading");
    const data = await getgodhistory();
    const goldData = await getgoldprices(currency);
    const changerate = goldData.fx_rates[currency];
    const last7Days = data.points.slice(-7);
    const prices = last7Days.map(point => (point.c / 31.1035) * changerate);
    const date = last7Days.map(n => n.d);
    generatechart(date, prices, currency);
    show("success");
  } catch (error) {
    show("error");
  }
});

const poids = document.getElementById("weight");
const priceestimation = document.getElementById("estimated-price");

poids.addEventListener('input', async function () {
  const weightVal = document.getElementById("weight").value;
  const metaltype = document.getElementById("type-of-metal").value;
  const currency = document.getElementById("currency").value;

  if (weightVal === "" || parseFloat(weightVal) <= 0) {
    priceestimation.textContent = "---";
    return;
  }

  if (metaltype === "gold") {
    try {
      const data = await getgoldprices(currency);
      const goldprice = data.xau.price;
      priceestimation.textContent = calculatepricepergrame(goldprice, weightVal).toFixed(2) + " " + currency;
      show("success");
    } catch (error) {
      show("error");
    }
  } else {
    try {
      const data = await getgoldprices(currency);
      const changerate = data.fx_rates[currency];
      const silverprice = calculateSilverPerGram(data.silver_usd_oz, currency, changerate);
      priceestimation.textContent = calculatepricepergrame(silverprice, weightVal).toFixed(2) + " " + currency;
      show("success");
    } catch (error) {
      show("error");
    }
  }
});
const searchInput = document.getElementById("search-input");
const filterStatus = document.getElementById("filter-status");
const sortSelect = document.getElementById("sort-select");
const btnResetFilters = document.getElementById("btn-reset-filters");

function getItemPrice(item) {
  const prices = getMetalPrices();
  const metalKey = item.metal.toLowerCase();
  const pricePerGram = prices[metalKey] || 0;
  return calculatepricepergrame(pricePerGram, item.weight);
}

function updateCatalogView() {
  let result = [...getItems()];

  const searchText = searchInput.value.trim().toLowerCase();
  if (searchText !== "") {
    result = result.filter(item =>
      item.title.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText)
    );
  }

  const statusValue = filterStatus.value;
  if (statusValue === "favorites") {
    result = result.filter(item => item.favorite === true);
  } else if (statusValue !== "all") {
    result = result.filter(item => item.status === statusValue);
  }

  const sortValue = sortSelect.value;
  if (sortValue === "title-asc") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "price-asc") {
    result.sort((a, b) => getItemPrice(a) - getItemPrice(b));
  } else if (sortValue === "price-desc") {
    result.sort((a, b) => getItemPrice(b) - getItemPrice(a));
  } else if (sortValue === "date-desc") {
    result.sort((a, b) => Number(b.id) - Number(a.id));
  }

  displayCatalog(result);
}

searchInput.addEventListener("input", updateCatalogView);
filterStatus.addEventListener("change", updateCatalogView);
sortSelect.addEventListener("change", updateCatalogView);

btnResetFilters.addEventListener("click", function () {
  searchInput.value = "";
  filterStatus.value = "all";
  sortSelect.value = "date-desc";
  displayCatalog(getItems());
});

loadinitialprice();
loadCatalog();
