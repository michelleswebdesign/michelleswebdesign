export async function onRequestPost(context) {
  const { request, env } = context;

  const body = await request.json();
  const { packageCode, addons = [] } = body;

  const packages = {
  EVENT: {
    name: "Landing Page Event Website Design",
    amount: 15000
  },
  STARTER: {
    name: "One-Page Website Design",
    amount: 35000
  },
  BUSIN: {
    name: "Business Website Design",
    amount: 75000
  },
  ECOMM: {
    name: "Ecommerce Website Design",
    amount: 120000
  },
  BUNDLE: {
    name: "Get Found on Google Bundle",
    amount: 25000
  }
};

const addonPrices = {
  EXTRA_PAGE: {
    name: "Additional Page",
    amount: 10000
  },
  CONTENT_HELP: {
    name: "Content Help",
    amount: 15000
  },
  BRANDING_HELP: {
    name: "Branding Help",
    amount: 10000
  },
  DOMAIN_SETUP: {
    name: "Domain / Hosting Setup Assistance",
    amount: 7500
  }
};
  
  const selectedPackage = packages[packageCode];

  if (!selectedPackage) {
    return new Response("Invalid package selected", { status: 400 });
  }

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: selectedPackage.name
        },
        unit_amount: selectedPackage.amount
      },
      quantity: 1
    }
  ];

  addons.forEach((addonCode) => {
    const addon = addonPrices[addonCode];

    if (addon) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: addon.name
          },
          unit_amount: addon.amount
        },
        quantity: 1
      });
    }
  });

  const params = new URLSearchParams();

  params.append("mode", "payment");
  params.append("success_url", `${env.SITE_URL}/success.html`);
  params.append("cancel_url", `${env.SITE_URL}/services.html`);

  lineItems.forEach((item, index) => {
    params.append(`line_items[${index}][quantity]`, item.quantity);
    params.append(`line_items[${index}][price_data][currency]`, item.price_data.currency);
    params.append(`line_items[${index}][price_data][unit_amount]`, item.price_data.unit_amount);
    params.append(`line_items[${index}][price_data][product_data][name]`, item.price_data.product_data.name);
  });

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const session = await stripeResponse.json();

  if (!stripeResponse.ok) {
    return new Response(JSON.stringify(session), { status: 500 });
  }

  return Response.json({ url: session.url });
}
