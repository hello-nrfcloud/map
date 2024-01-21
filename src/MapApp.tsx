import { Devices } from "./component/Devices.jsx";
import { useParameters } from "./context/Parameters.js";

export const MapApp = () => {
  const parameters = useParameters();

  return (
    <>
      <main>
        <Devices />
      </main>
      <aside style={{ "margin-top": "2rem" }}>
        <h1>Parameters</h1>
        <dl>
          <dt>
            <code>devicesAPIURL</code>
          </dt>
          <dd>
            <code>{parameters.devicesAPIURL.toString()}</code>
          </dd>
        </dl>
      </aside>
    </>
  );
};
