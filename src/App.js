import { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FeatureGrid from './Components/FeatureGrid';
import Footer from './Components/Footer';
import Header from './Components/Header';
import ProductsTab from './Components/ProductsTab';
import Slider from './Components/Slider';
import request from './Config/api';
import ChatBot from './utils/ChatBot/ChatBot';

function App() {
    const [dataProducts, setDataProducts] = useState([]);
    const [lengthCart, setLengthCart] = useState(0);
    const token = document.cookie;

    useEffect(() => {
        request.get('/api/products').then((res) => {
            setDataProducts(res.data);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                return;
            }

            const res = await request.get('/api/cart');
            res.data.map((item) => setLengthCart(item.products.length));
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="App">
            <ToastContainer limit={1} />

            <header>
                <Header setLengthCart={setLengthCart} lengthCart={lengthCart} />
            </header>

            <main>
                <div>
                    <ChatBot />
                </div>
                <div>
                    <Slider />
                </div>
                <div>
                    <ProductsTab dataProducts={dataProducts} />
                </div>

                <div>
                    <FeatureGrid />
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default App;
