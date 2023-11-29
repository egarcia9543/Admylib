const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.body.isbn) cb(null, './frontend/static/uploads');
        else if (req.body.userDocument) cb(null, './frontend/static/userPics');
    },
    filename: (req, file, cb) => {
        const identifier = req.body.isbn ? req.body.isbn : req.body.userDocument;
        cb(null, `${identifier}-${file.originalname}`);
    },
});

const upload = multer({storage: storage});

module.exports = upload;
