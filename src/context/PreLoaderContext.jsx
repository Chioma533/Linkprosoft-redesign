import { createContext, useContext, useState } from "react";
import Preloader from "../components/common/preloader/PreLoader";

const PreLoaderContext = createContext();

export const PreLoaderProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [callback, setCallback] = useState(null);
  const showPreloader = (onFinish) => {
    setCallback(() => onFinish);
    setVisible(true);
  };

    const handleFinish = () => {
      setVisible(false);

      if (callback) {
        callback();
        setCallback(null);
      }
    };


  return (
    <PreLoaderContext.Provider
      value={{
        showPreloader,
      }}
    >
      {children}

      {visible && <Preloader onFinish={handleFinish} />}
    </PreLoaderContext.Provider>
  );
};

export const usePreloader = () => useContext(PreLoaderContext);
