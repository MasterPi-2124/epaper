const { default: mongoose } = require("mongoose");
const ClassModel = require("../models/Class");
const QuizService = require("../services/QuizService");

// Attempt to reuse the group function for future grouping (if any)
/**
 * @param {mongoose.Schema} model mongoose Schema model
 * @param {array} list the original list
 * @param {String} property property to broup by
 * @param {String} arrayName the name of the new array of each group
 * @returns {array}
 */
const groupBy = async (list, property, arrayName) => {
  // initialize return list
  let uniqueValue = [...new Set(list.map(item => item[property]))]
  let returnData = []
  uniqueValue.map((value) => {
    let data = {}
    data[property] = value;
    data[arrayName] = [];
    returnData.push(data);
  })

  // put items from old array to new array inside return list
  list.map((oldItem) => {
    returnData.map((newItem) => {
      if (oldItem[property] === newItem[property]) {
        newItem[arrayName].push(oldItem);
      }
    });
  });

  return returnData;
};

exports.getAllClasses = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("userId" in filters) {
        query.createBy = filters.userId;
      }
      if ("codename" in filters) {
        query.codename = filters.codename;
      }
    }

    let classes = await ClassModel.find(query);
    let quizzes = await QuizService.getAllQuizzes();

    // add quizzes to class
    let classObjs = [];
    classes.map((_class) => {
      classObj = _class.toObject();

      // get quiz by class and remove _class property in quiz
      let foundQuizzes = quizzes
        .filter((quiz) => quiz._class != null && quiz._class._id.toString() == _class._id.toString())
        .map((quiz) => {
          // remove _class property in quiz
          const { _class, ...returnQuiz } = quiz;
          return returnQuiz;
        });

      classObj["quizzes"] = foundQuizzes;
      classObjs.push(classObj);
    });

    // Special filter
    if (filters) {
      if ("groupBy" in filters) {
        if (filters.groupBy === "semester") {
          // This part was generalized in the groupBy function
          // This is kept for code understanding
          // // get semesters
          // let semesters = [...new Set(classObjs.map(classObj => classObj.semester))]
          // let groups = []
          // semesters.map((semester) => {
          //   const group = {
          //     semester: semester,
          //     _classes: []
          //   }
          //   groups.push(group);
          // })

          // // list classes
          // classes.map((_class) => {
          //   groups.map((group) => {
          //     if (_class.semester === group.semester) {
          //       group._classes.push(_class.toObject());
          //     }
          //   });
          // });

          // return groups;

          return await groupBy(
            classObjs,
            filters.groupBy,
            "_classes"
          );
        }
      }
    }
    // return await ClassModel.find();
    return classObjs;
  } catch (error) {
    console.log(error);
  }
};

exports.getClassById = async (id) => {
  return await ClassModel.findById(id);
};

exports.createClass = async (_class, userId = null) => {
  _class.createBy = userId;
  return await ClassModel.create(_class);
};

exports.updateClass = async (id, _class) => {
  return await ClassModel.findByIdAndUpdate(id, _class);
};

exports.deleteClass = async (id, userId = null) => {
  // Protection
  let _class = await this.getClassById(id);
  if (_class) {
    if (_class.createBy != userId) {
      return null;
    }
  } else {
    return null;
  }

  let deleteQuizzes = await QuizService.getAllQuizzes({ _class: id });
  deleteQuizzes.map((quiz) => {
    QuizService.deleteQuiz(quiz._id);
  });
  return await ClassModel.findByIdAndDelete(id);
};
