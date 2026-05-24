import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export const useToastLoader = (loading, error, data, messages) => {
  const [hasFetched, setHasFetched] = useState(false);
  const toastId = useRef(null);

  useEffect(() => {
    if (loading) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.loading(messages.loading || "Loading...");
      }
    }else if (toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = null;
      setHasFetched(true);
      if (error) {
        toast.error(messages.error || "Something went wrong");
      } else if (data) {
        // Optional: toast.success(messages.success || "Loaded!");
      }
    }
  }, [loading, error, data]);

  return { hasFetched };
};