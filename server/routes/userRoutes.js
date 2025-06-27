const {register, login, setAvatar, getAllUsers, logout} = require('../controllers/userControllers')

const router  = require('express').Router()

router.post('/register',register)

router.post('/login',login)

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching avatar for id:", id); // Add this line
    const response = await axios.get(`https://api.multiavatar.com/${id}.svg`);
    res.set("Content-Type", "image/svg+xml");
    res.send(response.data);
  } catch (err) {
    console.error("Error fetching avatar:", err.message);
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

router.get('/allusers/:id',getAllUsers)

module.exports= router;
