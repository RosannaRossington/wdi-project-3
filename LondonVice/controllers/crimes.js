var Crime = require("../models/crime");

function crimesIndex(req, res){
  Crime.find(function(err, crimes){
    if (err) return res.status(500).send();
    return res.status(200).json({ crimes: crimes });
  });
}

function crimesFilter(req, res){
  Crime.find({ category: req.query.category }, function(err, crimes){
    if (err) return res.status(500).send();
    return res.status(200).json({ crimes: crimes });
  });
}

module.exports = {
  index: crimesIndex,
  filter: crimesFilter
};
