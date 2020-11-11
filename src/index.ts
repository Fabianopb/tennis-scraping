import moment from 'moment';
import { scrapeTapiola } from './tapiola';
import { DesiredSlot } from './types';

moment.locale('fi');

const ONE_MINUTE = 1000 * 60;

const desiredSlots: DesiredSlot[] = [
  { court: 'tapiola', day: '2020-12-06', times: ['10:00'] },
];

const executeMainProcess = async () => {
  console.log(`\n* Searching desired slots on ${moment().format('L LT')}...`)
  await Promise.all(desiredSlots.map(desiredSlot => {
    switch (desiredSlot.court) {
      case 'tapiola':
        return scrapeTapiola(desiredSlot);
      default:
        throw new Error(`No process defined for court "${desiredSlot.court}"`);
    }
  }));
}

(async () => {
  await executeMainProcess();
  setInterval(async () => await executeMainProcess(), ONE_MINUTE * 5);
})();
