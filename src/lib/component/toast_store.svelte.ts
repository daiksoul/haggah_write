import '$lib/util/array';
import { writable } from 'svelte/store';

export const toastList = writable<ToastListStateObject>({
  lastId: 0,
  list: []
});

// export var toastStore: ToastListStateObject = $state({
//   lastId: 0,
//   list: [
//
//   ]
// });

export interface ToastListStateObject {
  lastId: number,
  list: ToastModel[]
}

export interface ToastModel {
  message: string,
  type: string,
  dismissible: boolean,
  id: number,
}

export function showToast(message: string, type: string, dismissible: boolean) {
  // let newId = toastStore.lastId;
  //
  // toastStore.list.push({
  //   id: newId,
  //   message,
  //   type,
  //   dismissible,
  // });
  //
  // toastStore.lastId += 1;
  //
  // setTimeout(()=> toastStore.list.removeWhere((v) => v.id != newId), 5000);


  toastList.update((v) => {
    let tmp = v;

    let newId = v.lastId;

    tmp.list.push({
      id: newId,
      message,
      type,
      dismissible,
    });

    tmp.lastId += 1;

    setTimeout(() => toastList.update((v) => {
      let tmp = v;
      tmp.list.removeWhere((e) => e.id != newId);
      return tmp;
    }), 5000);

    return tmp;
  });
}
