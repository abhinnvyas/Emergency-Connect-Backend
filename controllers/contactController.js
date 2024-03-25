const prisma = require("../prisma/index");

exports.createContact = async (req, res, next) => {
  try {
    const id = req.userId;
    const { name, phone } = req.body;

    if (!name || !phone || !id) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required" });
    }

    const currentContacts = await prisma.contact.findMany({
      where: {
        userId: id,
      },
    });

    if (currentContacts.length > 5) {
      return res
        .status(400)
        .json({ status: false, msg: "You can't have more than 5 contacts" });
    }

    if (currentContacts.some((contact) => contact.phone === phone)) {
      return res.status(400).json({
        status: false,
        msg: "Contact with this number already exists",
      });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
        user: {
          connect: {
            id,
          },
        },
      },
    });

    if (!contact) {
      return res
        .status(400)
        .json({ status: false, msg: "Contact Creation Failed" });
    }

    return res
      .status(201)
      .json({ status: true, msg: "Contact Created Successfully" });
  } catch (err) {
    console.log("Error at contactController/createContact: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};

exports.getUserContacts = async (req, res, next) => {
  try {
    const id = req.userId;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "User id is required" });
    }

    const contacts = await prisma.contact.findMany({
      where: {
        userId: id,
      },
    });

    if (!contacts) {
      return res.status(404).json({ status: false, msg: "No Contacts Found" });
    }

    return res.status(200).json({ status: true, data: contacts });
  } catch (err) {
    console.log("Error at contactController/getUserContacts: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const id = req.userId;
    const contactId = req.params.id;
    if (!id || !contactId) {
      return res
        .status(400)
        .json({ status: false, msg: "Contact id is required" });
    }

    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
    });

    if (!contact) {
      return res.status(404).json({ status: false, msg: "Contact Not Found" });
    }

    if (contact.userId !== id) {
      return res.status(401).json({
        status: false,
        msg: "You are trying to delete someone else's contact. You do not have permission to do that.",
      });
    }

    await prisma.contact.delete({
      where: {
        id: contactId,
      },
    });

    return res
      .status(200)
      .json({ status: true, msg: "Contact Deleted Successfully" });
  } catch (err) {
    console.log("Error at contactController/deleteContact: ", err.message);
    return res.status(400).json({ status: false, msg: err.message });
  }
};
