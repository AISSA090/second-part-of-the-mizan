import { getMetalPrices } from './store.js';
import { calculatepricepergrame } from './calculator.js';
export function displayGold(currency,data,percentage){
    const priceElement = document.getElementById("gold-price");
    const currencyElement = document.getElementById("gold-currency");
     currencyElement.textContent=currency
     priceElement.textContent = data.xau.price;
     const goldPercentElement = document.getElementById("Gold-pourcentage"); 

    goldPercentElement.classList.remove("text-green-500", "text-red-500", "up-class", "down-class");

    if (percentage > 0) {
        goldPercentElement.textContent = `▲ +${percentage}%`;
        goldPercentElement.classList.add("text-green-500"); 
    } else if (percentage < 0) {
        goldPercentElement.textContent = `▼ ${percentage}%`;
        goldPercentElement.classList.add("text-red-500");
    } else {
        goldPercentElement.textContent = `0.00%`;
    }

    }
    export function displaySilver(currency,data,percentage){
        const pricesilver=document.getElementById("silver-price")
        const currencysilver=document.getElementById("silver-currency")
      
        currencysilver.textContent=currency
        pricesilver.textContent=data
        const Silverpourcentage = document.getElementById("silver-pourcentage");

        Silverpourcentage.classList.remove("text-green-500", "text-red-500", "up-class", "down-class");

    if (percentage > 0) {
        Silverpourcentage.textContent = `▲ +${percentage}%`;
        Silverpourcentage.classList.add("text-green-500"); 
    } else if (percentage < 0) {
        Silverpourcentage.textContent = `▼ ${percentage}%`;
        Silverpourcentage.classList.add("text-red-500"); 
    } else {
        Silverpourcentage.textContent = `0.00%`;
    }
}
export function displaytime(data){
    const time=document.getElementById("last-update")
    const cleanDate = new Date(data.updated_at).toLocaleString('fr-FR');
    time.textContent=`last updated ${cleanDate}`
}
export function show(status) {
    const loadingBox = document.getElementById("loading-box");
    const successBox = document.getElementById("success-box");
    const errorBox = document.getElementById("error-box");
    const btnActualiser = document.getElementById("button-actualiser");
    loadingBox.classList.add("hidden");
    successBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    if (status === "success") {
        successBox.classList.remove("hidden");
        btnActualiser.disabled = false;
        setTimeout(() => {
            successBox.classList.add("hidden");
        }, 2500);

    } else if (status === "error") {
        errorBox.classList.remove("hidden");
        btnActualiser.disabled = false;

    } else if (status === "loading") {
        loadingBox.classList.remove("hidden");
        btnActualiser.disabled = true;
    }
}
export function displayCatalog(items) {
  const container = document.getElementById("catalog-list");
  const emptyState = document.getElementById("empty-state");

  container.replaceChildren();

  if (!items || items.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  const prices = getMetalPrices();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const metalKey = item.metal.toLowerCase();
    const pricePerGram = prices[metalKey] || 0;
    const totalPrice = calculatepricepergrame(pricePerGram, item.weight);

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-md overflow-hidden flex flex-col";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.className = "w-full h-48 object-cover";

    const body = document.createElement("div");
    body.className = "p-5 flex flex-col gap-2";

    const title = document.createElement("h3");
    title.className = "text-xl font-bold text-gray-800";
    title.textContent = item.title;

    const desc = document.createElement("p");
    desc.className = "text-sm text-gray-600";
    desc.textContent = item.description;

    const details = document.createElement("p");
    details.className = "text-sm font-semibold text-gray-700";
    details.textContent = "Métal: " + item.metal + " | Poids: " + item.weight + "g";

    const priceTag = document.createElement("p");
    priceTag.className = "text-lg font-bold text-yellow-600";
    priceTag.textContent = totalPrice > 0 ? totalPrice.toFixed(2) + " " + prices.currency: "Prix indisponible";

    const badge = document.createElement("span");
    badge.className = "inline-block w-fit px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800";
    badge.textContent = item.status;

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(details);
    body.appendChild(priceTag);
    body.appendChild(badge);

    card.appendChild(img);
    card.appendChild(body);
    container.appendChild(card);
  }
}