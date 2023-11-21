import { useEffect, useState } from "react";

export default function useFetch(url: string) {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(url)
          .then((res) => res.json())
          .then((data) => setData(data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [url]);

  return [data];
}
