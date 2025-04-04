import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
const App = () => {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <AppRoutes />
            </div>
            <Footer />
        </div>
    );
};

export default App;
