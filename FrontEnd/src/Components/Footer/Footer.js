import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Popup from '../Popup/Popup';
import About from '../../Pages/About/About'
import Contact from '../../Pages/Contact/Contact'
import Policy from '../../Pages/Policy/Policy'
import './Footer.css'

function Footer () {
    const [pop, setPop] = useState(false);
    const [screen, setScreen] = useState('');

    return (
        <footer className="footer">
            <Link className="link"
                onClick={() => {
                    setPop(true);
                    setScreen('A');
                }}
                >
                About us
            </Link>

            <Link className="link"
                onClick={() => {
                    setPop(true);
                    setScreen('C');
                }}
            >
                Contact us
            </Link>

            <Link className="link" 
                onClick={() => {
                    setPop(true);
                    setScreen('P');
                }}
            >
                Terms & Conidtions Policy
            </Link>

            <Popup trigger={pop} setTrigger={setPop}>
                {
                    (screen == 'A')?
                        <About />
                    : (screen == 'C')?
                        <Contact />
                    : <Policy />
                }
            </Popup>
        </footer>
    )
}

export default Footer
