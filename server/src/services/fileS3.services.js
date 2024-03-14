// Import required modules
require("dotenv").config();
const fs = require("fs");
const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// Get AWS configuration variables from environment
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// Create a new S3 client object with the specified configuration
const s3Client = new S3Client({
	region,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
});

// Export functions for uploading and downloading files
module.exports = {
	// Uploads a file to S3
	uploadFiles: async (file, pathFile) => {
		try {
			// Create a read stream for the file to upload
			const fileStream = fs.createReadStream(file.path);

			// Set up parameters for the S3 upload command
			const command = new PutObjectCommand({
				Bucket: bucketName,
				Body: fileStream,
				Key: pathFile + file.originalname,
			});

			// Use the S3 client object to send the upload command and return the result
			const result = await s3Client.send(command);

			return result;
		} catch (err) {
			// Log and return any errors that occur during the upload
			console.log(err);
			return err.message;
		}
	},
	// Downloads a file from S3
	getFileStream: (fileKey) => {
		// Set up parameters for the S3 download command
		const command = new GetObjectCommand({
			Key: fileKey,
			Bucket: bucketName,
		});
		// Use the S3 client object to send the download command and return the response body
		return s3Client.send(command).Body;
	},

	// Deletes multiple file from S3
	deleteFiles: async (fileS3urls, path) => {
		try {
			const objectsToDelete = fileS3urls.map(async (fileS3url) => {
				const fileName = fileS3url.split("/").pop();

				// Set up parameters for the S3 delete command
				const command = new DeleteObjectCommand({
					Bucket: bucketName,
					Key: path + fileName,
				});
				
				// Use the S3 client object to send the delete command and return the result
				await s3Client.send(command);
			});

			return;
		} catch (err) {
			// Log and return any errors that occur during the delete
			console.log(err);
			return err.message;
		}
	},
};
