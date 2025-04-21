import { Request, Response } from "express";
import { getSessionFromStorage, Session } from "@inrupt/solid-client-authn-node";
import {
    getSolidDataset,
    getThing,
    setThing,
    saveSolidDatasetAt,
    createThing,
    deleteSolidDataset,
    buildThing,
} from "@inrupt/solid-client";

// Create a resource in the pod
export async function CreateResource(req: any, res: any) {
    const session = await getSessionFromStorage(req.body.sessionId);
    if (!session?.info.isLoggedIn) {
        return res.status(401).send("User is not logged in.");
    }

    const { podUrl, data } = req.body; // Expecting podUrl and data in the request body
    const resourceUrl = `${podUrl}/newResource`;

    try {
        const thing = buildThing(createThing({ name: "exampleThing" }))
            .addStringNoLocale("http://schema.org/name", data.name)
            .addStringNoLocale("http://schema.org/description", data.description)
            .build();

        let dataset = await getSolidDataset(podUrl, { fetch: session.fetch });
        dataset = setThing(dataset, thing);

        await saveSolidDatasetAt(resourceUrl, dataset, { fetch: session.fetch });
        res.status(201).send("Resource created successfully.");
    } catch (error) {
        res.status(500).send(`Error creating resource: ${error.message}`);
    }
}

// Read a resource from the pod
export async function ReadResource(req: any, res: any) {
    const session = await getSessionFromStorage(req.body.sessionId);
    if (!session?.info.isLoggedIn) {
        return res.status(401).send("User is not logged in.");
    }

    const { resourceUrl } = req.query; // Expecting resourceUrl as a query parameter

    try {
        const dataset = await getSolidDataset(resourceUrl as string, { fetch: session.fetch });
        const thing = getThing(dataset, resourceUrl as string);

        res.status(200).json(thing);
    } catch (error) {
        res.status(500).send(`Error reading resource: ${error.message}`);
    }
}

// Update a resource in the pod
export async function UpdateResource(req: any, res: any) {
    const session = await getSessionFromStorage(req.body.sessionId);
    if (!session?.info.isLoggedIn) {
        return res.status(401).send("User is not logged in.");
    }

    const { resourceUrl, data } = req.body; // Expecting resourceUrl and data in the request body

    try {
        let dataset = await getSolidDataset(resourceUrl, { fetch: session.fetch });
        let thing = getThing(dataset, resourceUrl);

        if (!thing) {
            return res.status(404).send("Resource not found.");
        }

        thing = buildThing(thing)
            .setStringNoLocale("http://schema.org/name", data.name)
            .setStringNoLocale("http://schema.org/description", data.description)
            .build();

        dataset = setThing(dataset, thing);
        await saveSolidDatasetAt(resourceUrl, dataset, { fetch: session.fetch });

        res.status(200).send("Resource updated successfully.");
    } catch (error) {
        res.status(500).send(`Error updating resource: ${error.message}`);
    }
}

// Delete a resource from the pod
export async function DeleteResource(req: any, res: any) {
    const session = await getSessionFromStorage(req.body.sessionId);
    if (!session?.info.isLoggedIn) {
        return res.status(401).send("User is not logged in.");
    }

    const { resourceUrl } = req.body; // Expecting resourceUrl in the request body

    try {
        await deleteSolidDataset(resourceUrl, { fetch: session.fetch });
        res.status(200).send("Resource deleted successfully.");
    } catch (error) {
        res.status(500).send(`Error deleting resource: ${error.message}`);
    }
}