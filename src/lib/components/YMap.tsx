import React, { useMemo } from "react";
import { YMap as YMapReact } from "@yandex/ymaps3-types/react";
import { useYMapsContext } from "./YMapsProvider";

// @ts-expect-error unknowon ts-issue
export const YMap: typeof YMapReact = ({ ...props }) => {
  const { reactify, ymaps } = useYMapsContext();
  if (!reactify || !ymaps) return null;
  const Component = reactify.module(ymaps)["YMap"];
  return <Component {...props} />;
}; /*

/*
 * MEMORIZED IMPL DOES NOT HELP
 */

// export const YMap: typeof YMapReact = ({ ...props }) => {
//   const { reactify, ymaps } = useYMapsContext();
//   return useMemo(() => {
//     if (!reactify || !ymaps) return null;
//     const Component = reactify.module(ymaps)["YMap"];
//     return <Component {...props} />;
//   }, [reactify, ymaps, props]);
// };
