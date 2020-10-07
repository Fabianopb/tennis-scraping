const axios = require('axios').default;

// Meilahti
// (async () => {
//   const response = await axios.get('https://meilahti.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=1&BookingCalForm%5Bp_pvm%5D=2020-10-18&BookingCalForm%5Bp_pvm_interval%5D=&BookingCalForm%5Bp_pvm_custom%5D=sunnuntai+18.10.2020');
//   const freeSlotElements = response.data.match(/\d+\:\d+<br><strong>Varaa<\/strong><\/a>/g);
//   const freeSlots = freeSlotElements.map(el => el.replace(/<br><strong>Varaa<\/strong><\/a>/, ''));
//   console.log('free slots at 09:00', freeSlots.filter(slot => slot === '09:00').length);
//   console.log('free slots at 10:00', freeSlots.filter(slot => slot === '10:00').length);
// })();

const date = '2020-10-18';

const scrapeTapiola = async () => {
  const response = await axios.get(`https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`);
  const freeSlotElements = response.data.match(/Te\d+<br>\d+:\d+/g);
  const freeSlots = freeSlotElements.map(el => el.split('<br>'));
  console.log(freeSlots)
}

const tenMinutes = 1000 * 60 * 10;
scrapeTapiola();
setInterval(scrapeTapiola, tenMinutes);

// use https://github.com/mikaelbr/node-notifier#readme for notification