import moment from 'moment';
import { scrapePlayFi } from './playfi';
import { DesiredSlot } from './types';

moment.locale('fi');

const ONE_MINUTE = 1000 * 60;

const desiredSlots: DesiredSlot[] = [
  { system: 'playfi', court: 'varisto', day: '2022-02-15', times: ['08:30'] },
];

const executeMainProcess = async () => {
  console.log(`\n* (${moment().format('L LT')}): Searching desired slots...`)
  await Promise.all(desiredSlots.map(desiredSlot => {
    switch (desiredSlot.system) {
      case 'playfi':
        return scrapePlayFi(desiredSlot);
      default:
        throw new Error(`No process defined for court "${desiredSlot.court}"`);
    }
  }));
}

(async () => {
  await executeMainProcess();
  setInterval(async () => await executeMainProcess(), ONE_MINUTE * 5);
})();
