import { render } from "solid-js/web";

import "the-new-css-reset/css/reset.css";
import "./base.css";

import { MapApp } from "./MapApp.js";
import { ParametersProvider } from "./context/Parameters.js";
import { DevicesProvider } from "./context/Devices.jsx";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found. ");
}

render(
  () => (
    <ParametersProvider registryURL={new URL(REGISTRY_URL)}>
      <DevicesProvider>
        <MapApp />
      </DevicesProvider>
    </ParametersProvider>
  ),
  root!
);
