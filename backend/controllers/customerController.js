// backend/controllers/customerController.js
import Customer from "../models/Customer.js";

// @desc   Create new customer
// @route  POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, customerType, dairyOwnerName, openingBalance } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const customer = await Customer.create({
      name,
      phone: phone || "",
      address,
      customerType: customerType || "Normal",
      dairyOwnerName: dairyOwnerName || "",
      openingBalance: openingBalance || 0,
      currentBalance: openingBalance || 0,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get all customers
// @route  GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get single customer
// @route  GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Update customer
// @route  PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { name, phone, address, customerType, dairyOwnerName, openingBalance, currentBalance } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.name = name ?? customer.name;
    customer.phone = phone ?? customer.phone;
    customer.address = address ?? customer.address;
    customer.customerType = customerType ?? customer.customerType;
    customer.dairyOwnerName = dairyOwnerName ?? customer.dairyOwnerName;
    customer.openingBalance = openingBalance ?? customer.openingBalance;
    customer.currentBalance = currentBalance ?? customer.currentBalance;

    const updated = await customer.save();

    res.json(updated);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Delete customer
// @route  DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.deleteOne();
    res.json({ message: "Customer removed" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
