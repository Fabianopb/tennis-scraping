import open from 'open';
import moment from 'moment';
import skipTimes from '../skip';
import { shouldNotifyFreeSlotsInTapiola } from './tapiola';

moment.locale('fi');

const searchDayFormat = 'YYYY-MM-DD';

const scrapeTapiola = async () => {
  console.log(`\n* Searching slots at ${moment().format('L LT')}`);
  const startMoment = moment().weekday(6); // first sunday
  const endMoment = moment().add(31, 'days'); // last day allowed to search

  const searchMoment = moment(startMoment);

  while (searchMoment.isBefore(endMoment)) {
    const date = searchMoment.format(searchDayFormat);

    const notifyTapiola = await shouldNotifyFreeSlotsInTapiola(date, skipTimes);

    if (notifyTapiola) {
      await open(`https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`);
      process.exit(0);
    }
    searchMoment.add(1, 'week');
  }
}

const oneMinute = 1000 * 60;

scrapeTapiola();
setInterval(scrapeTapiola, oneMinute * 5);
