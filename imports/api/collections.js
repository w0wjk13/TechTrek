import { Mongo } from "meteor/mongo";
import { FilesCollection } from "meteor/ostrio:files";


export const Files = new FilesCollection({
  collectionName: "files"
});
