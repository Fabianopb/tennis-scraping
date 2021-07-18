import moment from 'moment';
import { scrapeTaivis } from './taivis';
import { scrapeTapiola } from './tapiola';
import { scrapeMeilahti } from './meilahti';
import { DesiredSlot } from './types';

moment.locale('fi');

const ONE_MINUTE = 1000 * 60;

const desiredSlots: DesiredSlot[] = [
  { court: 'taivis', day: '2021-04-30', times: ['18:00'] },
];

const executeMainProcess = async () => {
  console.log(`\n* (${moment().format('L LT')}): Searching desired slots...`)
  await Promise.all(desiredSlots.map(desiredSlot => {
    switch (desiredSlot.court) {
      case 'tapiola':
        return scrapeTapiola(desiredSlot);
      case 'taivis':
        return scrapeTaivis(desiredSlot);
      case 'meilahti':
        return scrapeMeilahti(desiredSlot);
      default:
        throw new Error(`No process defined for court "${desiredSlot.court}"`);
    }
  }));
}

(async () => {
  await executeMainProcess();
  setInterval(async () => await executeMainProcess(), ONE_MINUTE * 5);
})();
