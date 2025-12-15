import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FiStar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Production Manager',
        company: 'Fashion House Ltd.',
        image: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        text: 'This platform has revolutionized our production workflow. The tracking system is incredibly detailed and helps us maintain quality at every stage.',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'CEO',
        company: 'Textile Innovations Inc.',
        image: 'https://i.pravatar.cc/150?img=13',
        rating: 5,
        text: 'Outstanding service! The order management system is intuitive and has significantly reduced our processing time. Highly recommended!',
    },
    {
        id: 3,
        name: 'Emma Davis',
        role: 'Buyer',
        company: 'Retail Giant Co.',
        image: 'https://i.pravatar.cc/150?img=5',
        rating: 5,
        text: 'As a buyer, I appreciate the transparency and real-time updates. It makes planning and inventory management so much easier.',
    },
    {
        id: 4,
        name: 'James Wilson',
        role: 'Operations Director',
        company: 'Global Garments',
        image: 'https://i.pravatar.cc/150?img=12',
        rating: 4,
        text: 'Great platform with excellent features. The analytics dashboard provides valuable insights for decision-making.',
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">What Our Clients Say</h2>
                    <p className="section-subtitle">
                        Trusted by industry leaders worldwide
                    </p>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-12"
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="card h-full"
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {testimonial.role}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-1 mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <FiStar key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 italic">
                                    "{testimonial.text}"
                                </p>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Testimonials;
