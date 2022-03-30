import * as React from "react";
import axios from "axios";

const url = "http://localhost:3001/running";

export const useRunning = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const getRotas = React.useCallback(async () => {
    setLoading(true);
    await axios
      .get(url + "/rotas")
      .then((datas) => {
        if (datas.data) {
          setData(datas.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    getRotas,
    data,
    loading,
  };
};
