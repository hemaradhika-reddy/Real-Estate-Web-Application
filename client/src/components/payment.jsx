import React, { useState } from 'react';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    amount: '',
    cardType: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Determine card type based on the card number
    if (id === 'cardNumber') {
      const cardType = getCardType(value);
      setFormData((prevData) => ({
        ...prevData,
        cardType: cardType,
      }));
    }
  };

  const getCardType = (cardNumber) => {
    const visaRegex = /^4/;
    const masterCardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;

    if (visaRegex.test(cardNumber)) {
      return 'visa';
    } else if (masterCardRegex.test(cardNumber)) {
      return 'mastercard';
    } else if (amexRegex.test(cardNumber)) {
      return 'amex';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add payment gateway logic here, like Stripe or PayPal integration
    console.log('Payment Submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 shadow-xl rounded-xl transform hover:scale-105 transition-all duration-500 ease-in-out">
      <h2 className="text-4xl font-bold text-center mb-6 text-sky-800 tracking-wide transform transition-transform duration-500 ease-in-out">
        Make a Payment
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Cardholder Name */}
        <div className="transition-transform transform hover:translate-x-2">
          <label htmlFor="name" className="block text-xl font-semibold text-sky-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="border p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            required
          />
        </div>

        {/* Card Number */}
        <div className="transition-transform transform hover:translate-x-2">
          <label htmlFor="cardNumber" className="block text-xl font-semibold text-sky-700 mb-2">Card Number</label>
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              placeholder="1234 5678 9876 5432"
              value={formData.cardNumber}
              onChange={handleChange}
              className="border p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              required
            />
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              {formData.cardType === 'visa' && <FaCcVisa className="text-3xl text-blue-600" />}
              {formData.cardType === 'mastercard' && <FaCcMastercard className="text-3xl text-red-600" />}
              {formData.cardType === 'amex' && <FaCcAmex className="text-3xl text-green-600" />}
            </div>
          </div>
        </div>

        {/* Expiration Date & CVV */}
        <div className="flex gap-4 transition-transform transform hover:translate-x-2">
          <div className="flex-1">
            <label htmlFor="expirationDate" className="block text-xl font-semibold text-sky-700 mb-2">Expiration Date</label>
            <input
              type="text"
              id="expirationDate"
              placeholder="MM/YY"
              value={formData.expirationDate}
              onChange={handleChange}
              className="border p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="cvv" className="block text-xl font-semibold text-sky-700 mb-2">CVV</label>
            <input
              type="text"
              id="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
              className="border p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              required
            />
          </div>
        </div>

        {/* Amount */}
        <div className="transition-transform transform hover:translate-x-2">
          <label htmlFor="amount" className="block text-xl font-semibold text-sky-700 mb-2">Amount</label>
          <input
            type="number"
            id="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            className="border p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-sky-600 text-white p-4 rounded-lg hover:bg-sky-700 transform hover:scale-110 transition-all duration-500 ease-in-out shadow-xl"
        >
          Make Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
