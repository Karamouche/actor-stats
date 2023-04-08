const R = require('ramda');
const fs = require('fs');

const openJson = R.pipe(
	fs.readFileSync,
	JSON.parse
);

const getMovieTitle = R.pipe(
	R.prop('title'),
);

const getMoviesTitles = R.pipe(
	R.map(getMovieTitle)
);

//get movies title
const movies_title = R.pipe(
	R.map(getMovieTitle)
);

const sortByProfit = R.pipe(
	R.sortBy(R.prop('profit')),
	R.reverse
);

const sortByPopularity = R.pipe(
	R.sortBy(R.prop('popularity')),
	R.reverse
);

const sortByBudget = R.pipe(
	R.sortBy(R.prop('budget')),
	R.reverse
);

const getMostPresentActor = R.pipe(
	R.map(R.prop('cast')),
	R.flatten,
	R.countBy(R.identity),
	R.toPairs,
	R.sortBy(R.last),
	R.reverse
);

const logTenMostPresentActors = R.pipe(
	getMostPresentActor,
	R.slice(0, 10),
	R.map(R.join(' with ')),
	R.map(R.flip(R.concat)(' appearances')),
	R.tap(console.log),
	R.join(", "),
	console.log
);

const dataPath = 'data/movies_database.json';
const moviesData = openJson(dataPath);
logTenMostPresentActors(moviesData);
