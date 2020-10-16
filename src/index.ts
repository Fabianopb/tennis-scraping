import axios from 'axios';
import notifier from 'node-notifier';
import open from 'open';
import moment from 'moment';
import skipTimes from '../skip';

// skip times example:
// const skipTimes = [
//   '2020-10-25T09:00',
//   '2020-10-25T10:00',
// ];

moment.locale('fi');

let notified = false;

const searchDayFormat = 'YYYY-MM-DD';

const startMoment = moment().weekday(6); // first sunday
const endMoment = moment().add(31, 'days'); // last day allowed to search

const getFreeSlots = async (date: string) => {
  const response = await axios.get<string>(`https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`);
  const freeSlotElements = response.data.match(/Te\d+<br>\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split('<br>'));
  return freeSlots;
}

const logFreeSlots = (date: string, freeSlots: string[][]) => {
  console.log(`\n::(${moment().format('L LT')}):: Slots for ${date} in Tapiola`);
  console.log(freeSlots, '\n');
}

const scrapeTapiola = async () => {
  const searchMoment = moment(startMoment);

  while (!notified && searchMoment.isBefore(endMoment)) {
    const date = searchMoment.format(searchDayFormat);

    const freeSlots = await getFreeSlots(date);
    const filteredSlots = freeSlots.filter(slot => 
      !(skipTimes || []).some(skipTime => 
        skipTime.split('T')[0] === date && skipTime.split('T')[1] === slot[1]
      ));
    
    const nineSlots = filteredSlots.filter(slot => slot[1] === '09:00').length;
    const tenSlots = filteredSlots.filter(slot => slot[1] === '10:00').length;

    if (tenSlots >= 1 || nineSlots >= 1) {
      notifier.notify({
        title: 'Courts available!',
        message: `There are courts available on ${searchMoment.format('L')}`,
        open: `https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`,
        timeout: 5,
      });

      notified = true;

      console.log('Found available courts! Closing process...');
      logFreeSlots(searchMoment.format('L'), filteredSlots);
    }
    
    logFreeSlots(searchMoment.format('L'), filteredSlots);

    searchMoment.add(1, 'week');
  }
}

notifier.on('timeout', async (notifierObject, options) => {
  await open(options.open);
  process.exit(0);
});

const tenMinutes = 1000 * 60 * 10;
scrapeTapiola();
setInterval(scrapeTapiola, tenMinutes);
