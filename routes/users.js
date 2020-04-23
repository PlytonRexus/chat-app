const express = require ('express');
const multer = require ('multer');
const bcrypt = require ('bcrypt');

const auth = require ('../middleware/auth');
const users = require ('../controllers/user-actions');
const User = require ('../models/User');

const router = express.Router();

const fileFilter = function fileFilter (req, file, callback)
{
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/tiff' || file.mimetype == 'image/bmp' || file.mimetype == 'image/png') {
        callback(null, true);
    }
    else{
        callback(null, false);
        console.log('Only jpeg, tiff, bmp and png file types are allowed!');
    }

}

const upload = multer({limits: {fileSize: 5242880}, fileFilter});

router.get("/", auth.auth, users.getAll);

router.get("/me", auth.auth, users.getProfile);

router.get("/:id", auth.auth, users.getById);

router.post("/", users.createUser, users.signin);

// router.delete("/:id", auth.auth, users.deleteUser);

router.patch("/:id", auth.auth, users.updateById);

router.patch("/name/:name", auth.auth, users.updateByName);

router.post("/login", users.signin);

router.post("/signin", users.signin);

router.post("/logout", auth.auth, users.signout);

router.post("/signout", auth.auth, users.signout);

router.delete("/me", auth.auth, users.deleteUser);

router.post("/me/avatar", auth.auth, upload.single("avatar"), users.uploadAvatar, users.uploadErrors);

router.get("/me/avatar", auth.auth, users.getAvatar);

router.get("/:id/avatar", users.publicAvatar);

module.exports = router;