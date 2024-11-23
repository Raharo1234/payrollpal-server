import { validationResult } from "express-validator";
import { config } from "../../config/index.js";
import jwt from "jsonwebtoken";

const generateUniqueToken = () => {
	const token = Math.random().toString(36).substr(2, 10);
	return token;
};

const generateAuthToken = (userData) => {
	const token = jwt.sign({ userData }, config.jwt_token, {
		expiresIn: "24h",
	});
	return token;
};

const validation = async (userData, validateSignup, validationMessages) => {
	const fakereq = userData.body ? { body: userData.body } : { body: userData };

	await Promise.all(
		validateSignup.map((validation) => validation.run(fakereq))
	);

	const errors = validationResult(fakereq);

	if (!errors.isEmpty()) {
		const formattedErrors = errors.array().map((error) => {
			var customMessage = validationMessages.find(
				(msg) => error.path === msg.field
			);
			return {
				field: error.param,
				message: customMessage ? customMessage.message : "Validation failed.",
			};
		});
		return formattedErrors[0].message;
	}

	return null;
};

export { validation, generateAuthToken, generateUniqueToken };
