import axios from 'axios';
import notifier from 'node-notifier';
import open from 'open';
import moment from 'moment';

const searchDayFormat = 'YYYY-MM-DD';

const startMoment = moment().add(6, 'days').weekday(0); // first sunday
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

  while (searchMoment.isBefore(endMoment)) {
    const date = searchMoment.format(searchDayFormat);

    const freeSlots = await getFreeSlots(date);
    
    const nineSlots = freeSlots.filter(slot => slot[1] === '09:00').length;
    const tenSlots = freeSlots.filter(slot => slot[1] === '10:00').length;

    if (tenSlots >= 1 || nineSlots >= 1) {
      notifier.notify({
        title: 'Courts available!',
        message: 'There are courts available on 2020-10-25',
        open: `https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`,
        timeout: 5,
      });

      notifier.on('timeout', function (notifierObject, options) {
        console.log(options);
        open(options.open);
      });

      console.log('Found available courts! Closing process...');
      logFreeSlots(date, freeSlots);
      process.exit(0);
    }
    
    logFreeSlots(date, freeSlots);

    searchMoment.add(1, 'week');
  }
}

const tenMinutes = 1000 * 60 * 10;
scrapeTapiola();
setInterval(scrapeTapiola, tenMinutes);
