const R = require('ramda');
const fs = require('fs');

const openJson = R.pipe(
	fs.readFileSync,
	JSON.parse
);

const getMovieTitle = R.pipe(
	R.prop('title'),
);

//get movies title
const movies_title = R.pipe(
	R.map(getMovieTitle)
);

const movies_data = openJson('data/movies_database.json');
console.log(movies_title(movies_data));