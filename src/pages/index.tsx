import { YMap } from "@lib/components/YMap";
import { YMapDefaultSchemeLayer } from "@lib/components/YMapDefaultSchemeLayer";
import YMapsProvider from "@lib/components/YMapsProvider";
import { useRouter } from "next/router";
import React, { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_YMAPS_API_KEY;
const LOCATION = {
  center: [37.95, 55.65] as [number, number],
  zoom: 10,
};

const Index = (): JSX.Element => {
  // ISSUE 1
  const { query, ...router } = useRouter();
  const handleTrigger = () =>
    router.push(
      { query: { ...query, ["test"]: `${Math.random()}` } },
      undefined,
      { shallow: true }
    );
  // ALSO ISSUE 1
  const [value, setValue] = useState(0);
  const handleRandom = () => setValue(Math.random());

  return (
    <YMapsProvider apikey={API_KEY}>
      <div style={{ height: 400 }}>
        <YMap location={LOCATION}>
          <YMapDefaultSchemeLayer />
        </YMap>
      </div>
      <div>
        <button onClick={handleTrigger}>PRESS FOR ISSUE</button>
      </div>
      <div>
        <button onClick={handleRandom}>PRESS FOR ANOTHER SAME ISSUE</button>
      </div>
    </YMapsProvider>
  );
};

export default Index;
