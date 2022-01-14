const multer = require("multer");
const { v1: uuid } = require("uuid");

const MIME_TYPE_MAP = {
  // mimetype : string
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// 다른 파일 서버를 두고 싶을 땐 어떻게 하나???
const fileUpload = multer({
  limits: 500000, // 500kb
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext);
    },
  }),
  // 유효성 검사... 프론트엔드에 유효성 검사를 의존할 수 없다.
  // 프론트엔드는 개발자 도구로 모든 내용을 편집 가능하기 때문.
  fileFilter: (req, file, cb) => {
    // MIME_TYPE_MAP에서 확장자를 검색, 매치되면 유효, 아니면 무효.
    // !! <- 결과를 boolean 연산자로 변환.
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
