import React, { useEffect, useState } from "react";
import App from "./App";
import SplashStatic from "./components/SplashStatic";

const Root: React.FC = () => {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Show splash screen for a short duration, then mount the main App.
    const timer = setTimeout(() => setShowApp(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return showApp ? <App /> : <SplashStatic />;
};

export default Root;
