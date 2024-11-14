import { Mongo } from "meteor/mongo";

// export const LinksCollection = new Mongo.Collection('links');
export const Study = new Mongo.Collection("studys");
export const StudyUsers = new Mongo.Collection("studyUsers");
