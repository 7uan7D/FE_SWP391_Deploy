import React from 'react'
import { Link } from 'react-router-dom';

function AboutUs() {

    const ScrollToTop = () => {
        window.scrollTo(0, 0);
};

  return (
    <>
            <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-7">
                            <div className="section-title mb-4">
                                <h5 className="position-relative d-inline-block text-primary text-uppercase">About Us</h5>
                                <h1 className="display-5 mb-0">The Safety and Consideration </h1>
                            </div>
                            <h4 className="text-body fst-italic mb-4">Welcome to Taxis, your trusted partner for all your transportation needs.</h4>
                            <p className="mb-4">At Taxis we are committed to providing our customers with the safest, most convenient, and quickest transportation experiences. Our mission is to connect you to your destinations effortlessly while ensuring maximum satisfaction in every journey.</p>
                            <div className="row g-3">
                                <div className="col-sm-6 wow zoomIn" data-wow-delay="0.3s">
                                    <h5 className="mb-3"><i className="text-primary me-3" />Safety</h5>
                                    <h5 className="mb-3"><i className="text-primary me-3" />Professional Driver</h5>
                                </div>
                                <div className="col-sm-6 wow zoomIn" data-wow-delay="0.6s">
                                    <h5 className="mb-3"><i className="text-primary me-3" />24/7 Opened</h5>
                                    <h5 className="mb-3"><i className="text-primary me-3" />Convenient</h5>
                                </div>
                            </div>
                            <Link to={'/join-ride'} onClick={ScrollToTop} className="btn btn-primary py-2 px-4 mt-4 wow zoomIn" data-wow-delay="0.6s">Join Ride</Link>
                        </div>
                        <div className="col-lg-5" style={{ minHeight: 500 }}>
                            <div className="position-relative h-100">
                                <img className="position-absolute w-100 h-100 rounded wow zoomIn" data-wow-delay="0.9s" src="/about.jpg" style={{ objectFit: 'cover' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default AboutUs;