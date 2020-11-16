import axios from 'axios';
import moment from 'moment';
import open from 'open';
import { DesiredSlot } from './types';
import { matchFreeAndDesiredSlots } from './utils';

const getSearchUrl = (date: string) =>
 `https://meilahti.slsystems.fi/booking/booking-calendar?BookingCalForm%5Bp_laji%5D=1&BookingCalForm%5Bp_pvm%5D=${date}`

export const scrapeMeilahti = async (desiredSlot: DesiredSlot) => {
  const url = getSearchUrl(desiredSlot.day)
  const response = await axios.get<string>(url);
  const freeSlotElements = response.data.match(/K\d+\s\d+:\d+/g);
  const freeSlots = (freeSlotElements || []).map(el => el.split(' ')[1]);
  await matchFreeAndDesiredSlots(desiredSlot, freeSlots, url);
}