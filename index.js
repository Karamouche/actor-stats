const R = require('ramda');
const fs = require('fs');

const dataPath = 'data/movies_database.json';

const openJson = R.pipe(
	fs.readFileSync,
	JSON.parse
);

const moviesData = openJson(dataPath);

const getMovieTitle = R.pipe(
	R.prop('title'),
);

const getMoviesTitles = R.pipe(
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
)(moviesData);

const logMostPresentActors = amount => R.pipe(
	getMostPresentActor,
	R.slice(0, amount),
	R.map(R.join(' with ')),
	R.map(R.flip(R.concat)(' appearances')),
	R.join("\n"),
	console.log
);

//gest a list of movies from an actor
const getMoviesFromActor = actor => R.pipe(
	R.filter(R.pipe(
		R.prop('cast'),
		R.includes(actor)
	)),
	R.map(R.prop('title'))
);

//get a list of actors wich have the best profit average
const getMostBankableActors = R.pipe(
	R.map(R.prop('cast')),
	R.flatten,
	R.uniq,
	R.map(actor => ({
		actor,
		averageProfit: R.pipe(
			R.filter(R.pipe(
				R.prop('cast'),
				R.includes(actor)
			)),
			R.map(R.prop('profit')),
			R.mean
		)(moviesData)
	})),
	R.sortBy(R.prop('averageProfit')),
	R.reverse,
	R.map(R.props(['actor', 'averageProfit'])),
	R.map(R.map(String))
);

const logMostBankableActors = amount => R.pipe(

	getMostBankableActors,
	R.slice(0, amount),
	R.map(R.join(' with ')),
	R.map(R.flip(R.concat)(' average profit')),
	R.join("\n"),
	console.log
)(moviesData);

console.log("Top 10 of most bankable actors :")
logMostBankableActors(10);