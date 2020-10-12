import axios from 'axios';
import notifier from 'node-notifier';
import open from 'open';

const date = '2020-10-18';

const nine = '09:00';
const ten = '10:00';

const scrapeTapiola = async () => {
  const response = await axios.get<string>(`https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`);
  const freeSlotElements = response.data.match(/Te\d+<br>\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split('<br>'));

  const nineSlots = freeSlots.filter(slot => slot[1] === nine).length;
  const tenSlots = freeSlots.filter(slot => slot[1] === ten).length;

  if (tenSlots >= 1) {
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
    process.exit(0);
  }
  
  const now = new Date();
  console.log(`\n::: Slots for ${date} in Tapiola on ${now.toISOString()}`);
  console.log(freeSlots, '\n')
}

const tenMinutes = 1000 * 60 * 10;
scrapeTapiola();
setInterval(scrapeTapiola, tenMinutes);
