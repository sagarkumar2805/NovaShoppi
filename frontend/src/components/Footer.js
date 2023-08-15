import React from 'react';

// Footer component to display website navigation links and copyright information
function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    {/* Women's section */}
                    <div className="col-sm-3">
                        <h3>Women</h3>
                        <ul>
                            <li><a href="WomenDress.html">Dresses</a></li>
                            <li><a href="womenPant.html">Pants</a></li>
                            <li><a href="womenSkirt.html">Jeans</a></li>
                        </ul>
                    </div>
                    {/* Men's section */}
                    <div className="col-sm-3">
                        <h3>Men</h3>
                        <ul>
                            <li><a href="mensShirt.html">Shirts</a></li>
                            <li><a href="MensPants.html">Trousers</a></li>
                            <li><a href="MensHoodies.html">Jackets</a></li>
                        </ul>
                    </div>
                    {/* Kids' section */}
                    <div className="col-sm-3">
                        <a href="kids.html"><h3>Kids</h3></a>
                    </div>
                    {/* Links section */}
                    <div className="col-sm-3">
                        <h3>Links</h3>
                        <ul>
                            <li><a href="home.html">Home</a></li>
                            <li><a href="contactUs.html">Contact</a></li>
                            <li><a href="loginPage.html">Login</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Divider line */}
            <div className="divider"></div>
            {/* Copyright information */}
            <div className="copyright">
                <p>Copyright &copy; E-Commerce 2022-2023</p>
            </div>
        </footer>
    );
}

export default Footer;
