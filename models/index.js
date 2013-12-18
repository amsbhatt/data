var DNAlibs = {
     pg: require('pg'),
     hstore: require('pg-hstore'),
     conString: process.env.DATABASE_URL || "postgres://postgres@localhost/dna",
     $ : require('jquery')
};

module.exports = DNAlibs;
