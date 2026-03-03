import axios from "axios";

const BASE_URL = "http://localhost:5000/api";
let customerId = null;
let productId = null;

async function test() {
  try {
    // 1. Get a product
    console.log("\n1️⃣ Getting products...");
    const productsRes = await axios.get(`${BASE_URL}/products`);
    if (productsRes.data.length === 0) {
      console.error("❌ No products found in database");
      return;
    }
    productId = productsRes.data[0]._id;
    console.log(`✓ Found product: ${productId}`);

    // 2. Create a customer
    console.log("\n2️⃣ Creating customer...");
    const customerRes = await axios.post(`${BASE_URL}/customers`, {
      name: "Test Customer " + Date.now(),
      phone: "9876543210",
      customerType: "Normal",
      openingBalance: 0,
    });
    customerId = customerRes.data._id;
    console.log(`✓ Created customer: ${customerId}`);

    // 3. Create a sale
    console.log("\n3️⃣ Creating sale...");
    const saleRes = await axios.post(`${BASE_URL}/sales`, {
      customerId: customerId,
      items: [
        {
          productId: productId,
          quantity: 5,
          rate: 100,
        },
      ],
      paidAmount: 250,
      paymentMode: "CASH",
      notes: "Test sale",
    });
    console.log(`✓ Created sale:`, saleRes.data);
    
    console.log("\n✅ All tests passed!");
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
  }
}

test();
