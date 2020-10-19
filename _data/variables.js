module.exports = {
	environment: process.env.ELEVENTY_ENV,
	date: new Date(),
	date_month: new Date().getMonth() + 1,	
	date_day: new Date().getDate(),
	date_year: new Date().getFullYear()
};