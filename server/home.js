import { Mongo } from 'meteor/mongo';
import { Study } from '/imports/api/collections';

Meteor.methods({
  searchStudies(filters, page = 1, limit = 5, sortBy = "recent") {
    const query = {};

    // Apply filters
    if (filters.city) {
      query["address.city"] = filters.city;
    }
    if (filters.gubun) {
      query["address.gubun"] = filters.gubun;
    }
    if (filters.techStack && filters.techStack.length > 0) {
      query.techStack = { $in: filters.techStack };
    }
    if (filters.roles && filters.roles.length > 0) {
      query.roles = { $in: filters.roles };
    }
    if (filters.onOffline && filters.onOffline.length > 0) {
      query.onOffline = { $in: filters.onOffline };
    }
    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }
    query.status = "모집중";
    const skip = (page - 1) * limit;

    let sortOptions = {};

    // Sorting based on the selected option
    if (sortBy === "recent") {
      sortOptions = { createdAt: -1 };  // Sort by creation date (descending)
    } else if (sortBy === "views") {
      sortOptions = { views: -1 };  // Sort by views (descending)
    } else if (sortBy === "deadline") {
      sortOptions = { studyClose: 1 };  // Sort by study close date (ascending)
    }

    const results = Study.find(query, { skip, limit, sort: sortOptions }).fetch();
    const total = Study.find(query).count();
    const totalPages = Math.ceil(total / limit); // Calculate total pages

    return { results, total, totalPages };
  },

  getAllStudies() {
    return Study.find().fetch();
  }
});