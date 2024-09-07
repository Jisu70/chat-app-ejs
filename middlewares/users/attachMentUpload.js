const uploader = require("../../utilities/singleUploader");

function attachmentUpload(req, res, next) {
  const upload = uploader(
    "attachments",
    ["image/jpeg", "image/jpg", "image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    3000000,
    "Only .jpg, .jpeg, .png, .pdf, or .docx format allowed!"
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("File upload error:", err);
      res.status(500).json({
        errors: {
          file: {
            msg: err.message,
          },
        },
      });
    } else {
      console.log("File uploaded successfully:", req.files);
      next();
    }
  });
}

module.exports = {
  attachmentUpload
};
