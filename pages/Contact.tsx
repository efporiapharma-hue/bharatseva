
import React from 'react';
import { useHospital } from '../store/HospitalContext';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  const { config } = useHospital();

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Connect With Us</h1>
          <p className="text-lg text-gray-600">We are here to help you 24/7. Reach out via any channel.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                 <Phone size={24} />
               </div>
               <h4 className="text-xl font-bold mb-2">Call Us</h4>
               <p className="text-gray-500 mb-4">Speak to our reception desk.</p>
               <a href={`tel:${config.phone}`} className="text-lg font-bold text-orange-600">{config.phone}</a>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                 <Mail size={24} />
               </div>
               <h4 className="text-xl font-bold mb-2">Email Us</h4>
               <p className="text-gray-500 mb-4">For general inquiries.</p>
               <a href={`mailto:${config.email}`} className="text-lg font-bold text-green-600">{config.email}</a>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                 <MapPin size={24} />
               </div>
               <h4 className="text-xl font-bold mb-2">Visit Us</h4>
               <p className="text-gray-500 mb-4">Our physical location.</p>
               <p className="font-bold text-gray-900 leading-relaxed">{config.address}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
             <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl">
               <h2 className="text-2xl font-bold mb-8 flex items-center">
                 <MessageCircle className="mr-3 text-orange-600" /> Send a Message
               </h2>
               <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input 
                     type="text" 
                     placeholder="Your Name" 
                     className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                   />
                   <input 
                     type="tel" 
                     placeholder="Phone Number" 
                     className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                   />
                 </div>
                 <input 
                   type="email" 
                   placeholder="Email Address" 
                   className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                 />
                 <textarea 
                   rows={5} 
                   placeholder="Your Message / Inquiry" 
                   className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                 ></textarea>
                 <button 
                   type="button" 
                   className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg"
                 >
                   Send Inquiry <Send size={18} className="ml-3" />
                 </button>
               </form>
             </div>
          </div>
        </div>

        {/* Placeholder for Map */}
        <div className="mt-20 h-96 bg-gray-200 rounded-3xl relative overflow-hidden flex items-center justify-center text-gray-500 border border-gray-100">
           <img 
             src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=600&fit=crop" 
             className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" 
             alt="Map Placeholder" 
           />
           <div className="relative z-10 bg-white px-8 py-4 rounded-full shadow-2xl border border-gray-100 flex items-center">
             <MapPin className="text-red-500 mr-3" />
             <span className="font-bold text-gray-900">Hospital is located at New Delhi Hub</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
