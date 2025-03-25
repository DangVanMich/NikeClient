import Context from './Context';
import { useEffect, useState, useMemo, useContext, createContext } from 'react';

export function Provider({ children }) {
    const [dataUser, setDataUser] = useState({});

    const getAuthUser = async () => {
        const res = await requestAuth();
        const bytes = CryptoJS.AES.decrypt(res, import.meta.env.VITE_SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const user = JSON.parse(originalText);
        setDataUser(user);
    };

    useEffect(() => {
        const token = cookies.get('logged');

        const fetchData = async () => {
            try {
                await getAuthUser();
            } catch (error) {
                console.log(error);
            }
        };
        if (token === '1') {
            fetchData();
        }

        return;
    }, []);

    return <Context.Provider value={{}}>{children}</Context.Provider>;
}
