import express from "express";
import {
    CreateResource,
    ReadResource,
    UpdateResource,
    DeleteResource,
} from "../db/operationsController";

const OperationsRouter = express.Router();

// Endpoint to create a resource
OperationsRouter.post("/create", CreateResource);

// Endpoint to read a resource
OperationsRouter.get("/read", ReadResource);

// Endpoint to update a resource
OperationsRouter.put("/update", UpdateResource);

// Endpoint to delete a resource
OperationsRouter.delete("/delete", DeleteResource);

export default OperationsRouter;