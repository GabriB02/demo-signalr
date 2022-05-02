import { atom } from 'recoil';

export const userAtom = atom({
  key: 'userAtom',
  default: null,
});

export const roomAtom = atom({
  key: 'roomAtom',
  default: null,
});
