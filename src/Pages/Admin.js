import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from '../Styles/Admin.module.scss';
import 'react-toastify/dist/ReactToastify.css';

import SlideBar from './Admin/SlideBar/SlideBar';
import HomePage from './Admin/HomePage/HomePage';

const cx = classNames.bind(styles);

const Admin = () => {
    useEffect(() => {
        document.title = 'Quản Trị Admin';
    }, []);

    const [checkTypeSlideBar, setCheckTypeSlideBar] = useState(1);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('slidebar')}>
                <SlideBar setCheckTypeSlideBar={setCheckTypeSlideBar} checkTypeSlideBar={checkTypeSlideBar} />
            </div>

            <div className={cx('home-page')}>
                <HomePage checkTypeSlideBar={checkTypeSlideBar} />
            </div>
        </div>
    );
};

export default Admin;
