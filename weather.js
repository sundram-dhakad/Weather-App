
const weatherInfo = async (inputAddress) => {
  const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${inputAddress}?key=PDQ2R7DHHCYVRAXTVBY6U2GFP`);

  const data = await response.json();

  const {address,currentConditions,days} = data;
  displayCurrentCondition(address,currentConditions);
  displayNextDays(days);
  console.log(data);
}

const displayCurrentCondition = (address,currentConditions) =>{
  document.querySelector('.current-condition-info')
   .innerHTML = `
    <div>
      Location - ${address}
    </div>
    <div class="asperTime">
      As Per Local Time - ${currentConditions.datetime}
    </div>
    <div class="currTemp">Temperature - ${fahrenheitToCelcius(currentConditions.temp)}</div>
    <div class="condition">Condition - ${currentConditions.conditions}<div>
   `;
}

const displayNextDays = (days) =>{
  let daysHtml = ``;
  days.forEach(day => {
    daysHtml += `
    <div class="day-info">
      <div>${day.datetime}</div>
      <div>${fahrenheitToCelcius(day.temp)}</div>
      <div>${fahrenheitToCelcius(day.tempmin)}</div>
      <div>${fahrenheitToCelcius(day.tempmax)}</div>
      <div>${day.conditions}</div>
    </div>
    `;
  });
  document.querySelector('.info-container').innerHTML = daysHtml;
}

weatherInfo('bhopal');

document.querySelector('.search-button')
 .addEventListener('click',()=>{
  const location = document.querySelector('.address-input').value;
  weatherInfo(location);
 });

function fahrenheitToCelcius(temp){
  return ((Number(temp)-32)*5/9).toFixed(2)+"&#8451";
} 