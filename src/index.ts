import axios from 'axios';
import notifier from 'node-notifier';
import open from 'open';
import moment from 'moment';
import skipTimes from '../skip';
import { logFreeTapiolaSlots, shouldNotifyFreeSlotsInTapiola } from './tapiola';

moment.locale('fi');

let notified = false;

const searchDayFormat = 'YYYY-MM-DD';

const scrapeTapiola = async () => {
  const startMoment = moment().weekday(6); // first sunday
  const endMoment = moment().add(31, 'days'); // last day allowed to search

  const searchMoment = moment(startMoment);

  while (!notified && searchMoment.isBefore(endMoment)) {
    const date = searchMoment.format(searchDayFormat);

    const notifyTapiola = await shouldNotifyFreeSlotsInTapiola(date, skipTimes);

    if (notifyTapiola) {
      notifier.notify({
        title: 'Courts available!',
        message: `There are courts available on ${searchMoment.format('L')}`,
        open: `https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`,
        timeout: 5,
      });
      notified = notifyTapiola;
    }
    searchMoment.add(1, 'week');
  }
}

notifier.on('timeout', async (notifierObject, options) => {
  await open(options.open);
  process.exit(0);
});

const oneMinute = 1000 * 60;
scrapeTapiola();
setInterval(scrapeTapiola, oneMinute * 5);
