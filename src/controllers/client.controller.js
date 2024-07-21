import Client from "../models/client.model.js";

// Create and Save a new Client
export const registerClient = async (req, res) => {
  try {
    const { name, lastname, address, phone } = req.body;
    // Create a Client
    const client = new Client({
      name,
      lastname,
      address,
      phone,
    });
    // Save Client in the database
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
  }
};

//metodo para obtener todos los clientes
export const getClients = async (req, res) => {
  try {
    const { name } = req.query;
    let clients;
    if (name) {
      clients = await Client.find({
        name: { $regex: new RegExp(name, "i") },
      });
    } else {
      clients = await Client.find();
    }
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
  }
};

//metodo para obtener un cliente por id
export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
  }
};

//metodo para actualizar un cliente
export const updateClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const updatedClient = await Client.findByIdAndUpdate(clientId, req.body, {
      new: true,
    });
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
  }
};

