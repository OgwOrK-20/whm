import axios, { AxiosError } from "axios";

export const getCountryByName = async (
  countryName: string | null,
  setData: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  if (!countryName) {
    setData(null);
    setLoading(false);
    return;
  }
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`;
  let response;
  try {
    response = await axios.get(url);
    if (response.data.type !== "standard") {
      setData({ findCounty: false });
      setLoading(false);
      return;
    }
    setData({
      findCountry: true,
      description: response.data.description,
      extract: response.data.extract,
    });
    setLoading(false);
  } catch (e) {
    const error = e as AxiosError;
    if (error.response?.status === 404) {
      setData({ findCountry: false });
      setLoading(false);
      return;
    }
  }
};
