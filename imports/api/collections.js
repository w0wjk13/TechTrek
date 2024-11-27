import { Mongo } from "meteor/mongo";
import { FilesCollection } from "meteor/ostrio:files";

export const Study = new Mongo.Collection('study');
export const Comment = new Mongo.Collection('comment');
export const Application = new Mongo.Collection('application'); 