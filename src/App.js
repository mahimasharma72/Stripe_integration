import './App.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QPiqAA8Wpja5LnewdGq8ap3Iv3wRtaCCXYPwYd3NBWBx2KNFW7hpPxP9ThhDUCNeg7w3nsHBrsrPTI9kfC6urlh00yiOMFC9S'); // Replace with your Stripe publishable key

function App() {
  const handleStripe = async () => {
    try {
      const stripe = await stripePromise; // Load the Stripe object

      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: 'product_1', quantity: 1 }] }),
      });

      const { id } = await response.json();

      if (id) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: id, // Use the session ID returned by your backend
        });

        if (error) {
          console.error('Error redirecting to checkout:', error.message);
        }
      } else {
        console.error('Failed to create a checkout session.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <button onClick={handleStripe}>Pay Now</button>
    </div>
  );
}

export default App;
