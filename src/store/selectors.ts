import type { Store } from './createStore';

export const getFollowerLen = (store: Store) => store.follower.length;
