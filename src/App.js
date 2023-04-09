import "./App.css";
import AllRoutes from "./Component/AllRoutes";
import AuthContext from "./Context/AuthContext";
import { AllContext } from "./Context/ToastContext";

function App() {
  return (
    <AllContext>
      <AuthContext>
        <div className="App">
          <AllRoutes />
        </div>
      </AuthContext>
    </AllContext>
  );
}

export default App;
