const stripe = require('stripe')("sk_test_51QPiqAA8Wpja5LneAAt0zUYbbfPNKJrNQomTTa5LPlnxCQcBUbARuyexfUrfZ0xwTwLvgIcqnlR5NVwkc3BNSTqT000OXLJXxL");

exports.handler = async (event) => {
  const { items } = JSON.parse(event.body);

  const transformedItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.id },
      unit_amount: 5000,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: transformedItems,
      mode: 'payment',
      success_url: `${process.env.URL}/success`,
      cancel_url: `${process.env.URL}/cancel`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
