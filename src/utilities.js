const { spkBobotConfig } = require("./config");

const message = (response, code, success, message, data) => {
	return response.status(code).json({ success, code, message, data });
};

const nilaiSAW = (data) => {
	if (!data)
		return {
			ph: 0,
			kekeruhan: 0,
			skor: 0,
			kategori: null,
			createdAt: null,
		};

	const checkDataAvailable = {
		ph: data.some((item) => item.type === "PH_AIR"),
		kekeruhan: data.some((item) => item.type === "KEKERUHAN"),
	};

	if (!checkDataAvailable.ph || !checkDataAvailable.kekeruhan)
		return {
			ph: 0,
			kekeruhan: 0,
			skor: 0,
			kategori: null,
			createdAt: null,
		};

	const bobot = {
		PH: 0.6,
		KEKERUHAN: 0.4,
	};

	const latest = {};

	data.forEach((item) => {
		const key = item.type.toUpperCase();
		if (!latest[key] || new Date(item.createdAt) > new Date(latest[key].createdAt)) {
			latest[key] = item;
		}
	});

	const ph = latest.PH?.value ?? 7;
	const kekeruhan = latest.KEKERUHAN?.value ?? 100;
	const safePH = Math.min(Math.max(ph, 0), 14);
	const normPH = 1 - Math.abs(safePH - 7) / 7;
	const normKekeruhan = 1 - kekeruhan / 100;
	const skor = normPH * bobot.PH + normKekeruhan * bobot.KEKERUHAN;

	let kategori = "";
	if (skor >= 0.85) {
		kategori = "Baik";
	} else if (skor >= 0.75) {
		kategori = "Sedang";
	} else {
		kategori = "Buruk";
	}

	const responseSAW = {
		ph,
		kekeruhan,
		skor: skor.toFixed(2),
		kategori,
		createdAt: new Date(latest.PH_AIR.createdAt).getTime > new Date(latest.KEKERUHAN.createdAt) ? latest.PH_AIR.createdAt : latest.KEKERUHAN.createdAt,
	};

	return responseSAW;
};

module.exports = { message, nilaiSAW };
