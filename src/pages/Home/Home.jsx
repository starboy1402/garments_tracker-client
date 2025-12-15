import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import OurProducts from './OurProducts';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';
import Statistics from './Statistics';

const Home = () => {
    useEffect(() => {
        document.title = 'Home - Garments Tracker';
    }, []);

    return (
        <div className="page-transition">
            <HeroSection />
            <OurProducts />
            <HowItWorks />
            <WhyChooseUs />
            <Statistics />
            <Testimonials />
        </div>
    );
};

export default Home;
