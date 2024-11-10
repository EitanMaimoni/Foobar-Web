import { useContext } from 'react';
import React from 'react';
import './navigationBar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FeedSection from '../feedSection/feedSection';
import OptionSection from '../optionSection/optionSection';
import { ThemeContext } from '../themeContext/themeContext';

const NavigationBar = ({ currentPage }) => {

    // Use the theme and toggleTheme from the ThemeContext
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <nav className="navbar">

            <div className="navbar-left">
                <i className="bi bi-facebook logo-icon"></i>
                <button className="toggle-theme-btn" onClick={toggleTheme}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <form className="search-form">
                    <input className="form-control search-input" type="search" placeholder="Search Facebook" aria-label="Search" />
                </form>
            </div>

            <div className="navbar-center">
                <FeedSection currentPage={currentPage} />
            </div>

            <div className="navbar-right">
                <OptionSection />
            </div>

        </nav>
    );
};

export default NavigationBar;
