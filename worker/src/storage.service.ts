import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getFirestore, collection, setDoc, getDocs, getDoc, updateDoc, doc } from 'firebase/firestore';

import { Guess, IGameState, IPlayer } from '~/interfaces';

type InternalGameState = IGameState & { nonce: string; computerGuess: Guess };

const firebaseConfig: FirebaseOptions = {
  projectId: "rock-paper-scissors-85ecb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

enum Collection {
  Player = 'player',
  Game = 'game'
}

type PartialWithId<T> = Partial<T> & { id: string };

function setItem<T extends InternalGameState | IPlayer>(col: Collection, value: T) {
  return setDoc(doc(db, col, value.id), value);
}

function updateItem<T extends PartialWithId<InternalGameState | IPlayer>>(col: Collection, value: T) {
  return updateDoc(doc(db, col, value.id), value);
}

function getItem<T extends InternalGameState | IPlayer>(col: Collection, id: string): Promise<T> {
  return getDoc(doc(db, col, id)).then((doc) => doc.data() as T);
}

export const storageService = {
  setGame: (game: InternalGameState) => setItem(Collection.Game, game),
  updateGame: (game: PartialWithId<InternalGameState>) => updateItem(Collection.Game, game),
  getGame: (gameId: string) => getItem<InternalGameState>(Collection.Game, gameId),
  setPlayer: (player: IPlayer) => setItem(Collection.Player, player),
  updatePlayer: (player: PartialWithId<IPlayer>) => updateItem(Collection.Player, player),
  getPlayer: (playerId: string) => getItem<IPlayer>(Collection.Player, playerId),
  getPlayers(): Promise<IPlayer[]> {
    return getDocs(collection(db, Collection.Player)).then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data() as IPlayer);
    });
  }
};
