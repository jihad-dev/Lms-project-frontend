"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../src/Redux/store";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div className="flex justify-center items-center h-screen">Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}


