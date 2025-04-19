const { z } = require("zod");

const schema = {
	login: z.object({
		username: z.string({ required_error: "Username harus diisi" }).min(1, { message: "Username harus diisi" }),
		password: z.string({ required_error: "Password harus diisi" }).min(1, { message: "Password harus diisi" }),
	}),
	add: z.object({
		type: z.enum(["PH_AIR", "KEKERUHAN"], {
			required_error: "Type harus diisi",
		}),
		value: z.number({ required_error: "Value harus berupa angka" }).positive(),
	}),
};

module.exports = schema;
