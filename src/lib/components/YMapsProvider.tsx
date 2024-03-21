import { Reactify } from "@yandex/ymaps3-types/reactify";
import React, {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { YMaps } from "../store";
import useIsomorphicEffect from "../hooks/useIsomorphicEffect";
import { initializeAction, store } from "../store";

export interface YMapsContext {
  ymaps?: YMaps | null;
  reactify?: Reactify | null;
}

export interface YMapsProviderProps {
  apikey: string | undefined;
  lang?: string;
  children?: React.ReactNode;
}

export const ymapsContext = createContext<YMapsContext>(null!);

const YMapsProvider = ({
  apikey,
  lang,
  children,
}: YMapsProviderProps): JSX.Element => {
  const state = useSyncExternalStore(
    store.subscribe,
    () => store.getState(),
    () => ({
      reactify: null,
      ymaps: null,
    })
  );

  useIsomorphicEffect(() => {
    if (apikey) initializeAction({ apikey, lang });
  }, [apikey, lang]);

  return (
    <ymapsContext.Provider
      value={{
        ymaps: state.ymaps,
        reactify: state.reactify,
      }}
    >
      {children}
    </ymapsContext.Provider>
  );
};

export default YMapsProvider;

export const useYMapsContext = () => {
  const value = useContext(ymapsContext) ?? ({} as YMapsContext);
  return useMemo(() => value, [value]);
};
