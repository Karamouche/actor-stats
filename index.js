const R = require("ramda");
const fs = require("fs");

const dataPath = "data/movies_database.json";
const openJson = R.pipe(
	fs.readFileSync,
	JSON.parse,
	R.map(
		R.evolve({
			year: Number,
			budget: Number,
			profit: Number,
			popularity: Number,
			revenue: Number,
			runtime: Number,
			vote_average: Number,
		})
	)
);
const moviesData = openJson(dataPath);

const sortByProfit = R.pipe(R.sortBy(R.prop("profit")), R.reverse);

const sortByPopularity = R.pipe(R.sortBy(R.prop("popularity")), R.reverse);

const sortByBudget = R.pipe(R.sortBy(R.prop("budget")), R.reverse);

const sortByYear = R.pipe(R.sortBy(R.prop("year")));

const formatPriceDollars = R.pipe(
	R.toString,
	R.split(""),
	R.reverse,
	R.splitEvery(3),
	R.map(R.reverse),
	R.map(R.join("")),
	R.reverse,
	R.join("'"),
	R.flip(R.concat)("$")
);

// return a list of movie information with format: "title (year) - revenue"

const formatMovieInformation = R.map(
	R.pipe(
		R.props(["title", "year", "revenue"]),
		R.adjust(1, R.pipe(R.toString, R.concat("("), R.flip(R.concat)(")"))),
		R.adjust(2, formatPriceDollars),
		R.adjust(1, R.flip(R.concat)(" - ")),
		R.join(" "),
		R.flip(R.concat)(" revenue")
	)
);

//filter movies by year interval
const filterYear = (yearInterval) =>
	R.filter(
		R.pipe(
			R.prop("year"),
			R.flip(R.gte)(yearInterval[0]),
			R.and(R.flip(R.lte)(yearInterval[1])) //TODO: fix this
		)
	);

const getMostPresentActor = (yearInterval) =>
	R.pipe(
		filterYear(yearInterval),
		R.map(R.prop("cast")),
		R.flatten,
		R.countBy(R.identity),
		R.toPairs,
		R.sortBy(R.last),
		R.reverse
	);

const logMostPresentActors = (amount, yearInterval = [1915, 2017]) =>
	R.pipe(
		getMostPresentActor(yearInterval),
		R.slice(0, amount),
		R.map(R.join(" with ")),
		R.map(R.flip(R.concat)(" appearances")),
		R.join("\n"),
		console.log
	)(moviesData);

//gest a list of movies from an actor
const getMoviesFromActor = (actor) =>
	R.filter(R.pipe(R.prop("cast"), R.includes(actor)));

//get a list of actors wich have the best profit average between a year interval
const getMostBankableActors = (yearInterval = [1915, 2017]) =>
	R.pipe(
		filterYear(yearInterval),
		R.map(R.prop("cast")),
		R.flatten,
		R.uniq,
		R.map((actor) => ({
			actor,
			averageProfit: R.pipe(
				getMoviesFromActor(actor),
				R.map(R.prop("profit")),
				R.mean
			)(moviesData),
		})),
		R.sortBy(R.prop("averageProfit")),
		R.reverse,
		R.map(R.props(["actor", "averageProfit"]))
	);

const logMostBankableActors = (amount, yearInterval = [1915, 2017]) =>
	R.pipe(
		getMostBankableActors(yearInterval),
		R.slice(0, amount),
		R.map(R.adjust(1, formatPriceDollars)),
		R.map(R.join(" with ")),
		R.map(R.flip(R.concat)(" average profit")),
		R.join("\n"),
		console.log
	)(moviesData);

const main = () => {
	console.log("Movies from Harrison Ford between 1960 and 1995:");
	const moviesHarrisonFord = R.pipe(
		getMoviesFromActor("Harrison Ford"),
		filterYear([1960, 1995]),
		sortByYear,
		formatMovieInformation
	)(moviesData);
	console.log(moviesHarrisonFord.join("\n"));
	console.log("\n");
	console.log("Top 5 most bankable actors between 2000 and 2010:");
	logMostBankableActors(5, [2000, 2010]);
	console.log("\n");
	console.log("Top 10 most present actors in cinema in 2000:");
	logMostPresentActors(10, [2000, 2000]);
};

main();
