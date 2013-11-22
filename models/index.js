var DNAlibs = {
     pg: require('pg'),
     hstore: require('pg-hstore'),
     conString: process.env.HEROKU_POSTGRESQL_BROWN_URL || "postgres://postgres@localhost/dna",
     $ : require('jquery')
};

module.exports = DNAlibs;
