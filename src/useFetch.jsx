import axios from "axios"
import { useCallback, useEffect, useState } from "react"

export default function useFetch(url, initialData){
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const refetch = useCallback(() => {
    setLoading(true)
    axios(url)
    .then((response) => {setData(response.data)})
    .catch((error) => {setError(error.message)})
    .finally(()  => {setLoading(false)})
  },[url])

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {data, loading, error, refetch}
}