import React from "react";
import { YMapDefaultSchemeLayer as YMapDefaultSchemeLayerReact } from "@yandex/ymaps3-types/react";
import { useYMapsContext } from "./YMapsProvider";

// @ts-expect-error unknowon ts-issue
export const YMapDefaultSchemeLayer: typeof YMapDefaultSchemeLayerReact = ({
  ...props
}) => {
  const { reactify, ymaps } = useYMapsContext();

  if (!reactify || !ymaps) return null;

  const Component = reactify.module(ymaps)["YMapDefaultSchemeLayer"];

  return <Component {...props} />;
};
