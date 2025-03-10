import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
const App = () => {
    return (
        <div className="h-screen">
            <Navbar />
            <AppRoutes />
            <Footer />
        </div>
    );
};

export default App;
