import { useEffect, useState } from "react";

export const useFetch = (asyncFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await asyncFunction();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => (isMounted = false);
  }, [asyncFunction]);

  return { data, loading, error };
};
