const User = require("../models/User");
const Algorithm = require("../models/Algorithm");
const Cube = require("../models/Cube");
const Solve = require("../models/Solve");

exports.historial = async (req, res) => {
  try {
    const id = req.params.idUser;
    const userSolves = await Solve.find({ owner: id });

    const ordered = userSolves.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.render("historial", {
      title: "Profile",
      userSolves,
      ordered,
    });
		
  } catch (error) {
    //req.flash("messsages", [{ msg: error.message }]);
    console.log(error);
    res.redirect("/login");
  }
};

exports.userProfileTab = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.userName });
    if (!user) {
      throw new Error("Usernot found");
    }
    const cubes = await Cube.find({ owner: user._id });

    function getUniqueCategories(array) {
      const categories = new Set();
      array.forEach((element) => {
        categories.add(element.category);
      });
      return Array.from(categories);
    }

    const categories = getUniqueCategories(cubes);

    if (user) {
      res.render("profile", {
        title: user.username,
        user,
        cubes,
        categories,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.myCubes = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.userName });
    if (!user) {
      throw new Error("Usernot found");
    }
    const cubes = await Cube.find({ owner: user._id });

    res.render("profile_cubes", {
      title: "Your cubes",
      user,
      cubes,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.settings = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.userName });
    if (user) {
      res.render("profile_edit", {
        title: "Your profile",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.help_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.idUser);
    if (user) {
      res.render("profile_alg-set", {
        title: "Profile alg set help section",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.algCollection = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.userName });
    if (!user) {
      throw new Error("Usernot found");
    }
		
    const setOLL = await Algorithm.find({ owner: user._id, algSet: "OLL" });
    const setPLL = await Algorithm.find({ owner: user._id, algSet: "PLL" });
    const setCMLL = await Algorithm.find({ owner: user._id, algSet: "CMLL" });
    const setCOLL = await Algorithm.find({ owner: user._id, algSet: "COLL" });

    const learnedOLL = setOLL.filter((e) => e.status === "on").length;
    const learnedPLL = setPLL.filter((e) => e.status === "on").length;
    const learnedCMLL = setCMLL.filter((e) => e.status === "on").length;
    const learnedCOLL = setCOLL.filter((e) => e.status === "on").length;

    res.render("profile_alg-collection", {
      title: "Collection",
      user,
      setOLL,
      setPLL,
      setCMLL,
      setCOLL,
      learnedOLL,
      learnedPLL,
      learnedCMLL,
      learnedCOLL,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.filters = async (req, res) => {
  try {
    const user = await User.findById(req.params.idUser);
    const cubes = await Cube.find({ owner: user._id });

    function getUniqueCategories(array) {
      const categories = new Set();
      array.forEach((element) => {
        categories.add(element.category);
      });
      return Array.from(categories);
    }

    const categories = getUniqueCategories(cubes);

    res.json({
      cubes,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};
