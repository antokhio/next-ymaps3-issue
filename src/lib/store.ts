// https://stackblitz.com/edit/react-ts-1uwrue?file=store.ts

import { Reactify } from "@yandex/ymaps3-types/reactify";
import React from "react";
import ReactDOM from "react-dom";

export type YMaps = typeof import("@yandex/ymaps3-types/index");

interface Action<T, U = undefined> {
  type: T;
  payload?: U;
}

enum StoreAction {
  Initialize = "initialize",
  InitializeSuccess = "initialize-success",
  InitializeError = "initialize-error",
}

type Initialize = Action<
  StoreAction.Initialize,
  {
    apiKey: string;
    lang?: string;
  }
>;
type InitializeSuccess = Action<
  StoreAction.InitializeSuccess,
  {
    ymaps: YMaps;
    reactify: Reactify;
  }
>;

type StoreActions = Initialize | InitializeSuccess;

type StoreState = {
  ymaps: YMaps | null;
  reactify: Reactify | null;
  initializing: boolean;
  error: unknown | null;
};

const store = {
  state: {
    ymaps: null,
    reactify: null,
    loading: false,
    error: null,
  } as Partial<StoreState>,
  subscribers: [] as (() => void)[],
  reducer: ({ type, payload }: StoreActions): Partial<StoreState> => {
    switch (type) {
      case StoreAction.Initialize:
        return {
          ...store.state,
          initializing: true,
        };
      case StoreAction.InitializeSuccess: {
        return {
          ...store.state,
          ymaps: payload?.ymaps,
          reactify: payload?.reactify,
          initializing: false,
        };
      }
      default:
        return store.state;
    }
  },
  subscribe(subscriber: () => void) {
    store.subscribers = [...store.subscribers, subscriber];
    return () => {
      store.subscribers = store.subscribers.filter((s) => s !== subscriber);
    };
  },
  getState: () => store.state,
  dispatch: (action: StoreActions) => {
    store.state = store.reducer(action);
    store.subscribers.forEach((subscriber) => subscriber());
  },
};

const initializeAction = async ({
  apikey,
  lang = "ru_RU",
}: {
  apikey: string;
  lang?: string;
}) => {
  // TODO: convert to status
  if (store.getState().initializing) return;

  store.dispatch({ type: StoreAction.Initialize });

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `https://api-maps.yandex.ru/v3/?apikey=${apikey}&lang=${lang}`;

  script.onload = async () => {
    // @ts-expect-error TODO: add declartaions
    const ymaps = window.ymaps3;
    await ymaps.ready;

    const reactifier = await ymaps.import("@yandex/ymaps3-reactify");

    const reactify = reactifier.reactify.bindTo(React, ReactDOM);

    store.dispatch({
      type: StoreAction.InitializeSuccess,
      payload: {
        ymaps,
        reactify,
      },
    });
  };

  script.addEventListener("error", (e) => {
    console.log(e);
  });

  document.body.appendChild(script);
};

export { store, initializeAction };
