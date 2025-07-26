import { createContext, useState, useContext, useEffect } from "react";
import api from "../../api";

export const APIContext = createContext();

export const APIProvider = ({ children }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    websiteInformation();
  }, []);

  const makeRequest = async (
    method,
    endpoint,
    data = null,
    setLoading,
    setData,
    setError
  ) => {
    try {
      if (setLoading) setLoading(true);

      const isFormData = data instanceof FormData;

      const config = isFormData
        ? {}
        : { headers: { "Content-Type": "application/json" } };

      const response = await api[method](endpoint, data, config);

      if (setData) setData(response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error with ${method} request to ${endpoint}:`,
        error?.response?.data || error.message
      );
      if (setError) setError(error?.response?.data || error.message);
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  const getData = async (endpoint, setData, setLoading, setError) => {
    return makeRequest("get", endpoint, null, setLoading, setData, setError);
  };

  const postData = async (endpoint, data, setData, setLoading, setError) => {
    return makeRequest("post", endpoint, data, setLoading, setData, setError);
  };

  const putData = async (endpoint, data, setData, setLoading, setError) => {
    return makeRequest("put", endpoint, data, setLoading, setData, setError);
  };

  const deleteData = async (endpoint, setLoading, setError) => {
    return makeRequest("delete", endpoint, null, setLoading, null, setError);
  };

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/login", { username, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
      return data.message || "Login successful";
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Something went wrong";
      if (status === 401) return "Invalid username or password";
      if (status === 403)
        return "Access denied. Please contact the administrator.";
      return message;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.warn(
        "Logout failed:",
        error?.response?.data?.message || error.message
      );
    } finally {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const websiteInformation = async () => {
    let response;
    try {
      response = await api.get("/settings");
    } catch (error) {
      console.warn(
        "Fetching website information failed:",
        error?.response?.data?.message || error.message
      );
      return null;
    }
    return response;
  };

  return (
    <APIContext.Provider
      value={{
        login,
        logout,
        getData,
        postData,
        putData,
        deleteData,
        websiteInformation,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);
