import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Books from "./pages/Books";

const App = () => {
    return (
        <div className="h-screen">
            <Navbar />
            <AppRoutes />
            <Books />
        </div>
    );
};

export default App;
