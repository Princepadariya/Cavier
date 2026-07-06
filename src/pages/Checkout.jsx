import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate, stagger } from 'animejs';

import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, addToCart, updateQty, removeItem, subtotal } = useCart();
  const [step, setStep] = useState('cart');
  const animRef = useRef(null);

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [addressError, setAddressError] = useState('');

  const handleGetOtp = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    setStep('address');
  };

  const handleAddAddress = () => {
    if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim()) {
      setAddressError('Please fill all required fields');
      return;
    }
    if (!/^[0-9]{6}$/.test(address.pincode)) {
      setAddressError('Please enter a valid 6-digit pincode');
      return;
    }
    setAddressError('');
    setStep('payment');
  };

  useEffect(() => {
    if (animRef.current) {
      animate(animRef.current.children, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: "spring(1, 80, 10, 0)",
        delay: stagger(100)
      });
    }
  }, [step]);

  const total = subtotal;

  const similarItems = [
    { id: 1, name: 'SO 04 101 | Pillar Cock with Base', price: 1930, img: '/images/img2.png' },
    { id: 2, name: 'SO 04 101 | Pillar Cock with Base', price: 1930, img: '/images/img2.png' },
    { id: 3, name: 'SO 04 101 | Pillar Cock with Base', price: 1930, img: '/images/img2.png' }
  ];

  return (
    <div className="bg-[#1C1C1C] min-h-screen font-outfit text-white pt-20">

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-32 py-12">
        {/* Top Section: Cart & Summary */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
          
          {/* Left Column: Dynamic Content */}
          <div className={`flex-1 ${step === 'otp' ? 'pr-0 lg:pr-12' : ''}`}>
            <div ref={animRef}>
            {step === 'cart' ? (
              <>
                <h1 className="text-3xl font-bold mb-10">Your Cart</h1>
                
                <div className="flex flex-col gap-8">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="relative pb-8 border-b border-dashed border-white/20 last:border-b-0">
                      <div className="flex flex-row gap-4 md:gap-6">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-black shrink-0 border border-white/5 rounded-sm overflow-hidden flex items-center justify-center p-2 md:p-3">
                          <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2 md:gap-4 w-full">
                            <div className="pr-2 md:pr-12">
                              <h3 className="font-outfit text-[12px] md:text-[13px] font-bold leading-snug mb-2 md:mb-3">{item.name}</h3>
                              <p className="text-[10px] text-white/50 mb-1">Color / Finish : {item.finish}</p>
                              <p className="text-[10px] text-white/50">Total Height = {item.height}</p>
                            </div>
                            
                            <button onClick={() => removeItem(item.id)} className="text-white/40 hover:text-white transition-colors shrink-0 mt-1">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>

                          <div className="flex justify-between items-center mt-4 w-full">
                            {/* Quantity */}
                            <div className="flex items-center border border-white/30 rounded-sm h-7 md:h-8">
                              <button onClick={() => updateQty(item.id, -1)} className="w-7 md:w-8 h-full flex items-center justify-center text-white/60 hover:text-white transition-colors text-xs">−</button>
                              <span className="w-7 md:w-8 h-full flex items-center justify-center text-white text-xs border-x border-white/30">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-7 md:w-8 h-full flex items-center justify-center text-white/60 hover:text-white transition-colors text-xs">+</button>
                            </div>
                            
                            {/* Price */}
                            <div className="font-outfit text-sm md:text-lg font-bold">
                              ₹{(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Dashed line already handled by wrapper border, but if we need it specifically like the screenshot: */}
                      {index === 0 && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 border-dashed" style={{borderBottom: '1px dashed rgba(255,255,255,0.2)'}}></div>}
                    </div>
                  ))}
                </div>

                <div className="mt-6 md:mt-12">
                  <Link to="/product/1" className="inline-flex items-center gap-2 text-[13px] font-semibold text-white hover:text-white/80 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-12">Checkout</h1>
                
                {step === 'otp' && (
                  <div className="mb-12">
                    <h2 className="text-[17px] font-semibold mb-2">Customer Information</h2>
                    <p className="text-sm text-white/40 mb-6">Please use the mobile number linked to your account</p>
                    
                    <input 
                      type="tel" 
                      placeholder="Enter Your Mobile Number*" 
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10));
                        setPhoneError('');
                      }}
                      className={`w-full bg-transparent border ${phoneError ? 'border-red-500' : 'border-white/20'} rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/40 mb-2`}
                    />
                    {phoneError && <p className="text-red-500 text-xs mb-4">{phoneError}</p>}
                    {!phoneError && <div className="mb-6"></div>}
                    
                    <button 
                      onClick={handleGetOtp}
                      className="w-full bg-white text-black font-semibold tracking-wide py-3.5 rounded-sm hover:bg-gray-100 transition-colors mb-8 text-[15px]"
                    >
                      Get OTP
                    </button>
                    
                    <p className="text-center text-xs text-white/40 leading-relaxed max-w-md mx-auto">
                      OTP verification required via one-time password. Enter a valid mobile<br/>number to get a six-digit code sent to your mobile or email.
                    </p>
                  </div>
                )}

                {step === 'address' && (
                  <div className="mb-12">
                    <h2 className="text-[17px] font-semibold mb-2">Shipping Information</h2>
                    <p className="text-sm text-white/40 mb-6">We ship within India. Please check your pin code serviceability before placing an order.</p>
                    
                    {addressError && <p className="text-red-500 text-xs mb-4">{addressError}</p>}
                    <input 
                      type="text" 
                      placeholder="Enter Address" 
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/40 mb-6"
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <label className="block text-[13px] font-semibold mb-2 text-white">City*</label>
                        <input 
                          type="text" 
                          placeholder="Ahmedabad" 
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/40"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[13px] font-semibold mb-2 text-white">State*</label>
                        <input 
                          type="text" 
                          placeholder="Gujarat" 
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/40"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[13px] font-semibold mb-2 text-white">Pincode*</label>
                        <input 
                          type="text" 
                          placeholder="380054" 
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                          className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/40"
                        />
                      </div>
                    </div>
                    
                    <button onClick={handleAddAddress} className="w-full bg-white text-black font-semibold tracking-wide py-3.5 rounded-sm hover:bg-gray-100 transition-colors mb-8 text-[15px]">
                      Add Address
                    </button>
                    
                    <p className="text-center text-xs text-white/40 leading-relaxed max-w-md mx-auto">
                      OTP verification required via one-time password. Enter a valid mobile<br/>number to get a six-digit code sent to your mobile or email.
                    </p>
                  </div>
                )}

                {step === 'payment' && (
                  <div className="mb-12">
                    <h2 className="text-[17px] font-semibold mb-2">Payment Method</h2>
                    <p className="text-sm text-white/40 mb-6">Choose your preferred payment method.</p>
                    
                    <div className="flex flex-col gap-4 mb-8">
                      <label className="flex items-center gap-4 p-5 border border-white/20 rounded-sm cursor-pointer hover:bg-white/5 transition-colors">
                        <input type="radio" name="payment" className="w-4 h-4 accent-white" defaultChecked />
                        <span className="text-sm font-medium">Credit / Debit Card</span>
                      </label>
                      <label className="flex items-center gap-4 p-5 border border-white/20 rounded-sm cursor-pointer hover:bg-white/5 transition-colors">
                        <input type="radio" name="payment" className="w-4 h-4 accent-white" />
                        <span className="text-sm font-medium">UPI / QR</span>
                      </label>
                      <label className="flex items-center gap-4 p-5 border border-white/20 rounded-sm cursor-pointer hover:bg-white/5 transition-colors">
                        <input type="radio" name="payment" className="w-4 h-4 accent-white" />
                        <span className="text-sm font-medium">Net Banking</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="mt-12 md:mt-32">
                  <button onClick={() => setStep('cart')} className="inline-flex items-center gap-2 text-[13px] font-semibold text-white hover:text-white/80 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="lg:pl-12 lg:border-l border-dashed border-white/20 h-full">
              <h2 className="text-2xl font-bold mb-10">Order Summary</h2>
              
              <div className="flex flex-col gap-6 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Subtotal</span>
                  <span className="text-base tracking-wide">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Estimated Shipping</span>
                  <span className="text-base tracking-wide">Free</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white/80">Total</span>
                  <span className="text-base tracking-wide">₹{total.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="flex justify-end mt-4 mb-8">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <div className="border-b border-dashed border-white/20 mb-8" />

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">Promo code</label>
                <div className="flex gap-2 sm:gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter Promo code" 
                    className="flex-1 w-full min-w-0 bg-transparent border border-white/20 rounded-sm px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/30"
                  />
                  <button className="bg-[#2A2A2A] hover:bg-[#333] border border-white/20 text-white rounded-sm px-4 sm:px-6 py-2.5 text-sm font-semibold transition-colors shrink-0">
                    Apply
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (step === 'cart') setStep('otp');
                  else if (step === 'otp') handleGetOtp();
                  else if (step === 'address') handleAddAddress();
                  else if (step === 'payment') {
                    alert('Mock payment successful!');
                    setStep('cart');
                  }
                }}
                className="w-full bg-[#2A2A2A] hover:bg-[#333] border border-white/20 text-white rounded-sm py-3.5 text-[15px] font-semibold transition-colors"
              >
                {step === 'payment' ? 'Pay Now' : step === 'address' ? 'Proceed to Payment' : step === 'otp' ? 'Continue' : 'Checkout'}
              </button>
            </div>
          </div>
          
        </div>

        {/* Similar Items Section */}
        {step === 'cart' && (
          <div className="mt-20 md:mt-32 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-12">Similar items</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {similarItems.map(item => (
                <div key={item.id} className="flex flex-col">
                <div className="relative aspect-[4/5] bg-black border border-white/10 rounded-sm overflow-hidden p-6 md:p-8 flex items-center justify-center group mb-6">
                  {/* Heart Icon */}
                  <button className="absolute top-6 right-6 text-white/40 hover:text-white z-10 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="text-center flex flex-col items-center">
                  <h3 className="font-outfit text-sm font-semibold mb-2">{item.name}</h3>
                  <p className="font-outfit text-[13px] font-bold mb-3">INR {item.price}</p>
                  
                  {/* Stars */}
                  <div className="flex gap-1 text-white mb-6">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => addToCart({
                      id: `SIMILAR-${item.id}`,
                      name: item.name,
                      price: item.price,
                      img: item.img,
                      finish: 'Chrome', // Sample finish
                      height: 'Standard'
                    })}
                    className="w-full max-w-[280px] border border-white/30 rounded-full py-2.5 text-xs font-semibold hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

      </main>
    </div>
  );
};

export default Checkout;
