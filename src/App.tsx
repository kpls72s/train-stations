import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import type { MapDetails } from "./Components/MapComponent/MapComponentTypes";
import { ListComponent } from "./Components/ListComponent/ListComponent";
import MapComponent from "./Components/MapComponent/MapComponent";
import MapSkeleton from "./Components/MapSkeleton/MapSkeleton";
import ListSkeleton from "./Components/ListSkeleton/ListSkeleton";

function App() {
  const [data, setData] = useState<MapDetails | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  const [filterByCity, setFilterByCity] = useState<string>("");
  const [filterByStation, setFilterByStation] = useState<string>("");

  const CITY_LIST = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ id: number; option: string; value: string }> = [];
    for (const station of data) {
      if (!seen.has(station.city)) {
        seen.add(station.city);
        list.push({ id: station.id, option: station.city, value: station.city });
      }
    }
    return list;
  }, [data]);

  const STATIONS = useMemo(() => {
    return data
      .filter((station) => {
        if (filterByCity !== "")
          return filterByCity == station.city ? true : false;
        else return true;
      })
      .map((station) => {
        return {
          id: station.id,
          option: `${station.name}, ${station.city}`,
          value: station.id,
        };
      });
  }, [data, filterByCity]);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null)
    fetch(
      "https://gist.githubusercontent.com/neysidev/bbd40032f0f4e167a1e6a8b3e99a490c/raw/fc7dc242f41393845d90edaa99e32e28f1ddfe24/train-stations.json",
      {
        method: "get",
      },
    )
      .then((respons) => respons.json())
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const filterByStationHandler = useCallback((value: string) => {
    setFilterByStation(value);
  }, []);

  const filterByCityHandler = useCallback((value: string) => {
    setFilterByCity(value);
  }, []);

  const resetFilters = useCallback(() => {
    setFilterByCity("");
    setFilterByStation("");
  }, []);

  if (error)
    return (
      <div className="flex flex-col items-center justify-center absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <p className="text-xl lg:text-4xl font-bold text-center">
          Error: {error.message}
        </p>
        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded mx-auto mt-5"
        >
          Retry
        </button>
      </div>
    );

  return (
    <>
      <div className="w-screen flex flex-col lg:flex-row p-6 h-screen justify-evenly">
        <div className="lg:w-6/12">
          <div className=" mx-auto flex flex-col lg:flex-row">
            {loading ? (
              <ListSkeleton />
            ) : (
              <ListComponent
                title="City"
                description="Filter Stations By City Name"
                filter={filterByCityHandler}
                options={CITY_LIST}
                isReset={filterByCity == ""}
              ></ListComponent>
            )}

            {loading ? (
              <ListSkeleton />
            ) : (
              <ListComponent
                title="Station"
                description="Stations List"
                filter={filterByStationHandler}
                options={STATIONS}
                isReset={filterByStation == ""}
              ></ListComponent>
            )}
          </div>
          <div className="w-full flex justify-center">
            {loading ? (
              <div className="w-25 h-10 py-2 px-4 rounded mx-auto mt-5 animate-pulse bg-gray-200"></div>
            ) : (
              <button
                onClick={resetFilters}
                className="bg-blue-500 hover:bg-blue-700 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded mx-auto mt-5"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        <div className="lg:w-6/12">
          {loading ? (
            <MapSkeleton />
          ) : (
            <MapComponent
              city={filterByCity}
              filterBystation={filterByStation}
              filterByStationHandler={filterByStationHandler}
              stations={data}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
