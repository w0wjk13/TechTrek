import { Mongo } from "meteor/mongo";
import { FilesCollection } from "meteor/ostrio:files";

// export const LinksCollection = new Mongo.Collection('links');
export const Study = new Mongo.Collection("studys");
export const StudyUsers = new Mongo.Collection("studyUsers");

export const Files = new FilesCollection({
  collectionName: "files",
});
export const StudyNotifications = new Mongo.Collection("studyNotifications");
