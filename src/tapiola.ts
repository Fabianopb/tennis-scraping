import axios from 'axios';
import moment from 'moment';
import open from 'open';
import { DesiredSlot } from './types';

const getSearchUrl = (date: string) =>
  `https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`;

export const scrapeTapiola = async (desiredSlot: DesiredSlot) => {
  const url = getSearchUrl(desiredSlot.day)
  const response = await axios.get<string>(url);
  const freeSlotElements = response.data.match(/Te\d+<br>\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split('<br>')[1]);
  if (desiredSlot.times.some(time => freeSlots.includes(time))) {
    console.log('Found available courts in Tapiola! Closing process...');
    console.log(`Slots on ${moment(desiredSlot.day).format('L')}`);
    console.log(freeSlots, '\n');
    await open(url);
    process.exit(0);
  } else {
    console.log(`no desired slots in ${desiredSlot.court} for ${desiredSlot.day}`);
  }
}