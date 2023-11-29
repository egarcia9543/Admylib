const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './frontend/static/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.isbn}-${file.originalname}`);
    },
});

const upload = multer({storage: storage});

module.exports = upload;
