import moment from 'moment';
import { scrapeTaivis } from './taivis';
import { scrapeTapiola } from './tapiola';
import { scrapeMeilahti } from './meilahti';
import { DesiredSlot } from './types';

moment.locale('fi');

const ONE_MINUTE = 1000 * 60;

const desiredSlots: DesiredSlot[] = [
  { court: 'tapiola', day: '2020-12-06', times: ['10:00'] },
  { court: 'taivis', day:  '2020-11-19', times: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'] },
  { court: 'meilahti', day:  '2020-11-19', times: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'] },
];

const executeMainProcess = async () => {
  console.log(`\n* Searching desired slots on ${moment().format('L LT')}...`)
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
