# Welcome to the actor-stats repo !

actor-stats is a javascript node program that give us some statistics about actor and films from a dataset.
The dataset is a json file that contains a list of films (from 1915 to 2017) and the actors that played in it.
Other informations are also available like the genre, the profit, the rating, etc.

## Requirements

For development, you will only need Node.js and a node global package, such as Yarn, installed in your environement.

## Install

    $ git clone https://github.com/Karamouche/actor-stats
    $ cd actor-stats
    $ yarn install

## Running the project

    $ yarn run main

## Running for debug with nodemon

    $ yarn run dev

## Features

The project provides the following features to analyse the data:

-   **sortByProfit**: Sorts the movies by their profit (revenue minus budget) in descending order.
-   **sortByPopularity**: Sorts the movies by their popularity (as measured by an arbitrary score) in descending order.
-   **sortByBudget**: Sorts the movies by their budget in descending order.
-   **sortByYear**: Sorts the movies by their year of release in ascending order.
-   **filterYear**: Filters the movies by a given year interval.
-   **getMostPresentActor**: Returns the actors with the most appearances in movies within a given year interval.
-   **getMoviesFromActor**: Returns a list of movies in which a given actor appears.
-   **getMostBankableActors**: Returns the actors with the highest average profit across all the movies in which they appeared within a given year interval.

## Exemples

Log the 10 most present actors in movies released between 1995 and 2000:

```javascript
logMostPresentActors(10, [1995, 2000]);
```

Log the 10 most bankable actors in movies released between 1980 and 2000:

```javascript
logMostBankableActors(10, [1980, 2000]);
```

Log all movies in which Tom Hanks appears, released between 1980 and 2000, sorted by year of release:

```javascript
const moviesTomHanks = R.pipe(
	getMoviesFromActor("Tom Hanks"),
	filterYear([1980, 2000]),
	sortByYear,
	formatMovieInformation
)(moviesData);
console.log(moviesTomHanks.join("\n"));
```

## Credits

The dataset used was provided by [Kaggle](https://www.kaggle.com/rounakbanik/the-movies-dataset).

## Contributors

This project was created by Karamouche and ArRegulus. Feel free to contribute by opening a pull request or submitting an issue.

## License

[MIT](https://choosealicense.com/licenses/mit/)
