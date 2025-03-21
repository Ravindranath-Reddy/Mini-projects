const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if ((select.name === "from" && currCode === "USD") || (select.name === "to" && currCode === "INR")) {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value < 1 ? 1 : amount.value;
  amount.value = amtVal;

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  try {
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    
    if (!rate) throw new Error("Exchange rate not found.");

    let finalAmount = (amtVal * rate).toFixed(5);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate.";
  }
};

const updateFlag = (element) => {
  let countryCode = countryList[element.value];
  element.parentElement.querySelector("img").src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);
