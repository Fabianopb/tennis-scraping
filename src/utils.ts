import moment from 'moment';
import open from 'open';
import { DesiredSlot } from './types';

export const matchFreeAndDesiredSlots = async (desiredSlot: DesiredSlot, freeTimes: string[], url: string) => {
  if (desiredSlot.times.some(time => freeTimes.includes(time))) {
    console.log('Found available courts in Taivis! Closing process...');
    console.log(`Slots on ${moment(desiredSlot.day).format('L')}`);
    console.log(freeTimes, '\n');
    await open(url);
    process.exit(0);
  } else {
    console.log(`no desired slots in ${desiredSlot.court} for ${desiredSlot.day}`);
  }
}