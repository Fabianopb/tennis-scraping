import axios from 'axios';
import moment from 'moment';
import open from 'open';
import { DesiredSlot } from './types';
import { matchFreeAndDesiredSlots } from './utils';

const getSearchUrl = (date: string) =>
  `https://vj.slsystems.fi/tennispuisto/ftpages/ft-varaus-table-01.php?laji=1&pvm=${date}&goto=0`;

export const scrapeTapiola = async (desiredSlot: DesiredSlot) => {
  const url = getSearchUrl(desiredSlot.day)
  const response = await axios.get<string>(url);
  const freeSlotElements = response.data.match(/Te\d+<br>\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split('<br>')[1]);
  await matchFreeAndDesiredSlots(desiredSlot, freeSlots, url);
}