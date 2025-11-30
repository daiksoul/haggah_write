import '$lib/util/array';

export var toastStore:ToastListStateObject = $state({
  lastId: 0,
  list:[
    
  ]
});

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

export function showToast(message: string, type:string, dismissible:boolean){
  let newId = toastStore.lastId;
  
  toastStore.list.push({
    id: newId,
    message,
    type,
    dismissible,
  });

  toastStore.lastId += 1;

  setTimeout(()=> toastStore.list.removeWhere((v) => v.id != newId), 5000);
}