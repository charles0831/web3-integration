import "./App.css";
import Main from "./View/Main";
import { Web3Provider } from "utils/Web3Provider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <Main />
        <Toaster />
      </Web3Provider>
    </div>
  );
}

export default App;
